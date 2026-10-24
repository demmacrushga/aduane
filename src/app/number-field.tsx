"use client";

import { useId, useState } from "react";

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  onChange: (value: number) => void;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Number input you can freely clear and retype. While typing, the draft is kept as text and only
 * committed when it is a valid number in range; on blur it snaps back into range.
 */
export default function NumberField({ label, value, min, max, step, prefix, onChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const labelId = useId();

  const commit = (n: number) => {
    setDraft(null);
    onChange(clamp(n, min, max));
  };

  const btn =
    "grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-line bg-background text-2xl font-semibold leading-none text-brand active:scale-95 disabled:opacity-35";

  return (
    <div className="text-sm text-muted">
      <span id={labelId} className="mb-1 block">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={btn}
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => commit(value - step)}
        >
          −
        </button>
        <div className="relative min-w-0 flex-1">
          {prefix && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground/60">
              {prefix}
            </span>
          )}
          <input
            aria-labelledby={labelId}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={draft ?? String(value)}
            onChange={(e) => {
              const text = e.target.value.replace(/\D/g, "").slice(0, 4);
              setDraft(text);
              const n = Number(text);
              if (text !== "" && n >= min && n <= max) onChange(n);
            }}
            onBlur={() => commit(draft === null || draft === "" ? value : Number(draft))}
            onFocus={(e) => e.target.select()}
            className={`h-11 w-full rounded-xl border border-line bg-background text-center text-lg font-semibold text-foreground ${
              prefix ? "pl-9 pr-3" : "px-3"
            }`}
          />
        </div>
        <button
          type="button"
          className={btn}
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => commit(value + step)}
        >
          +
        </button>
      </div>
    </div>
  );
}
