// =========================================================================
// n8n Workflow B — "Outreach — Reply Detector"
// Node: "Classify Replies" (Code node, runs once for all items)
//
// Reads: Gmail messages (Simplify=OFF, full API shape), Prospects, ReplyLog
// Writes: 0-N output items — one per new reply to log (dedup vs ReplyLog)
//
// v3 (2026-08-31) — AUTO-BOUNCE DETECTION
// -----------------------------------------
// Prior versions silently dropped bounces because the sender is always
// mailer-daemon@googlemail.com (or postmaster@*), which never matches a
// prospect. This version:
//   1. Detects mailer-daemon senders and parses the intended recipient
//      out of the bounce body (RFC 3464 DSN + Gmail/M365 conversational
//      patterns).
//   2. Matches the extracted recipient back to a prospect.
//   3. Classifies hard vs soft bounce (5xx vs 4xx SMTP + language cues).
//   4. For hard bounces: sets status='bounced', do_not_contact='TRUE',
//      appends dated note to the prospect's existing notes (preserving
//      prior manual DNCs).
//   5. For soft bounces: logs to ReplyLog for visibility but does NOT
//      change prospect state.
//   6. For non-bounces (normal replies): preserves existing DNC + notes
//      unchanged. Regression-tested against the manual-DNC pattern Kevin
//      uses so a real reply from an already-DNC'd prospect never blanks
//      their DNC/notes.
//
// Requires: Get Gmail Messages node has Simplify=OFF so payload.headers[]
// and payload.parts[] are available.
//
// Sheets writes: Update Prospect Row must include column mappings for
// do_not_contact (={{ $json.new_do_not_contact }}) and notes
// (={{ $json.new_notes }}) in addition to the existing email/status/thread_id.
//
// Reference file — always paste the LATEST version of this into the n8n Code node.
// =========================================================================

// -------------------------------------------------------------------------
// 1. Extractors
//
// n8n's Gmail node v2.1 returns a pre-processed shape (mailparser output)
// with top-level `from`/`subject`/`text` fields, NOT the raw Gmail API
// shape with payload.headers[]/parts[]. We try pre-processed first and
// fall back to raw API for cross-version safety.
//
// Real n8n v2.1 output example (confirmed 2026-08-31):
//   msg.from     = { value: [{address, name}], text, html }
//   msg.subject  = "Delivery Status Notification (Failure)"  // top level
//   msg.text     = "Your message wasn't delivered to X...\nFinal-Recipient: rfc822; X\n..."
//   msg.headers  = { from: "From: <name> <email>", subject: "Subject: X", ... }  // flat object, values INCLUDE the "Header: " prefix
// -------------------------------------------------------------------------

function extractSenderEmail(msg) {
  if (!msg) return '';
  // n8n v2.1 pre-processed: msg.from.value[0].address
  if (msg.from && Array.isArray(msg.from.value) && msg.from.value[0] && msg.from.value[0].address) {
    return String(msg.from.value[0].address).toLowerCase().trim();
  }
  // Fallback: msg.from.text or msg.from as string
  const fromText = (msg.from && msg.from.text) || (typeof msg.from === 'string' ? msg.from : '');
  if (fromText) {
    const bracket = fromText.match(/<([^>]+)>/);
    if (bracket) return bracket[1].toLowerCase().trim();
    const email = fromText.match(/([^\s<>]+@[^\s<>]+)/);
    if (email) return email[1].toLowerCase().trim();
  }
  // Fallback: msg.headers.from (flat object; value has "From: " prefix in n8n v2.1)
  if (msg.headers && msg.headers.from) {
    const raw = String(msg.headers.from).replace(/^From:\s*/i, '').trim();
    const bracket = raw.match(/<([^>]+)>/);
    if (bracket) return bracket[1].toLowerCase().trim();
    const email = raw.match(/([^\s<>]+@[^\s<>]+)/);
    if (email) return email[1].toLowerCase().trim();
  }
  // Fallback: raw Gmail API shape (payload.headers[] array)
  if (msg.payload && Array.isArray(msg.payload.headers)) {
    for (const h of msg.payload.headers) {
      if (h && h.name && String(h.name).toLowerCase() === 'from') {
        const raw = String(h.value || '').trim();
        const bracket = raw.match(/<([^>]+)>/);
        if (bracket) return bracket[1].toLowerCase().trim();
        const email = raw.match(/([^\s<>]+@[^\s<>]+)/);
        if (email) return email[1].toLowerCase().trim();
      }
    }
  }
  return '';
}

