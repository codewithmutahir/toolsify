"use client";

import {
  useCallback,
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 6;

type OtpInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  error?: boolean;
};

export default function OtpInput({
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    inputRefs.current[index]?.focus();
  }, []);

  const updateDigit = useCallback(
    (index: number, digit: string) => {
      const next = [...value];
      next[index] = digit;
      onChange(next);
      if (digit && index < OTP_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [focusInput, onChange, value]
  );

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1);
    updateDigit(index, digit);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      focusInput(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const next = Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? "");
    onChange(next);
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  return (
    <div className="verification-otp-row flex gap-sm sm:gap-md justify-between w-full">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          autoFocus={index === 0}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Verification digit ${index + 1}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={cn(
            "otp-input verification-otp-input flex-1 min-w-0 max-w-[60px]",
            "h-[60px] sm:h-[68px] text-center font-h2 text-h2 rounded-lg transition-all",
            "bg-surface-container-low border border-outline-variant focus:bg-white",
            "box-border leading-none disabled:opacity-60 disabled:cursor-not-allowed",
            digit && "bg-white",
            error && "border-error",
            !error &&
              "focus:border-primary focus:border-2 focus:shadow-[0_0_12px_rgba(255,107,53,0.2)]"
          )}
        />
      ))}
    </div>
  );
}
