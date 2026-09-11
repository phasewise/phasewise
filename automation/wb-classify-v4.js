// Workflow B v4 classifier — pure function, importable locally + pastable into n8n.
//
// Contract: classify(message, { prospects, sendlog }) → result
//
// Result:
//   {
//     type: 'bounce_hard' | 'bounce_soft' | 'ooo' | 'negative' | 'positive'
//         | 'unclassified_prospect_reply' | 'noise_skipped',
//     prospect_email: string | null,   // matched Prospects row email; null for noise/no-match
//     link_method?: 'sender_match' | 'sendlog_subject_match' | 'no_match',
//     reason?: string,                 // noise_skipped only
//     dnc_flip: boolean,
//     status_change: boolean,
//     confidence?: 'high' | 'medium' | 'low',
//   }
//
// Dispatcher order (each branch short-circuits):
//   1. from_self               → noise_skipped   (belt+suspenders vs Gmail -from:me)
//   2. bounce sender           → handleBounce    (v3 logic preserved)
//   3. noise sender            → noise_skipped   (service tooling / directories / DMARC)
//   4. OOO signals             → handleOoo       (sender OR sendlog-subject fallback)
//   5. prospect sender         → negative / positive / unclassified_prospect_reply
//   6. everything else         → noise_skipped   (non-prospect, no pattern)

'use strict';

// -----------------------------------------------------------------------------
// Sender categorization
// -----------------------------------------------------------------------------

const OWN_ADDRESSES = new Set([
  'hello@phasewise.io',
  'kevin@phasewise.io',
  'kgallo22@gmail.com',
]);

const NOISE_EXACT = new Set([
  'no-reply@capterra.com',
  'noreply@capterra.com',
  'noreply-dmarc-support@google.com',
  'workspace-noreply@google.com',
]);

// Local-part prefixes (before @) indicating automated senders.
const NOISE_LOCAL_PREFIXES = [
  'noreply', 'no-reply', 'donotreply', 'do-not-reply',
  'notifications', 'notification',
];

// Domains that never send prospect replies — service tooling, directories, reports.
const NOISE_DOMAINS = new Set([
  'capterra.com',
  'gartner.com',
  'getapp.com',
  'softwareadvice.com',
  'loops.so',
  'md.getsentry.com',
  'getsentry.com',
  'github.com',
  'dmarcian.com',
  'postmaster.google.com',
  'hunter.io',
  'n8n.io',
  'sendgrid.net',
  'amazonses.com',
  'atlassian.com',
  'vercel.com',
  'supabase.io',
]);

const BOUNCE_LOCAL_PREFIXES = ['mailer-daemon', 'mail-daemon', 'postmaster'];

function normalize(addr) {
  return (addr || '').toString().trim().toLowerCase();
}

function localPart(addr) {
  const a = normalize(addr);
  const at = a.indexOf('@');
  return at > 0 ? a.slice(0, at) : a;
}

function domainPart(addr) {
  const a = normalize(addr);
  const at = a.indexOf('@');
  return at > 0 ? a.slice(at + 1) : '';
}

function isFromSelf(msg) {
  return OWN_ADDRESSES.has(normalize(msg.from_address));
}

function isNoiseSender(msg) {
  const addr = normalize(msg.from_address);
  if (NOISE_EXACT.has(addr)) return true;
  const local = localPart(addr);
  const domain = domainPart(addr);
  for (const p of NOISE_LOCAL_PREFIXES) {
    if (local === p) return true;
    if (local.startsWith(p + '-')) return true;
    if (local.startsWith(p + '_')) return true;
    if (local.startsWith(p + '.')) return true;
  }
  if (NOISE_DOMAINS.has(domain)) return true;
  // Subdomain match: `e.capterra.com` also skips.
  for (const d of NOISE_DOMAINS) {
    if (domain.endsWith('.' + d)) return true;
  }
  // Google Workspace admin notifications — workspace-noreply@google.com etc.
  if (domain === 'google.com' && (local.includes('noreply') || local.includes('no-reply'))) return true;
  return false;
}

function isBounceSender(msg) {
  const local = localPart(msg.from_address);
  return BOUNCE_LOCAL_PREFIXES.includes(local);
}

// -----------------------------------------------------------------------------
// Bounce extraction (kept simple; production wraps existing v3 body-parser here)
// -----------------------------------------------------------------------------

