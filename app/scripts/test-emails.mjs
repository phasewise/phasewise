// One-off script to send a branded test of all 6 Loops transactional
// templates to a single recipient. Reads env from app/.env so the IDs
// and API key match whatever is live. Run with:
//
//   cd app && node --env-file=.env scripts/test-emails.mjs you@example.com
//
// Use a plus-alias (e.g. kgallo22+emailtest@gmail.com) so you can spot
// the 6 in a single inbox view. Each email is fire-and-forget; the
// script logs pass/fail per template.

import { LoopsClient } from "loops";

const apiKey = process.env.LOOPS_API_KEY;
if (!apiKey) {
  console.error("LOOPS_API_KEY not set. Run with --env-file=.env");
  process.exit(1);
}

const recipient = process.argv[2];
if (!recipient) {
  console.error("Usage: node scripts/test-emails.mjs <email>");
  process.exit(1);
}

const loops = new LoopsClient(apiKey);

const tests = [
  {
    name: "Welcome",
    transactionalId: process.env.LOOPS_TEMPLATE_WELCOME,
    dataVariables: {
      recipientName: "Kevin",
      firmName: "Test Landscape Studio",
    },
  },
  {
    name: "Trial Started",
    transactionalId: process.env.LOOPS_TEMPLATE_TRIAL_STARTED,
    dataVariables: {
      recipientName: "Kevin",
      firmName: "Test Landscape Studio",
      planName: "Professional",
      trialEndDate: "April 30, 2026",
    },
  },
  {
    name: "Subscription Canceled",
    transactionalId: process.env.LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED,
    dataVariables: {
      recipientName: "Kevin",
      firmName: "Test Landscape Studio",
    },
  },
  {
    name: "Payment Failed",
    transactionalId: process.env.LOOPS_TEMPLATE_PAYMENT_FAILED,
    dataVariables: {
      recipientName: "Kevin",
      firmName: "Test Landscape Studio",
    },
  },
  {
    name: "Submittal Reminder",
    transactionalId: process.env.LOOPS_TEMPLATE_SUBMITTAL_REMINDER,
    dataVariables: {
      recipientName: "Kevin",
      submittalNumber: "SUB-0042",
      subject: "Concrete paver specification",
      projectName: "1640 Riverside Drive",
      daysOverdue: "3",
      ballInCourt: "Client review",
    },
  },
  {
    name: "Budget Alert",
    transactionalId: process.env.LOOPS_TEMPLATE_BUDGET_ALERT,
    dataVariables: {
      recipientName: "Kevin",
      projectName: "1640 Riverside Drive",
      alertLabel: "90% of budget used",
      burnRate: "92",
      hoursUsed: "92.0",
      budgetedHours: "100.0",
      budgetedFee: "15,000",
    },
  },
];

for (const test of tests) {
  if (!test.transactionalId) {
    console.log(`SKIP ${test.name} — env var not set`);
    continue;
  }
  try {
    const result = await loops.sendTransactionalEmail({
      email: recipient,
      transactionalId: test.transactionalId,
      dataVariables: test.dataVariables,
      addToAudience: false,
    });
    console.log(
      result.success
        ? `SENT ${test.name} → ${recipient}`
        : `FAIL ${test.name}: ${JSON.stringify(result)}`
    );
  } catch (err) {
    console.error(`ERROR ${test.name}:`, err.message ?? err);
  }
  // Small delay so inbox ordering stays predictable.
  await new Promise((r) => setTimeout(r, 500));
}
