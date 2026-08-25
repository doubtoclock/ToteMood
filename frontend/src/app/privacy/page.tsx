import type { Metadata } from "next";
import Link from "next/link";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export const metadata: Metadata = {
  title: "Privacy Policy | Totemood",
  description: "How Totemood collects, stores, and protects your data — including your photos.",
};

const sectionClass = "mb-10";
const headingClass = "text-[20px] md:text-[24px] font-title text-[#252A1A] mb-4";
const textClass = "text-[14px] md:text-[15px] leading-relaxed text-[#5A5A55]";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-28 md:pt-36 pb-24 relative">
      <AmbientGlow color="bg-[#C4C9B3]" opacity={0.12} position="top-[5%] right-[10%]" shape="organic2" />
      <div className="container mx-auto px-6 max-w-[780px] relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#8C867C] mb-3">Legal</p>
        <h1 className="text-[38px] md:text-[48px] font-title text-[#252A1A] leading-none mb-4">Privacy Policy</h1>
        <p className="text-[13px] text-[#686B59] mb-10">Last updated: August 2026</p>

        {/* The promise we want every customer to see */}
        <div
          data-testid="photo-safety-highlight"
          className="rounded-[20px] border-2 border-[#8E9476] bg-[#F0F2E6] p-6 md:p-8 mb-12 shadow-sm"
        >
          <p className="text-[18px] md:text-[22px] font-bold text-[#3E4530] leading-snug">
            The photos shared on the website are private and safe. They are never sent anywhere — not to us, not to any
            third party.
          </p>
          <p className="text-[13px] text-[#5A5A55] mt-3">
            Your photo is used only to prepare the custom artwork you asked for, and it stays exactly where you left it:
            in your own browser session.
          </p>
        </div>

        <section className={sectionClass}>
          <h2 className={headingClass}>1. What we collect</h2>
          <ul className={`${textClass} list-disc pl-5 space-y-2`}>
            <li>
              <b>Google account details</b> (name, email, profile picture) when you sign in. We receive these from Google
              after you explicitly approve the sign-in.
            </li>
            <li>
              <b>Order details</b> you type at checkout: contact information, shipping address, phone number, and the
              custom text you want printed.
            </li>
            <li>
              <b>Custom photos / images</b> you pick for personalization. These stay on your device and inside your own
              browser until an order is placed; they are never uploaded to our servers beforehand and never shared with
              anyone.
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>2. Where your data is stored</h2>
          <ul className={`${textClass} list-disc pl-5 space-y-2`}>
            <li>
              <b>Your browser (localStorage):</b> shopping cart contents, sign-in session, address-book drafts, and your
              privacy-consent choice live only on your device. Clearing your browser data removes them instantly.
            </li>
            <li>
              <b>Our database (Supabase, hosted in the cloud):</b> once you place an order we store the order record —
              contact name, email, phone, shipping address, ordered items, and any custom text or image attached to that
              order so we can print it.
            </li>
            <li>
              <b>Hosting &amp; infrastructure:</b> the website runs on Vercel; the API runs on Render. Both process data
              solely to operate this store.
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>3. Who we share data with</h2>
          <ul className={`${textClass} list-disc pl-5 space-y-2`}>
            <li>
              <b>Razorpay:</b> processes your payment. Card/UPI details go directly to Razorpay — we never see or store
              them.
            </li>
            <li>
              <b>GoKwik:</b> used for checkout fraud checks and order tracking. Order and contact details needed for
              delivery are shared with them.
            </li>
            <li>
              <b>Shipping partners:</b> your name, address, and phone are shared so your tote actually reaches you.
            </li>
            <li>
              <b>Nobody else.</b> We do not sell, rent, or trade your personal information — and your photos are never
              sent anywhere at all.
            </li>
          </ul>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>4. Deleting your data</h2>
          <p className={textClass}>
            You are in control. On the{" "}
            <Link href="/account" className="text-[#757D5C] font-semibold underline underline-offset-2">
              Account page
            </Link>{" "}
            you will find a <b>&ldquo;Delete All My Data&rdquo;</b> option that permanently and irreversibly hard-deletes
            every order, order item, and saved address tied to your email from our database. Sign-in sessions live only in
            your browser — signing out clears them.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>5. Consent</h2>
          <p className={textClass}>
            Before you sign in we ask you to confirm you have read this policy via a consent checkbox. We record that
            single yes/no choice in your browser so we don&rsquo;t ask again on every visit.
          </p>
        </section>

        <section className={sectionClass}>
          <h2 className={headingClass}>6. Questions?</h2>
          <p className={textClass}>
            Reach us any time via the{" "}
            <Link href="/contact" className="text-[#757D5C] font-semibold underline underline-offset-2">
              Contact page
            </Link>{" "}
            and we will help with anything related to your data.
          </p>
        </section>
      </div>
    </main>
  );
}
