"use client";

import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Mail, MessageCircle, Loader2 } from "lucide-react";

const WHATSAPP_PHONE = "919890842755";
const MESSAGE_MAX = 500;

const SUBJECTS = [
  "Order Inquiry",
  "Customisation",
  "Shipping",
  "Product Question",
  "Collaboration",
  "Other",
] as const;

function buildWhatsAppUrl(firstName: string, lastName: string, subject: string, message: string) {
  const name = [firstName, lastName].filter(Boolean).join(" ") || "Customer";
  const text = `Hi Totemood! I'm ${name}.\n\nSubject: ${subject || "General Inquiry"}\n\n${message || "I'd like to get in touch."}`.trim();
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
}

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [linkReady, setLinkReady] = useState(false);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    setLinkReady(false);

    // Simulate brief generation time for UX
    await new Promise((r) => setTimeout(r, 800));

    const url = buildWhatsAppUrl(firstName, lastName, subject, message);
    setWhatsappUrl(url);
    setIsGenerating(false);
    setLinkReady(true);
  };

  const handleOpenWhatsApp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  };

  const hasContent = firstName.trim().length > 0 || message.trim().length > 0;

  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-[90px] pb-16">
      <Section className="relative overflow-hidden pt-0 md:pt-0">
        <AmbientGlow
          color="bg-[#8E9476]"
          opacity={0.06}
          position="top-[10%] right-[-10%]"
          width="w-[50vw]"
          height="h-[50vw]"
          shape="organic2"
        />
        <Container className="relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Column: Contact Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="text-[14px] md:text-[16px] text-[#b06161] font-bold uppercase tracking-[0.2em] mb-2">
                  WE&apos;D LOVE TO HEAR FROM YOU
                </p>
                <h1 className="text-[52px] md:text-[64px] font-title text-[#252A1A] leading-[1] tracking-tight">
                  Get in Touch
                </h1>
              </div>
              
              <div className="text-[18px] text-[#5A5A55] leading-[1.6] max-w-[500px] mb-8">
                <p>
                  Whether you have a question about our personalised bags, need help with an order, or just want to share some love, we&apos;re here for you.
                </p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F5F3EC] flex items-center justify-center shrink-0">
                    <MessageCircle className="w-[20px] h-[20px] text-[#252A1A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-title text-[18px] text-[#252A1A] mb-0.5">WhatsApp</h3>
                    <p className="text-[14px] text-[#686B59]">Fastest way to reach us for order approvals and queries.</p>
                    <a href={`https://wa.me/${WHATSAPP_PHONE}`} className="text-[15px] text-[#b06161] font-bold hover:text-[#252A1A] transition-colors mt-0.5 inline-block">
                      +91 98908 42755
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F5F3EC] flex items-center justify-center shrink-0">
                    <Mail className="w-[20px] h-[20px] text-[#252A1A]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-title text-[18px] text-[#252A1A] mb-0.5">Email</h3>
                    <p className="text-[14px] text-[#686B59]">For business inquiries and support.</p>
                    <a href="mailto:totemood.gifts@gmail.com" className="text-[15px] text-[#b06161] font-bold hover:text-[#252A1A] transition-colors mt-0.5 inline-block">
                      totemood.gifts@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F5F3EC] flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#252A1A]">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-title text-[18px] text-[#252A1A] mb-0.5">Instagram</h3>
                    <p className="text-[14px] text-[#686B59]">Follow our journey and tag us in your photos!</p>
                    <a href="https://instagram.com/totemood_gifts" target="_blank" rel="noopener noreferrer" className="text-[15px] text-[#b06161] font-bold hover:text-[#252A1A] transition-colors mt-0.5 inline-block">
                      @totemood_gifts
                    </a>
                  </div>
                </div>
              </div>
              
              <p className="text-[12px] text-[#8C867C] mt-6 lg:mt-8 uppercase tracking-widest font-medium">
                Mumbai, India &middot; Creating personalised keepsakes
              </p>
            </div>

            {/* Right Column: Contact Form */}
            <div className="bg-white rounded-[24px] px-6 py-6 md:px-10 md:py-8 border border-[#E8E5DC] lg:mt-3">
              <h2 className="text-[22px] md:text-[24px] font-title text-[#252A1A] mb-6">Send a Message</h2>
              
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setLinkReady(false); }}
                      className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all placeholder:text-[#a2a596]"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setLinkReady(false); }}
                      className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all placeholder:text-[#a2a596]"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Subject</label>
                  <select 
                    id="subject"
                    value={subject}
                    onChange={(e) => { setSubject(e.target.value); setLinkReady(false); }}
                    className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all cursor-pointer"
                  >
                    <option value="" disabled className="text-[#a2a596]">Select a topic</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="message" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Message</label>
                    <span className="text-[11px] text-[#a2a596]">{message.length}/{MESSAGE_MAX}</span>
                  </div>
                  <textarea 
                    id="message" 
                    value={message}
                    onChange={(e) => { setMessage(e.target.value.slice(0, MESSAGE_MAX)); setLinkReady(false); }}
                    className="w-full h-[140px] md:h-[150px] bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all resize-none placeholder:text-[#a2a596]"
                    placeholder="How can we help you?"
                    maxLength={MESSAGE_MAX}
                  ></textarea>
                </div>

                <div className="pt-2 space-y-3">
                  {linkReady ? (
                    <button 
                      type="button"
                      onClick={handleOpenWhatsApp}
                      className="w-full bg-[#25D366] text-white text-[14px] font-medium tracking-wide py-3.5 rounded-[14px] hover:bg-[#1ebe5d] transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-[18px] h-[18px]" />
                      Open WhatsApp &rarr;
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handleGenerateLink}
                      disabled={isGenerating || !hasContent}
                      className="w-full bg-[#252A1A] text-white text-[14px] font-medium tracking-wide py-3.5 rounded-[14px] hover:bg-[#3A3E2F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-[18px] h-[18px] animate-spin" />
                          Being generated&hellip;
                        </>
                      ) : (
                        <>
                          Generate WhatsApp Link &rarr;
                        </>
                      )}
                    </button>
                  )}
                  <p className="text-[12px] text-[#8C867C] text-center tracking-wide">
                    {linkReady ? "Link ready! Tap above to open WhatsApp." : "Fill in your details, then generate a link to message us on WhatsApp."}
                  </p>
                </div>
              </form>
            </div>

          </div>

        </Container>
      </Section>
    </main>
  );
}
