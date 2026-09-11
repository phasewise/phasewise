// Workflow B v4 — test harness.
//
// Runs 11 fixtures against classify() with mocked Prospects + SendLog context.
// Exit non-zero on any failure.
//
// STAGE B: stub classify() returns null → EVERY fixture must FAIL. That
// negative result proves the harness itself is wired correctly.
// STAGE C: build real dispatcher/handlers until all 11 pass.
//
// Fixture set (per approved spec):
//   Known-good (7):
//     01  Wilson Design Studio "No thank you"            → negative
//     02  City Fabrick M365 OOO auto-reply              → ooo (SendLog-subj match)
//     03  EPTDESIGN mailer-daemon (9/1)                  → bounce_hard
//     04  Primaterra mailer-daemon (9/2)                 → bounce_hard
//     05  ECHO LA mailer-daemon (9/3 soft)               → bounce_soft
//     06  Synthetic prospect "let's schedule a call"     → positive
//     07  Synthetic prospect "let me think about it"     → unclassified_prospect_reply
//   Known-bad (4):
//     08  Capterra promo                                 → noise_skipped
//     09  Kevin's own outbound (belt+suspenders vs -from:me) → noise_skipped
//     10  DMARC aggregate report                         → noise_skipped
//     11  Google Workspace admin notification            → noise_skipped

'use strict';

const { classify } = require('./wb-classify-v4');

// -----------------------------------------------------------------------------
// Mock context: Prospects rows referenced by fixtures + SendLog for OOO fallback.
// -----------------------------------------------------------------------------

const PROSPECTS = [
  { row: 76, firm_name: 'Wilson Design Studio',          email: 'info@wdsla.com',                status: 'sent_fu1', dnc: 'FALSE' },
  { row: 39, firm_name: 'City Fabrick',                  email: 'info@cityfabrick.org',          status: 'sent_fu1', dnc: 'FALSE' },
  { row: 11, firm_name: 'ECHO LA',                       email: 'maggie@echolastudio.com',       status: 'sent_fu1', dnc: 'FALSE' },
  { row:  3, firm_name: 'EPTDESIGN',                     email: 'info@eptdesign.com',            status: 'sent_1',   dnc: 'FALSE' },
  { row:  5, firm_name: 'Primaterra Studio',             email: 'info@primaterrastudio.com',     status: 'sent_1',   dnc: 'FALSE' },
  { row:999, firm_name: '[Synthetic] Test Positive',     email: 'test-positive@synthetic.com',   status: 'sent_fu1', dnc: 'FALSE' },
  { row:998, firm_name: '[Synthetic] Test Ambiguous',    email: 'test-ambiguous@synthetic.com',  status: 'sent_fu1', dnc: 'FALSE' },
];

// SendLog rows Workflow A would have written when the outbound was sent.
// Used by the OOO branch when the sender is a relay (e.g. M365 onmicrosoft.com)
// and the direct sender→Prospects lookup fails.
const SENDLOG = [
  { firm_name: 'City Fabrick',          prospect_email: 'info@cityfabrick.org', subject: 'For City Fabrick — a quick MWELO tool demo',      sent_at: '2026-09-10T15:00:00Z' },
  { firm_name: 'Wilson Design Studio',  prospect_email: 'info@wdsla.com',       subject: 'For Wilson — a quick MWELO tool demo',            sent_at: '2026-09-10T15:30:00Z' },
  { firm_name: 'EPTDESIGN',             prospect_email: 'info@eptdesign.com',   subject: 'For EPTDESIGN — a quick MWELO tool demo',         sent_at: '2026-09-01T14:00:00Z' },
];

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

