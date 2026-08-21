"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#FAF9F8", color: "#252A1A", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0, padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Something went wrong</h2>
          <p style={{ color: "#686B59", marginBottom: "1.5rem" }}>{error.message || "An unexpected error occurred."}</p>
          <button
            onClick={reset}
            style={{ background: "#252A1A", color: "#fff", border: "none", padding: "12px 28px", borderRadius: "14px", cursor: "pointer", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
