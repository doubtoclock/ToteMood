"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#FAF9F8] flex items-center justify-center px-6">
      <div className="text-center max-w-[400px]">
        <h2 className="text-[28px] font-title text-[#252A1A] mb-4">Something went wrong</h2>
        <p className="text-[15px] text-[#686B59] mb-8 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[#252A1A] text-white h-[50px] px-8 rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#3A3E2F] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-[#E8E5DC] text-[#686B59] h-[50px] px-8 rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:text-[#252A1A] hover:border-[#252A1A] transition-colors inline-flex items-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