const BOUNCE_RECIPIENT_PATTERNS = [
  /Your message wasn't delivered to\s+([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/i,
  /Your message to\s+([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/i,
  /message wasn't delivered to\s+([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/i,
  /Original-Recipient:.*?<?([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>?/i,
  /Final-Recipient:.*?<?([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})>?/i,
];

function extractBounceRecipient(body) {
  if (!body) return null;
  for (const re of BOUNCE_RECIPIENT_PATTERNS) {
    const m = body.match(re);
    if (m) return normalize(m[1]);
  }
  return null;
}

function classifyBounceSeverity(body) {
  if (!body) return 'unknown';
  // SMTP codes are the strongest signal: 5xx = permanent, 4xx = transient.
  if (/\b5\d{2}[- ]/.test(body) || /\b5\.\d\.\d+\b/.test(body)) return 'hard';
  if (/\b4\d{2}[- ]/.test(body) || /\b4\.\d\.\d+\b/.test(body)) return 'soft';
  // Language cues as a fallback.
  if (/address\s+not\s+found|does\s+not\s+exist|user\s+unknown|recipient\s+rejected|mailbox\s+unavailable/i.test(body)) return 'hard';
  if (/delayed|try\s+again|temporarily\s+unavailable|greylist|mailbox\s+full/i.test(body)) return 'soft';
  return 'unknown';
}

// -----------------------------------------------------------------------------
// OOO detection — headers → subject → body, most-reliable first
// -----------------------------------------------------------------------------

const OOO_SUBJECT_REGEX = /\b(out\s+of\s+office|auto[-\s]?reply|automatic\s+reply|automatic\s+response|on\s+vacation|on\s+holiday|OOO)\b/i;
const OOO_BODY_REGEX = /\b(out\s+of\s+(the\s+)?office|will\s+be\s+back|on\s+vacation\s+until|holiday\s+weekend|long\s+weekend|extended\s+weekend|limited\s+access\s+to\s+email|in\s+my\s+absence|please\s+contact\s+.{0,40}?\s+instead|automatic\s+message|autoresponder)\b/i;

function headerVal(headers, name) {
  if (!headers) return null;
  const direct = headers[name];
  if (direct) return direct;
  // Case-insensitive fallback
  const lower = name.toLowerCase();
  for (const k of Object.keys(headers)) {
    if (k.toLowerCase() === lower) return headers[k];
  }
  return null;
}

// Strip a leading "Header-Name: " prefix from a header value if present.
// n8n's Gmail node sometimes stores the raw "Name: value" line as the value.
function stripHeaderPrefix(val) {
  if (typeof val !== 'string') return val;
  const trimmed = val.trim();
  const colonIdx = trimmed.indexOf(':');
  // Only strip if the "prefix" looks like a valid header name (short, alphanumeric+dash)
  if (colonIdx > 0 && colonIdx < 40 && /^[A-Za-z0-9-]+$/.test(trimmed.slice(0, colonIdx))) {
    return trimmed.slice(colonIdx + 1).trim();
  }
  return trimmed;
}

function hasOooHeader(headers) {
  if (!headers) return false;
  // RFC 3834 §5: Auto-Submitted with any value other than "no" indicates an auto-response.
  const auto = headerVal(headers, 'Auto-Submitted');
  if (auto) {
    const val = stripHeaderPrefix(auto).toLowerCase();
    if (val && val !== 'no') return true;
  }
  if (headerVal(headers, 'X-Autoreply')) return true;
  if (headerVal(headers, 'X-Autorespond')) return true;
  const prec = headerVal(headers, 'Precedence');
  if (prec) {
    const val = stripHeaderPrefix(prec).toLowerCase();
    if (/auto[_-]?reply|junk|bulk/.test(val)) return true;
  }
  if (headerVal(headers, 'X-Auto-Response-Suppress')) return true;
  return false;
}

// Strip quoted-reply text so classification only reads the actual reply.
// Cuts at the first "On [date] X wrote:" marker; drops lines starting with '>'.
function stripQuotedText(body) {
  if (!body) return '';
  let out = body;
  const onWrote = out.match(/\n\s*On\s+\w{3,10}\s+\d{1,2},?\s+\d{4}[^:]{0,80}wrote:/i);
  if (onWrote) out = out.slice(0, onWrote.index);
  out = out.split('\n').filter(line => !line.trim().startsWith('>')).join('\n');
  return out.trim();
}

function isOoo(msg) {
  if (hasOooHeader(msg.headers)) return true;
  if (msg.subject && OOO_SUBJECT_REGEX.test(msg.subject)) return true;
  const stripped = stripQuotedText(msg.body || '');
  if (stripped && OOO_BODY_REGEX.test(stripped)) return true;
  return false;
}

// Strip common auto-reply / thread prefixes so the residual subject can match SendLog.
const AUTOREPLY_PREFIXES = [
  /^automatic\s+reply:\s*/i,
  /^automatic\s+response:\s*/i,
  /^out\s+of\s+office:\s*/i,
  /^auto(?:matic)?[- :]\s*/i,
  /^re:\s*/i,
  /^fwd?:\s*/i,
];

function stripAutoReplyPrefix(subject) {
  if (!subject) return '';
  let s = subject.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const re of AUTOREPLY_PREFIXES) {
      const next = s.replace(re, '');
      if (next !== s) { s = next; changed = true; break; }
    }
  }
  return s.trim();
}

function matchProspectViaSendlogSubject(subject, sendlog) {
  const stripped = stripAutoReplyPrefix(subject).toLowerCase();
  if (!stripped) return null;
  for (const row of sendlog) {
    const sent = stripAutoReplyPrefix(row.subject || '').toLowerCase();
    if (sent && stripped === sent) return row;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Negative / positive detection
// -----------------------------------------------------------------------------

const NEGATIVE_REGEX = /\b(no\s+thank\s?you|no\s+thanks|not\s+interested|please\s+remove\s+me|remove\s+me\s+from|take\s+me\s+off|unsubscribe|stop\s+emailing|do\s+not\s+email|do\s+not\s+contact|don'?t\s+email\s+me|not\s+the\s+right\s+fit|pass\s+on\s+this|we'?ll\s+pass|not\s+for\s+us)\b/i;

const POSITIVE_REGEX = /\b(tell\s+me\s+more|would\s+love\s+to\s+(hear|learn)|can\s+we\s+(chat|talk|schedule)|schedule\s+a\s+call|book\s+a\s+call|sounds?\s+interesting|send\s+more\s+info|when\s+can\s+we|let'?s\s+(chat|talk|discuss)|worth\s+a\s+conversation|happy\s+to\s+(chat|talk|discuss)|learn\s+more)\b/i;

function isNegative(msg) {
  const stripped = stripQuotedText(msg.body || '');
  return !!(stripped && NEGATIVE_REGEX.test(stripped));
}

function isPositive(msg) {
  const stripped = stripQuotedText(msg.body || '');
  return !!(stripped && POSITIVE_REGEX.test(stripped));
}

// -----------------------------------------------------------------------------
// Prospect lookup
// -----------------------------------------------------------------------------

function matchProspectByEmail(email, prospects) {
  if (!email) return null;
  const norm = normalize(email);
  for (const p of prospects) {
    if (normalize(p.email) === norm) return p;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Dispatcher
// -----------------------------------------------------------------------------

function classify(message, context) {
  const prospects = (context && context.prospects) || [];
  const sendlog = (context && context.sendlog) || [];

  // 1. Own outbound
  if (isFromSelf(message)) {
    return {
      type: 'noise_skipped',
      reason: 'from_self',
      prospect_email: null,
      dnc_flip: false,
      status_change: false,
    };
  }

  // 2. Bounce path — highest priority, preserves v3 behavior
  if (isBounceSender(message)) {
    const recipient = extractBounceRecipient(message.body);
    const severity = classifyBounceSeverity(message.body);
    const matched = matchProspectByEmail(recipient, prospects);
    const prospect_email = matched ? matched.email : recipient;

    if (severity === 'hard') {
      return {
        type: 'bounce_hard',
        prospect_email,
        link_method: 'sender_match',
        dnc_flip: true,
        status_change: true,
        confidence: 'high',
      };
    }
    // soft or unknown → log-only
    return {
      type: 'bounce_soft',
      prospect_email,
      link_method: 'sender_match',
      dnc_flip: false,
      status_change: false,
      confidence: severity === 'soft' ? 'high' : 'low',
    };
  }

  // 3. Noise senders — service tooling, directories, DMARC, workspace admin, etc.
  if (isNoiseSender(message)) {
    return {
      type: 'noise_skipped',
      reason: 'noise_sender',
      prospect_email: null,
      dnc_flip: false,
      status_change: false,
    };
  }

  // 4. OOO — check headers/subject/body regardless of sender-vs-Prospects match
  //    because M365 relays route through opaque *.onmicrosoft.com addresses.
  if (isOoo(message)) {
    let matched = matchProspectByEmail(message.from_address, prospects);
    let link_method = matched ? 'sender_match' : null;
    if (!matched) {
      const sendRow = matchProspectViaSendlogSubject(message.subject, sendlog);
      if (sendRow) {
        matched = matchProspectByEmail(sendRow.prospect_email, prospects);
        link_method = 'sendlog_subject_match';
      } else {
        link_method = 'no_match';
      }
    }
    const confidence = hasOooHeader(message.headers)
      ? 'high'
      : (OOO_SUBJECT_REGEX.test(message.subject || '') ? 'high' : 'medium');
    return {
      type: 'ooo',
      prospect_email: matched ? matched.email : null,
      link_method,
      dnc_flip: false,
      status_change: false,
      confidence,
    };
  }

  // 5. Sender matches Prospects — classify prospect reply
  const prospect = matchProspectByEmail(message.from_address, prospects);
  if (prospect) {
    if (isNegative(message)) {
      const shortBody = (message.body || '').length < 100;
      return {
        type: 'negative',
        prospect_email: prospect.email,
        link_method: 'sender_match',
        dnc_flip: true,
        status_change: true,
        confidence: shortBody ? 'high' : 'medium',
      };
    }
    if (isPositive(message)) {
      return {
        type: 'positive',
        prospect_email: prospect.email,
        link_method: 'sender_match',
        dnc_flip: false,           // Kevin engages personally
        status_change: true,
        confidence: 'medium',
      };
    }
    // Safety net — prospect replied but no pattern hit
    return {
      type: 'unclassified_prospect_reply',
      prospect_email: prospect.email,
      link_method: 'sender_match',
      dnc_flip: false,
      status_change: true,
      confidence: 'low',
    };
  }

  // 6. Non-prospect, non-noise, non-bounce, non-OOO → skip
  return {
    type: 'noise_skipped',
    reason: 'non_prospect_no_pattern',
    prospect_email: null,
    dnc_flip: false,
    status_change: false,
  };
}

module.exports = { classify };
