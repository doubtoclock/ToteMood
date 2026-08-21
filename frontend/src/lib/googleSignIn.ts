export interface GoogleIdApi {
  initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
  renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleIdApi;
      };
    };
  }
}

let gsiScriptPromise: Promise<GoogleIdApi | null> | null = null;

export function loadGoogleIdentity(): Promise<GoogleIdApi | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.google?.accounts?.id) return Promise.resolve(window.google.accounts.id);

  if (!gsiScriptPromise) {
    gsiScriptPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google?.accounts?.id ?? null);
      script.onerror = () => {
        gsiScriptPromise = null;
        resolve(null);
      };
      document.body.appendChild(script);
    });
  }

  return gsiScriptPromise;
}

export function renderGoogleSignInButton(
  element: HTMLElement,
  clientId: string,
  onCredential: (credential: string) => void,
  options?: Record<string, unknown>
) {
  element.innerHTML = "";
  window.google?.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => onCredential(response.credential),
  });
  window.google?.accounts.id.renderButton(
    element,
    options || { theme: "outline", size: "large", width: 280 }
  );
}
