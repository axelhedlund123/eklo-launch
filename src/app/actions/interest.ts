"use server";

import { sql } from "@/lib/db";

export type InterestState = { ok?: boolean; error?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Records a launch-interest signup in eklo-production's LaunchInterest
 * table (see sql/001_launch_interest.sql) -- "köpa" or "sälja" is stored
 * as-is rather than inferred, so there's a clean BUYER/SELLER split to
 * export later without guessing from an email domain or anything else.
 * Upserts on email: submitting the form again (e.g. changing your mind
 * from "köpa" to "sälja") updates the existing row instead of erroring on
 * the unique constraint.
 */
export async function registerInterestAction(
  _prev: InterestState,
  formData: FormData,
): Promise<InterestState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "");

  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Ange en giltig e-postadress." };
  }
  if (role !== "BUYER" && role !== "SELLER") {
    return { error: "Välj om du vill köpa eller sälja." };
  }

  try {
    const db = sql();
    await db`
      INSERT INTO "LaunchInterest" (email, role)
      VALUES (${email}, ${role})
      ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
    `;
  } catch (err) {
    console.error("registerInterestAction: insert failed:", err);
    return { error: "Något gick fel. Försök igen om en liten stund." };
  }

  return { ok: true };
}