const FIXTURES = [
  // -------------------- Known-good (must classify correctly) --------------------

  {
    id: '01-wilson-negative',
    message: {
      from: 'Admin Admin <info@wdsla.com>',
      from_address: 'info@wdsla.com',
      subject: 'Re: For Wilson — a quick MWELO tool demo',
      body: 'No thank you',
      headers: {},
      thread_id: 'thread-wilson-1',
      message_id: 'msg-wilson-1',
    },
    expected: {
      type: 'negative',
      prospect_email: 'info@wdsla.com',
      link_method: 'sender_match',
      dnc_flip: true,
      status_change: true,
    },
  },

  {
    id: '02-cityfabrick-ooo',
    message: {
      // The critical detail: M365 tenant relay sender, NOT the prospect's info@ address.
      // This forces the OOO branch to fall back to SendLog subject match.
      from: 'City Fabrick Information <cityfabrickinformation@netorg639447.onmicrosoft.com>',
      from_address: 'cityfabrickinformation@netorg639447.onmicrosoft.com',
      subject: 'Automatic reply: For City Fabrick — a quick MWELO tool demo',
      body: "I am out of office with limited access to email. I'll return after the holiday weekend.  Thanks!",
      headers: {
        'Auto-Submitted': 'auto-replied',
        'X-Auto-Response-Suppress': 'All',
      },
      thread_id: 'thread-cityfab-1',
      message_id: 'msg-cityfab-1',
    },
    expected: {
      type: 'ooo',
      prospect_email: 'info@cityfabrick.org',
      link_method: 'sendlog_subject_match',
      dnc_flip: false,
      status_change: false,
    },
  },

  {
    id: '03-eptdesign-bounce-hard',
    message: {
      from: 'Mail Delivery Subsystem <mailer-daemon@googlemail.com>',
      from_address: 'mailer-daemon@googlemail.com',
      subject: 'Delivery Status Notification (Failure)',
      body:
        "Address not found\n\n" +
        "Your message wasn't delivered to info@eptdesign.com because the address couldn't be " +
        "found, or is unable to receive mail.\n\n" +
        "The response was:\n" +
        "550 5.1.1 The email account that you tried to reach does not exist. Please try " +
        "double-checking the recipient's email address for typos or unnecessary spaces.",
      headers: {},
      thread_id: 'thread-ept-1',
      message_id: 'msg-ept-1',
    },
    expected: {
      type: 'bounce_hard',
      prospect_email: 'info@eptdesign.com',
      link_method: 'sender_match',   // extractor pulls prospect from body, treated as authoritative
      dnc_flip: true,
      status_change: true,
    },
  },

  {
    id: '04-primaterra-bounce-hard',
    message: {
      from: 'Mail Delivery Subsystem <mailer-daemon@googlemail.com>',
      from_address: 'mailer-daemon@googlemail.com',
      subject: 'Delivery Status Notification (Failure)',
      body:
        "Address not found\n\n" +
        "Your message wasn't delivered to info@primaterrastudio.com because the address " +
        "couldn't be found, or is unable to receive mail.\n\n" +
        "The response was:\n" +
        "550 5.1.1 recipient rejected",
      headers: {},
      thread_id: 'thread-pri-1',
      message_id: 'msg-pri-1',
    },
    expected: {
      type: 'bounce_hard',
      prospect_email: 'info@primaterrastudio.com',
      link_method: 'sender_match',
      dnc_flip: true,
      status_change: true,
    },
  },

  {
    id: '05-echola-bounce-soft',
    message: {
      from: 'Mail Delivery Subsystem <mailer-daemon@googlemail.com>',
      from_address: 'mailer-daemon@googlemail.com',
      subject: 'Delivery Status Notification (Delay)',
      body:
        "Delayed delivery\n\n" +
        "Your message to maggie@echolastudio.com is being delayed.\n\n" +
        "The response was:\n" +
        "421 4.7.0 Try again later. Server temporarily unavailable.",
      headers: {},
      thread_id: 'thread-echo-1',
      message_id: 'msg-echo-1',
    },
    expected: {
      type: 'bounce_soft',
      prospect_email: 'maggie@echolastudio.com',
      link_method: 'sender_match',
      dnc_flip: false,           // soft bounce = log-only, no state change
      status_change: false,
    },
  },

  {
    id: '06-synthetic-positive',
    message: {
      from: 'Jane Doe <test-positive@synthetic.com>',
      from_address: 'test-positive@synthetic.com',
      subject: 'Re: For [Synthetic] Test Positive — a quick MWELO tool demo',
      body: "Hi — this looks interesting. Can we schedule a call this week to learn more?",
      headers: {},
      thread_id: 'thread-pos-1',
      message_id: 'msg-pos-1',
    },
    expected: {
      type: 'positive',
      prospect_email: 'test-positive@synthetic.com',
      link_method: 'sender_match',
      dnc_flip: false,           // Kevin engages personally
      status_change: true,       // status → positive_reply
    },
  },

  {
    id: '07-synthetic-unclassified-prospect',
    message: {
      from: 'Ambiguous Reply <test-ambiguous@synthetic.com>',
      from_address: 'test-ambiguous@synthetic.com',
      subject: 'Re: For [Synthetic] Test Ambiguous — a quick MWELO tool demo',
      body: "Got your note. Let me think about this and get back to you next week.",
      headers: {},
      thread_id: 'thread-amb-1',
      message_id: 'msg-amb-1',
    },
    expected: {
      type: 'unclassified_prospect_reply',   // safety net — prospect replied but no pattern hit
      prospect_email: 'test-ambiguous@synthetic.com',
      link_method: 'sender_match',
      dnc_flip: false,
      status_change: true,       // status → replied (halts sequence pending manual review)
    },
  },

  // -------------------- Known-bad (must skip / not misclassify) --------------------

  {
    id: '08-capterra-promo-noise',
    message: {
      from: 'Team Capterra <no-reply@capterra.com>',
      from_address: 'no-reply@capterra.com',
      subject: 'Stop searching—read top reviews now',
      body: 'Get the inside scoop on top software recommendations...',
      headers: {},
      thread_id: 'thread-cap-1',
      message_id: 'msg-cap-1',
    },
    expected: {
      type: 'noise_skipped',
      reason: 'noise_sender',
    },
  },

  {
    id: '09-own-outbound-noise',
    // Gmail query catches this via -from:me, but the classifier must also refuse.
    // If somehow (bugged query, misconfigured filter) an outbound reaches the
    // dispatcher, we cannot misclassify it as a prospect reply.
    message: {
      from: 'Phasewise Team <hello@phasewise.io>',
      from_address: 'hello@phasewise.io',
      subject: 'For Test Firm — a quick MWELO tool demo',
      body: 'Hi — Phasewise is a purpose-built PM tool for landscape architecture firms...',
      headers: {},
      thread_id: 'thread-own-1',
      message_id: 'msg-own-1',
    },
    expected: {
      type: 'noise_skipped',
      reason: 'from_self',
    },
  },

  {
    id: '10-dmarc-report-noise',
    message: {
      from: 'noreply-dmarc-support@google.com',
      from_address: 'noreply-dmarc-support@google.com',
      subject: 'Report domain: phasewise.io Submitter: google.com',
      body: '<xml aggregate report body...>',
      headers: {},
      thread_id: 'thread-dmarc-1',
      message_id: 'msg-dmarc-1',
    },
    expected: {
      type: 'noise_skipped',
      reason: 'noise_sender',
    },
  },

  {
    id: '11-workspace-admin-noise',
    message: {
      from: 'The Google Workspace Team <workspace-noreply@google.com>',
      from_address: 'workspace-noreply@google.com',
      subject: 'Regarding your account: Upgrade for more features',
      body: 'Learn more about Google Workspace features...',
      headers: {},
      thread_id: 'thread-workspace-1',
      message_id: 'msg-workspace-1',
    },
    expected: {
      type: 'noise_skipped',
      reason: 'noise_sender',
    },
  },

  // -------------------- Real-inbox regression cases (from 2026-09-10 tick 3193) --------------------
  // Fixtures locked from observed n8n Gmail node v2.1 message shapes to prevent
  // future regressions in the classifier for real-world reply patterns.

  {
    id: '12-wilson-negative-with-quoted-reply',
    // Real Wilson message body includes quoted-reply "> On Sep 10, 2026, ... wrote:"
    // Verifies stripQuotedText strips the quoted block so only the reply body classifies.
    message: {
      from: '"Admin Admin" <info@wdsla.com>',
      from_address: 'info@wdsla.com',
      subject: 'Re: For Wilson — a quick MWELO tool demo',
      body: "No thank you\n\n> On Sep 10, 2026, at 8:30 AM, Phasewise Team <hello@phasewise.io> wrote:\n> \n> Hi Keith,\n> \n> Circling back on the MWELO calculator note from last week. If your\n> team is still running MWELO calculations by hand, the walkthrough is\n> at phasewise.io/demo/mwelo.",
      headers: {},
      thread_id: 'thread-wilson-real-1',
      message_id: 'msg-wilson-real-1',
    },
    expected: {
      type: 'negative',
      prospect_email: 'info@wdsla.com',
      link_method: 'sender_match',
      dnc_flip: true,
      status_change: true,
    },
  },

  {
    id: '13-cityfabrick-ooo-auto-generated-header',
    // Real CF sender is the direct info@ address (not the M365 relay).
    // Auto-Submitted header value is "auto-generated" per RFC 3834, not "auto-replied".
    // Verifies both direct-sender OOO and the RFC 3834 permissive header check.
    message: {
      from: '"City Fabrick Information" <info@cityfabrick.org>',
      from_address: 'info@cityfabrick.org',
      subject: 'Automatic reply: For City Fabrick — a quick MWELO tool demo',
      body: "I am out of office with limited access to email. I'll return after the holiday weekend.  Thanks!",
      headers: {
        'auto-submitted': 'auto-submitted: auto-generated',   // n8n raw format
      },
      thread_id: 'thread-cf-real-1',
      message_id: 'msg-cf-real-1',
    },
    expected: {
      type: 'ooo',
      prospect_email: 'info@cityfabrick.org',
      link_method: 'sender_match',   // direct address in Prospects → no SendLog fallback needed
      dnc_flip: false,
      status_change: false,
    },
  },

  {
    id: '14-capterra-subdomain-noise',
    // Real Capterra promo comes from teamcapterra@e.capterra.com — subdomain, not root.
    // Verifies NOISE_DOMAINS.endsWith('.d') match.
    message: {
      from: '"Team Capterra" <teamcapterra@e.capterra.com>',
      from_address: 'teamcapterra@e.capterra.com',
      subject: 'Software with no commitments? Yes, please',
      body: 'Honest insights—no payments or pressure needed...',
      headers: {},
      thread_id: 'thread-cap-real-1',
      message_id: 'msg-cap-real-1',
    },
    expected: {
      type: 'noise_skipped',
      reason: 'noise_sender',
    },
  },
];

