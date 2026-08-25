"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

const CONSENT_KEY = "totemood_privacy_consent";
const CONSENT_EVENT = "totemood_privacy_consent_change";

export function hasAcceptedPrivacy(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function usePrivacyAccepted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

// Server snapshot mirrors the "already accepted" state so SSR output stays
// stable; the client snapshot corrects it right after hydration.
const getServerSnapshot = () => true;
const getSnapshot = () => hasAcceptedPrivacy();

export default function PrivacyConsent({ onChange }: { onChange?: (accepted: boolean) => void }) {
  const accepted = usePrivacyAccepted();

  const update = (next: boolean) => {
    try {
      localStorage.setItem(CONSENT_KEY, String(next));
    } catch {}
    window.dispatchEvent(new Event(CONSENT_EVENT));
    onChange?.(next);
  };

  if (accepted) {
    return (
      <p data-testid="privacy-consent-recorded" className="text-[12px] text-[#8C867C]">
        You&rsquo;ve accepted our{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 text-[#757D5C] font-medium hover:text-[#5A5A55]"
        >
          Privacy Policy
        </Link>
        . Your photos stay private and are never sent anywhere.
      </p>
    );
  }

  return (
    <label data-testid="privacy-consent" className="flex items-start gap-3 cursor-pointer select-none max-w-md">
      <input
        type="checkbox"
        checked={false}
        onChange={(e) => update(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#757D5C] cursor-pointer"
      />
      <span className="text-[13px] leading-relaxed text-[#5A5A55]">
        I have read and accept the{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-2 text-[#757D5C] font-semibold hover:text-[#252A1A]"
        >
          Privacy Policy
        </Link>{" "}
        — my photos stay private and are never sent anywhere.
      </span>
    </label>
  );
}
