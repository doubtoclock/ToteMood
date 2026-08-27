"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { loadGoogleIdentity, renderGoogleSignInButton } from "@/lib/googleSignIn";
import PrivacyConsent, { usePrivacyAccepted } from "@/components/PrivacyConsent";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSignInPrompt } from "@/lib/store/useSignInPrompt";
import type { AccountSession } from "@/lib/account";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export function GoogleSignInControls({ onSignedIn }: { onSignedIn?: () => void }) {
  const signIn = useAuthStore((state) => state.signIn);
  const consented = usePrivacyAccepted();
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  const handleCredential = useCallback(
    async (credential: string) => {
      try {
        const session = await apiFetch<AccountSession>("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({ credential }),
        });
        signIn(session);
        onSignedIn?.();
      } catch {}
    },
    [signIn, onSignedIn]
  );

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !consented || !node) return;
    let cancelled = false;
    loadGoogleIdentity().then((googleId) => {
      if (cancelled || !googleId || !node.isConnected) return;
      renderGoogleSignInButton(node, GOOGLE_CLIENT_ID, handleCredential);
    });
    return () => {
      cancelled = true;
    };
  }, [node, consented, handleCredential]);

  if (!GOOGLE_CLIENT_ID || !consented) return null;
  return <div ref={setNode} data-testid="google-signin-mount" />;
}

export function SignInToast({ open, onDismiss }: { open: boolean; onDismiss?: () => void }) {
  const accountToken = useAuthStore((state) => state.token);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!open) setDismissed(false);
  }, [open]);

  if (!open || dismissed || accountToken) return null;

  return (
    <div
      data-testid="signin-toast"
      className="fixed bottom-6 right-6 z-[110] w-[calc(100vw-48px)] max-w-[340px] rounded-[18px] border border-[#E8E5DC] bg-white p-5 shadow-[0_18px_50px_rgba(37,42,26,0.18)]"
    >
      <button
        type="button"
        aria-label="Dismiss sign in"
        onClick={() => {
          setDismissed(true);
          onDismiss?.();
        }}
        className="absolute right-3 top-3 text-[#8C867C] hover:text-[#252A1A] transition-colors"
      >
        <X size={16} />
      </button>
      <h4 className="text-[15px] font-title text-[#252A1A] mb-1">Great choice!</h4>
      <p className="text-[12px] leading-relaxed text-[#686B59] mb-4">
        Sign in right here to check out faster — no need to visit the account page.
      </p>
      <div className="mb-4">
        <PrivacyConsent />
      </div>
      <GoogleSignInControls />
    </div>
  );
}

export function GlobalSignInToast() {
  const open = useSignInPrompt((state) => state.open);
  const closePrompt = useSignInPrompt((state) => state.closePrompt);

  return <SignInToast open={open} onDismiss={closePrompt} />;
}
