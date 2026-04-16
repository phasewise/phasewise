import { LoopsClient } from "loops";

if (!process.env.LOOPS_API_KEY) {
  // Don't throw — emails should never block the app from booting.
  // We just won't send any emails until the key is set.
  console.warn("[loops] LOOPS_API_KEY is not set — transactional emails will be skipped");
}

export const loops = process.env.LOOPS_API_KEY
  ? new LoopsClient(process.env.LOOPS_API_KEY)
  : null;

/**
 * Loops transactional template IDs.
 *
 * Each value here must match a transactional template ID created in the
 * Loops dashboard at https://app.loops.so/transactional. Set them as
 * environment variables so we can update templates without redeploying.
 *
 * The dashboard shows the ID at the top of each template editor.
 */
export const LOOPS_TEMPLATES = {
  WELCOME: process.env.LOOPS_TEMPLATE_WELCOME ?? "",
  TRIAL_STARTED: process.env.LOOPS_TEMPLATE_TRIAL_STARTED ?? "",
  SUBSCRIPTION_CANCELED: process.env.LOOPS_TEMPLATE_SUBSCRIPTION_CANCELED ?? "",
  PAYMENT_FAILED: process.env.LOOPS_TEMPLATE_PAYMENT_FAILED ?? "",
  SUBMITTAL_REMINDER: process.env.LOOPS_TEMPLATE_SUBMITTAL_REMINDER ?? "",
  BUDGET_ALERT: process.env.LOOPS_TEMPLATE_BUDGET_ALERT ?? "",
} as const;

type SendOptions = {
  email: string;
  transactionalId: string;
  dataVariables?: Record<string, string | number>;
};

/**
 * Send a transactional email via Loops.
 *
 * Never throws. If Loops fails (or isn't configured), we log and continue
 * — emails should never block business-critical flows like signup or
 * webhook processing.
 */
export async function sendTransactional({
  email,
  transactionalId,
  dataVariables,
}: SendOptions): Promise<{ success: boolean; error?: string }> {
  if (!loops) {
    console.warn(`[loops] Skipping email to ${email} — LOOPS_API_KEY missing`);
    return { success: false, error: "Loops not configured" };
  }
  if (!transactionalId) {
    console.warn(`[loops] Skipping email to ${email} — no transactionalId provided`);
    return { success: false, error: "No transactionalId" };
  }

  try {
    const result = await loops.sendTransactionalEmail({
      email,
      transactionalId,
      ...(dataVariables && { dataVariables }),
      addToAudience: true,
    });
    return { success: result.success === true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Loops error";
    console.error(`[loops] Failed to send to ${email}:`, message);
    return { success: false, error: message };
  }
}

/**
 * Create or update a contact in Loops. Used at signup so the user is
 * immediately part of the audience and can receive marketing campaigns
 * later (with the option to unsubscribe).
 */
export async function upsertContact(params: {
  email: string;
  firstName?: string;
  lastName?: string;
  userId?: string;
  source?: string;
  userGroup?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!loops) {
    return { success: false, error: "Loops not configured" };
  }

  const { email, ...properties } = params;

  // Strip undefined keys so Loops doesn't choke
  const cleanProps: Record<string, string | number | boolean | null> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value !== undefined) cleanProps[key] = value;
  }

  try {
    await loops.updateContact({ email, properties: cleanProps });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Loops error";
    console.error(`[loops] Failed to upsert contact ${email}:`, message);
    return { success: false, error: message };
  }
}