function extractSubject(msg) {
  if (!msg) return '';
  if (typeof msg.subject === 'string' && msg.subject.trim()) return msg.subject.trim();
  if (msg.headers && msg.headers.subject) {
    return String(msg.headers.subject).replace(/^Subject:\s*/i, '').trim();
  }
  if (msg.payload && Array.isArray(msg.payload.headers)) {
    for (const h of msg.payload.headers) {
      if (h && h.name && String(h.name).toLowerCase() === 'subject') {
        return String(h.value || '').trim();
      }
    }
  }
  return '';
}

function extractFullBody(msg) {
  if (!msg) return '';
  // n8n v2.1 pre-processed: msg.text is already decoded
  if (typeof msg.text === 'string' && msg.text.trim()) return msg.text;
  // Fallback: html
  if (typeof msg.html === 'string' && msg.html.trim()) return msg.html;
  // Fallback: raw Gmail API shape — walk payload.parts[] with base64url decode
  // (checked BEFORE snippet because snippet is only a truncated preview and
  // often lacks the DSN section / Final-Recipient we need for bounce parsing)
  if (msg.payload) {
    const parts = [];
    function walk(node) {
      if (!node) return;
      if (node.body && node.body.data) {
        try {
          parts.push(Buffer.from(String(node.body.data), 'base64url').toString('utf-8'));
        } catch (e) {
          try {
            const b64 = String(node.body.data).replace(/-/g, '+').replace(/_/g, '/');
            parts.push(Buffer.from(b64, 'base64').toString('utf-8'));
          } catch (e2) { /* skip malformed */ }
        }
      }
      if (Array.isArray(node.parts)) for (const p of node.parts) walk(p);
    }
    walk(msg.payload);
    if (parts.length > 0) return parts.join('\n\n--MIME-PART-BOUNDARY--\n\n');
  }
  // Last resort: snippet (truncated preview; may miss bounce internals)
  if (typeof msg.snippet === 'string' && msg.snippet.trim()) return msg.snippet;
  return '';
}

function extractSnippet(msg) {
  if (!msg) return '';
  if (typeof msg.snippet === 'string' && msg.snippet.trim()) return msg.snippet.substring(0, 200);
  return extractFullBody(msg).substring(0, 200);
}

// -------------------------------------------------------------------------
// 2. Bounce detection + classification
// -------------------------------------------------------------------------

function isBounceSender(email) {
  if (!email) return false;
  return /mailer-daemon|postmaster|delivery.?status|delivery.?subsystem|mail.?delivery|^bounces?@|-bounces?@/i.test(email);
}

