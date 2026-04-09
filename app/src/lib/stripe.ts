import Stripe from "stripe";
import type { Plan } from "@prisma/client";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
  appInfo: {
    name: "Phasewise",
    version: "0.1.0",
    url: "https://phasewise.io",
  },
});

/**
 * Map Stripe Price IDs (from env) to internal Plan enum values.
 * Both NEXT_PUBLIC_* (for the client) and the same lookup happens server-side
 * during checkout + webhook handling.
 */
export const STRIPE_PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? ""]: "STARTER",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL ?? ""]: "PROFESSIONAL",
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? ""]: "STUDIO",
};

export const PLAN_TO_STRIPE_PRICE: Record<Exclude<Plan, "TRIAL" | "ENTERPRISE">, string> = {
  STARTER: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
  PROFESSIONAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL ?? "",
  STUDIO: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? "",
};

export function planFromPriceId(priceId: string | null | undefined): Plan | null {
  if (!priceId) return null;
  return STRIPE_PRICE_TO_PLAN[priceId] ?? null;
}

/**
 * Public-safe price config for the pricing page UI.
 * This object is what client components import.
 */
export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER ?? "",
    price: "$99",
    plan: "STARTER" as const,
  },
  {
    id: "professional",
    name: "Professional",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL ?? "",
    price: "$199",
    plan: "PROFESSIONAL" as const,
  },
  {
    id: "studio",
    name: "Studio",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STUDIO ?? "",
    price: "$349",
    plan: "STUDIO" as const,
  },
];
