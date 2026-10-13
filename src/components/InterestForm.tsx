"use client";

import { useActionState, useState } from "react";
import { registerInterestAction, type InterestState } from "@/app/actions/interest";

const initial: InterestState = {};

const field =
  "mt-1 block w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30";
const label = "block text-sm font-medium text-gray-800";
const submit =
  "w-full rounded-md bg-brand px-4 py-2 text-sm font-medium text-on-brand hover:bg-brand-hover disabled:opacity-60";

type Role = "BUYER" | "SELLER";

/** Same shape as eklo-application's own signup role picker
 * (AuthForms.tsx's RoleOption) -- a radio card with a title and a short
 * blurb, not just a button, so the choice reads the same way here as it
 * will the moment someone actually signs up for real. */
function RoleOption({
  value,
  current,
  title,
  blurb,
  onSelect,
}: {
  value: Role;
  current: Role;
  title: string;
  blurb: string;
  onSelect: (value: Role) => void;
}) {
  const selected = value === current;
  return (
    <label
      className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-left text-sm ${
        selected ? "border-brand bg-brand-tint" : "border-black/15 hover:border-black/30"
      }`}
    >
      <span className="flex items-center gap-2 font-medium text-gray-900">
        <input
          type="radio"
          name="role"
          value={value}
          checked={selected}
          onChange={() => onSelect(value)}
          className="text-brand focus:ring-brand"
        />
        {title}
      </span>
      <span className="pl-6 text-xs text-gray-500">{blurb}</span>
    </label>
  );
}

/**
 * The hero's "ge oss din e-post" capture -- styled the same way
 * eklo-application's own signup form is (role picker, labeled fields,
 * full-width submit) rather than a compact pill row, so this reads as a
 * real, serious sign-up rather than a throwaway newsletter box.
 */
export function InterestForm() {
  const [state, formAction, isPending] = useActionState(registerInterestAction, initial);
  const [role, setRole] = useState<Role>("BUYER");

  if (state.ok) {
    return (
      <div className="mx-auto mt-8 max-w-md rounded-2xl bg-brand-tint px-5 py-4 text-sm font-medium text-brand-link">
        Tack! Vi hör av oss så snart eklo öppnar.
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mx-auto mt-8 max-w-md space-y-4 rounded-2xl bg-white p-6 text-left shadow-sm"
    >
      <h2 className="text-center text-sm font-semibold text-gray-900">
        Få besked när eklo öppnar
      </h2>

      <fieldset className="grid gap-2">
        <legend className={`${label} mb-1`}>Jag vill</legend>
        <RoleOption
          value="BUYER"
          current={role}
          title="Handla mat lokalt"
          blurb="Få besked när eklo öppnar för kunder i din närhet."
          onSelect={setRole}
        />
        <RoleOption
          value="SELLER"
          current={role}
          title="Sälja som producent"
          blurb="Få besked när du kan börja lägga upp din egen butik."
          onSelect={setRole}
        />
      </fieldset>

      <div>
        <label className={label} htmlFor="interest-email">
          E-post
        </label>
        <input
          id="interest-email"
          type="email"
          name="email"
          required
          placeholder="din@epost.se"
          className={field}
        />
      </div>

      <button type="submit" disabled={isPending} className={submit}>
        {isPending ? "Skickar…" : "Anmäl intresse"}
      </button>

      {state.error && <p className="text-sm text-red-700">{state.error}</p>}
    </form>
  );
}