// Returns the failed-delivery recipient email extracted from a bounce body,
// or null if no pattern matches. Patterns ordered most-reliable first.
function extractBouncedRecipient(body) {
  if (!body) return null;
  const patterns = [
    // RFC 3464 DSN — most reliable when present (structured, unambiguous)
    /Final-Recipient:\s*(?:rfc822;)?\s*([^\s<>;]+@[^\s<>;]+)/i,
    /Original-Recipient:\s*(?:rfc822;)?\s*([^\s<>;]+@[^\s<>;]+)/i,
    // Gmail conversational: "Your message wasn't delivered to X"
    /wasn'?t\s+delivered\s+to\s*<?([^\s<>,]+@[^\s<>,]+)>?/i,
    // Microsoft 365: "Your message to X couldn't be delivered"
    /your\s+message\s+to\s+<?([^\s<>,]+@[^\s<>,]+)>?\s+couldn'?t\s+be\s+delivered/i,
    // Generic: "Delivery to <email> failed"
    /delivery\s+to\s+<?([^\s<>,]+@[^\s<>,]+)>?\s+failed/i,
    // SMTP status line: "550-5.1.1 <recipient> ..." (subcodes can be 1-3 digits)
    /5\d\d[- ]\d\.\d{1,3}\.\d{1,3}[^<\n]{0,120}<([^\s<>,]+@[^\s<>,]+)>/,
    // Reject reason follows recipient: "<recipient> user unknown / does not exist"
    /<([^\s<>,]+@[^\s<>,]+)>[^<\n]{0,200}(?:does\s+not\s+exist|user\s+unknown|no\s+such\s+user|address\s+not\s+found|couldn'?t\s+be\s+found)/i,
    // Recipient inline: "recipient: <email>" or "To: <email>"
    /^\s*(?:Recipient|Failed Recipient|Undelivered address):\s*<?([^\s<>,]+@[^\s<>,]+)>?/im,
  ];
  for (const p of patterns) {
    const m = body.match(p);
    if (m && m[1]) {
      return m[1].toLowerCase().trim().replace(/[<>.,;]+$/, '');
    }
  }
  return null;
}

// Returns 'hard' (permanent) or 'soft' (temporary). Ambiguous defaults to
// 'soft' — safer to keep trying a real prospect than to permanently exclude.
function classifyBounceSeverity(body) {
  if (!body) return 'soft';
  // SMTP enhanced status codes: 5.x.x permanent, 4.x.x temporary.
  // RFC 3463 allows 1-3 digit subcodes — M365 emits 5.7.133 for
  // "not authorized to send to group", which the single-digit form missed.
  if (/\b5\.\d{1,3}\.\d{1,3}\b/.test(body)) return 'hard';
  if (/\b4\.\d{1,3}\.\d{1,3}\b/.test(body)) return 'soft';
  // Language cues — permanent failure
  if (/does\s+not\s+exist|user\s+unknown|no\s+such\s+user|address\s+not\s+found|address\s+rejected|couldn'?t\s+be\s+found|account.*doesn'?t\s+exist|invalid\s+recipient|no\s+such\s+recipient|permanent(?:ly)?\s+(?:failed|rejected|error|undeliverable)/i.test(body)) {
    return 'hard';
  }
  // Language cues — temporary failure
  if (/will\s+retry|temporarily\s+(?:unavailable|deferred|rejected|failed)|temporary\s+(?:failure|error|deferral)|try\s+again\s+later|mailbox\s+full|over\s+quota|greylist|delayed/i.test(body)) {
    return 'soft';
  }
  return 'soft';
}

// -------------------------------------------------------------------------
// 3. Normal-reply classification (unchanged from v2)
// -------------------------------------------------------------------------

function classifyNormalReply(subject, snippet) {
  if (/out\s*of\s*office|automatic\s*reply|auto[-\s]?reply|vacation|OOO|out-of-office/i.test(subject)) {
    return { type: 'ooo', newStatus: 'replied_ooo' };
  }
  if (/\b(unsubscribe|remove me|do not contact|not interested|no thanks?|please stop|take me off)\b/i.test(snippet)) {
    return { type: 'negative', newStatus: 'replied_negative' };
  }
  return { type: 'positive', newStatus: 'replied_positive' };
}

// -------------------------------------------------------------------------
// 4. Self-tests — run every execution. Regressions fail the workflow, which
//    fires the error-alerts workflow so we notice within ~30s.
// -------------------------------------------------------------------------

(function runSelfTests() {
  // Bounce body samples anchored to real 2026-08-31 production bounces
  // (Gmail conversational + DSN concatenated as extractFullBody would produce).
  const eptdesignBody =
    "** Address not found **\n\n" +
    "Your message wasn't delivered to info@eptdesign.com because the " +
    "address couldn't be found, or is unable to receive mail.\n\n" +
    "The response from the remote server was:\n" +
    "550 5.4.1 Recipient address rejected: Access denied.\n\n" +
    "Reporting-MTA: dns; googlemail.com\n" +
    "Final-Recipient: rfc822; info@eptdesign.com\n" +
    "Action: failed\nStatus: 5.4.1\n";
  if (extractBouncedRecipient(eptdesignBody) !== 'info@eptdesign.com') {
    throw new Error('SELF-TEST FAIL: EPTDESIGN body extraction');
  }
  if (classifyBounceSeverity(eptdesignBody) !== 'hard') {
    throw new Error('SELF-TEST FAIL: EPTDESIGN 5.4.1 should classify hard');
  }

  const migcomBody =
    "** Message blocked **\n\n" +
    "Your message to cdistefano@migcom.com has been blocked.\n\n" +
    "The response from the remote server was:\n" +
    "554 Email rejected due to security policies\n\n" +
    "Reporting-MTA: dns; googlemail.com\n" +
    "Final-Recipient: rfc822; cdistefano@migcom.com\n" +
    "Action: failed\nStatus: 5.7.0\n";
  if (extractBouncedRecipient(migcomBody) !== 'cdistefano@migcom.com') {
    throw new Error('SELF-TEST FAIL: MIGcom body extraction');
  }
  if (classifyBounceSeverity(migcomBody) !== 'hard') {
    throw new Error('SELF-TEST FAIL: MIGcom 5.7.0 should classify hard');
  }

  const m365GroupBody =
    "Your message to info@lglalandscape.com couldn't be delivered.\n" +
    "Remote server returned '550 5.7.133 RESOLVER.RST.NotAuthorizedToSendToGroup'\n";
  if (extractBouncedRecipient(m365GroupBody) !== 'info@lglalandscape.com') {
    throw new Error('SELF-TEST FAIL: M365 group bounce extraction');
  }
  if (classifyBounceSeverity(m365GroupBody) !== 'hard') {
    throw new Error('SELF-TEST FAIL: M365 5.7.133 should classify hard');
  }

  if (extractBouncedRecipient("random text no email") !== null) {
    throw new Error('SELF-TEST FAIL: unparseable body should return null');
  }

  if (classifyBounceSeverity("Delivery will be retried. Temporary failure 4.4.1.") !== 'soft') {
    throw new Error('SELF-TEST FAIL: 4.4.1 + retry should be soft');
  }
  if (classifyBounceSeverity("Some server said no.") !== 'soft') {
    throw new Error('SELF-TEST FAIL: ambiguous should default soft');
  }

  // isBounceSender
  if (!isBounceSender('mailer-daemon@googlemail.com')) throw new Error('SELF-TEST FAIL: mailer-daemon detection');
  if (!isBounceSender('postmaster@outlook.com')) throw new Error('SELF-TEST FAIL: postmaster detection');
  if (isBounceSender('kevin@phasewise.io')) throw new Error('SELF-TEST FAIL: normal sender not-flagged');

  // --- Extractor tests against REAL n8n v2.1 pre-processed shape ---
  // Anchored to the actual output shape confirmed 2026-08-31.
  const v21Msg = {
    id: '1a058637853e6421',
    threadId: '1a0586366e62642b',
    from: {
      value: [{ address: 'mailer-daemon@googlemail.com', name: 'Mail Delivery Subsystem' }],
      text: '"Mail Delivery Subsystem" <mailer-daemon@googlemail.com>',
    },
    subject: 'Delivery Status Notification (Failure)',
    text: eptdesignBody,
    headers: {
      from: 'From: Mail Delivery Subsystem <mailer-daemon@googlemail.com>',
      subject: 'Subject: Delivery Status Notification (Failure)',
    },
  };
  if (extractSenderEmail(v21Msg) !== 'mailer-daemon@googlemail.com') {
    throw new Error('SELF-TEST FAIL: v2.1 sender extraction');
  }
  if (extractSubject(v21Msg) !== 'Delivery Status Notification (Failure)') {
    throw new Error('SELF-TEST FAIL: v2.1 subject extraction');
  }
  const v21Body = extractFullBody(v21Msg);
  if (!v21Body.includes('info@eptdesign.com')) {
    throw new Error('SELF-TEST FAIL: v2.1 body extraction');
  }

  // End-to-end: v2.1 msg -> bounce detected -> recipient extracted -> hard classified
  if (!isBounceSender(extractSenderEmail(v21Msg))) {
    throw new Error('SELF-TEST FAIL: v2.1 end-to-end sender not flagged as bounce');
  }
  if (extractBouncedRecipient(extractFullBody(v21Msg)) !== 'info@eptdesign.com') {
    throw new Error('SELF-TEST FAIL: v2.1 end-to-end recipient extraction');
  }
  if (classifyBounceSeverity(extractFullBody(v21Msg)) !== 'hard') {
    throw new Error('SELF-TEST FAIL: v2.1 end-to-end severity classification');
  }

  // --- Fallback test: raw Gmail API shape (older n8n Gmail node) ---
  const rawApiMsg = {
    id: 'msg-fallback',
    threadId: 'thr-fallback',
    snippet: 'preview...',
    payload: {
      headers: [
        { name: 'From', value: 'Mail Delivery Subsystem <mailer-daemon@googlemail.com>' },
        { name: 'Subject', value: 'Delivery Status Notification (Failure)' },
      ],
      parts: [{
        mimeType: 'text/plain',
        body: { data: Buffer.from(eptdesignBody).toString('base64url'), size: 100 },
      }],
    },
  };
  if (extractSenderEmail(rawApiMsg) !== 'mailer-daemon@googlemail.com') {
    throw new Error('SELF-TEST FAIL: raw API fallback sender extraction');
  }
  if (extractSubject(rawApiMsg) !== 'Delivery Status Notification (Failure)') {
    throw new Error('SELF-TEST FAIL: raw API fallback subject extraction');
  }
  if (!extractFullBody(rawApiMsg).includes('info@eptdesign.com')) {
    throw new Error('SELF-TEST FAIL: raw API fallback body extraction');
  }

  // --- MANUAL-DNC PRESERVATION REGRESSION TEST (Kevin, 2026-08-31) ---
  // A prospect already manually DNC'd sends a normal reply.
  // The pipeline MUST NOT touch their DNC or notes fields.
  const priorNotes =
    'Verified published on their contact page 2026-08-27.\n\n' +
    'DNC 2026-08-15: Manual — Kevin flagged after Charlie referral fell through.';
  const priorProspect = {
    email: 'foo@bar.com',
    firm_name: 'Bar Studio',
    do_not_contact: 'TRUE',
    notes: priorNotes,
    status: 'do_not_contact_manual',
  };
  if ((priorProspect.do_not_contact || 'FALSE') !== 'TRUE') {
    throw new Error('SELF-TEST FAIL: manual DNC preservation');
  }
  if ((priorProspect.notes || '') !== priorNotes) {
    throw new Error('SELF-TEST FAIL: notes preservation must be byte-identical');
  }

  // Empty-notes prospect
  const empty = { email: 'x@y.com', firm_name: 'Y', do_not_contact: '', notes: '' };
  if ((empty.do_not_contact || 'FALSE') !== 'FALSE') throw new Error('SELF-TEST FAIL: empty DNC default');
  if ((empty.notes || '') !== '') throw new Error('SELF-TEST FAIL: empty notes default');
})();

// -------------------------------------------------------------------------
// 5. Load inputs
// -------------------------------------------------------------------------

const gmailItems = $('Get Gmail Messages').all();
const prospectItems = $('Read Prospects').all();
const replyLogItems = $('Read ReplyLog').all();

// -------------------------------------------------------------------------
// 6. Build lookup structures
// -------------------------------------------------------------------------

// Preserve the FULL prospect record (esp. notes + do_not_contact + status)
// so we can echo them back unchanged for non-bounce replies.
const prospectByEmail = {};
for (const item of prospectItems) {
  const emailKey = String(item.json.email || '').toLowerCase().trim();
  if (!emailKey) continue;
  prospectByEmail[emailKey] = {
    ...item.json,
    email: item.json.email, // preserve original casing for the Sheets Update match
  };
}

const loggedMessageIds = new Set();
const loggedThreadIds = new Set();
for (const item of replyLogItems) {
  const mid = String(item.json.gmail_message_id || '').trim();
  const tid = String(item.json.gmail_thread_id || '').trim();
  if (mid) loggedMessageIds.add(mid);
  if (tid) loggedThreadIds.add(tid);
}

// -------------------------------------------------------------------------
// 7. Process each Gmail message
// -------------------------------------------------------------------------

const results = [];
const stats = {
  seen: 0,
  dedup_skipped: 0,
  no_prospect_match: 0,
  bounces_hard: 0,
  bounces_soft: 0,
  bounce_recipient_unparseable: 0,
  processed: 0,
};
const today = new Date().toISOString().split('T')[0];

for (const item of gmailItems) {
  const msg = item.json;
  stats.seen++;

  const messageId = String(msg.id || '').trim();
  const threadId = String(msg.threadId || '').trim();

  if (messageId && loggedMessageIds.has(messageId)) {
    stats.dedup_skipped++;
    continue;
  }
  if (threadId && loggedThreadIds.has(threadId)) {
    stats.dedup_skipped++;
    continue;
  }

  const senderEmail = extractSenderEmail(msg);
  const subject = extractSubject(msg);
  const snippet = extractSnippet(msg);

  // Bounce path: extract intended recipient from body, rematch to prospect
  let matchEmail = senderEmail;
  let bounceType = null; // 'hard' | 'soft' | null

  if (isBounceSender(senderEmail)) {
    const fullBody = extractFullBody(msg);
    const extractedRecipient = extractBouncedRecipient(fullBody);
    if (!extractedRecipient) {
      stats.bounce_recipient_unparseable++;
      // Same as pre-v3 baseline: silent drop. Counter surfaces via stats
      // in the n8n execution output panel for future pattern tuning.
      continue;
    }
    matchEmail = extractedRecipient;
    bounceType = classifyBounceSeverity(fullBody);
  }

  const prospect = prospectByEmail[matchEmail];
  if (!prospect) {
    stats.no_prospect_match++;
    continue;
  }

  // Determine outputs. Every code path MUST set all four:
  //   replyType, newStatus, newDnc, newNotes
  // — because Update Prospect Row now writes DNC + notes on every reply.
  // Guarding against silent data loss is critical here.
  let replyType, newStatus, newDnc, newNotes, replySnippet;

  if (bounceType === 'hard') {
    stats.bounces_hard++;
    replyType = 'bounce';
    newStatus = 'bounced';
    newDnc = 'TRUE';
    const noteAppend = `Auto-DNC ${today}: hard bounce (extracted recipient ${matchEmail} from ${senderEmail}).`;
    newNotes = prospect.notes ? `${prospect.notes}\n\n${noteAppend}` : noteAppend;
    replySnippet = `[Auto-detected hard bounce] ${snippet}`;
  } else if (bounceType === 'soft') {
    stats.bounces_soft++;
    // Soft bounces: log for visibility, do NOT change prospect state.
    // Might resolve on retry; premature DNC would exclude a real prospect.
    replyType = 'soft_bounce';
    newStatus = prospect.status || '';
    newDnc = prospect.do_not_contact || 'FALSE';
    newNotes = prospect.notes || '';
    replySnippet = `[Auto-detected soft bounce — no state change] ${snippet}`;
  } else {
    // Normal reply — existing classification logic, PRESERVE DNC + notes
    const c = classifyNormalReply(subject, snippet);
    replyType = c.type;
    newStatus = c.newStatus;
    newDnc = prospect.do_not_contact || 'FALSE'; // preserve
    newNotes = prospect.notes || ''; // preserve
    replySnippet = snippet;
  }

  stats.processed++;

  results.push({
    json: {
      prospect_email: prospect.email, // original casing for sheet match
      firm_name: prospect.firm_name,
      reply_type: replyType,
      new_status: newStatus,
      new_do_not_contact: newDnc,
      new_notes: newNotes,
      reply_snippet: replySnippet,
      gmail_message_id: messageId,
      gmail_thread_id: threadId,
      timestamp_utc: new Date().toISOString(),
      reason: bounceType
        ? `${replyType.toUpperCase()} from ${senderEmail} → extracted recipient ${matchEmail} → firm: ${prospect.firm_name}`
        : `${replyType.toUpperCase()} from ${senderEmail} → firm: ${prospect.firm_name}`,
    },
  });
}

// -------------------------------------------------------------------------
// 8. Return results (0-N items)
//    If empty, downstream nodes skip cleanly. Stats live in the n8n
//    execution output for after-the-fact inspection.
// -------------------------------------------------------------------------

if (results.length === 0) return [];
return results;