// -----------------------------------------------------------------------------
// Compare + run
// -----------------------------------------------------------------------------

function compareResult(actual, expected) {
  if (actual === null || actual === undefined) {
    return { ok: false, reason: 'classifier returned null (stub or crashed)' };
  }
  if (actual.type !== expected.type) {
    return { ok: false, reason: `type mismatch: got "${actual.type}" want "${expected.type}"` };
  }
  if (expected.prospect_email !== undefined && actual.prospect_email !== expected.prospect_email) {
    return { ok: false, reason: `prospect_email mismatch: got "${actual.prospect_email}" want "${expected.prospect_email}"` };
  }
  if (expected.link_method !== undefined && actual.link_method !== expected.link_method) {
    return { ok: false, reason: `link_method mismatch: got "${actual.link_method}" want "${expected.link_method}"` };
  }
  if (expected.reason !== undefined && actual.reason !== expected.reason) {
    return { ok: false, reason: `reason mismatch: got "${actual.reason}" want "${expected.reason}"` };
  }
  if (expected.dnc_flip !== undefined && actual.dnc_flip !== expected.dnc_flip) {
    return { ok: false, reason: `dnc_flip mismatch: got ${actual.dnc_flip} want ${expected.dnc_flip}` };
  }
  if (expected.status_change !== undefined && actual.status_change !== expected.status_change) {
    return { ok: false, reason: `status_change mismatch: got ${actual.status_change} want ${expected.status_change}` };
  }
  return { ok: true };
}

