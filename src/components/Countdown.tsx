"use client";

import { useEffect, useState } from "react";
import { LAUNCH_DATE } from "@/lib/time";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingUntil(target: Date): Remaining {
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const units: { key: keyof Remaining; label: string }[] = [
  { key: "days", label: "dagar" },
  { key: "hours", label: "timmar" },
  { key: "minutes", label: "minuter" },
  { key: "seconds", label: "sekunder" },
];

/**
 * Ticks down to LAUNCH_DATE (1 november 2026). Starts rendering `null`
 * (nothing) on the server and fills in on mount rather than computing the
 * remaining time during SSR -- the server's clock and the visitor's own
 * will always disagree by at least a little, and a countdown is exactly
 * the kind of value where that shows up as a jarring one-second jump
 * right after hydration. A blank gap for one frame reads better than a
 * number visibly correcting itself.
 */
export function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    // Deliberately client-only: the server and the visitor's own clock
    // will never agree down to the second, so this is computed for the
    // first time after mount rather than during SSR (see the comment
    // above this component).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRemaining(remainingUntil(LAUNCH_DATE));
    const interval = setInterval(() => {
      setRemaining(remainingUntil(LAUNCH_DATE));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!remaining) {
    return <div className="mt-8 h-20" aria-hidden />;
  }

  return (
    <div
      className="mt-8 flex items-center justify-center gap-3 sm:gap-5"
      role="timer"
      aria-live="off"
    >
      {units.map(({ key, label }) => (
        <div key={key} className="flex flex-col items-center">
          <span className="w-14 rounded-xl bg-white py-2.5 text-2xl font-semibold tabular-nums text-gray-900 shadow-sm sm:w-16 sm:text-3xl">
            {String(remaining[key]).padStart(2, "0")}
          </span>
          <span className="mt-1.5 text-[11px] text-gray-500 sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