function main() {
  console.log(`\n=== Workflow B v4 classifier — test harness ===\n`);
  console.log(`  Fixtures:            ${FIXTURES.length}`);
  console.log(`  Prospects mock rows: ${PROSPECTS.length}`);
  console.log(`  SendLog mock rows:   ${SENDLOG.length}\n`);

  let pass = 0;
  let fail = 0;
  const failures = [];

  for (const f of FIXTURES) {
    let actual;
    try {
      actual = classify(f.message, { prospects: PROSPECTS, sendlog: SENDLOG });
    } catch (err) {
      actual = null;
      failures.push({ id: f.id, reason: `classifier threw: ${err.message}` });
      console.log(`  💥 ${f.id.padEnd(38)}  THREW: ${err.message}`);
      fail++;
      continue;
    }

    const result = compareResult(actual, f.expected);
    if (result.ok) {
      console.log(`  ✅ ${f.id.padEnd(38)}  → ${actual.type}`);
      pass++;
    } else {
      console.log(`  ❌ ${f.id.padEnd(38)}  expected=${f.expected.type.padEnd(30)}  ${result.reason}`);
      failures.push({ id: f.id, reason: result.reason });
      fail++;
    }
  }

  console.log(`\n=== ${pass}/${FIXTURES.length} passed, ${fail} failed ===\n`);

  if (fail > 0) {
    console.log(`Failure summary:`);
    for (const f of failures) console.log(`  - ${f.id}: ${f.reason}`);
    console.log(``);
    process.exit(1);
  }
  console.log(`✅ All ${FIXTURES.length} fixtures pass.\n`);
  process.exit(0);
}

main();
