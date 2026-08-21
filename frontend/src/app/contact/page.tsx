import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us | Totemood",
  description: "Get in touch with Totemood for personalized gifting inquiries, support, and more.",
};

export default function ContactPage() {
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
                  WE'D LOVE TO HEAR FROM YOU
                </p>
                <h1 className="text-[52px] md:text-[64px] font-title text-[#252A1A] leading-[1] tracking-tight">
                  Get in Touch
                </h1>
              </div>
              
              <div className="text-[18px] text-[#5A5A55] leading-[1.6] max-w-[500px] mb-8">
                <p>
                  Whether you have a question about our personalised bags, need help with an order, or just want to share some love, we're here for you.
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
                    <a href="https://wa.me/919890842755" className="text-[15px] text-[#b06161] font-bold hover:text-[#252A1A] transition-colors mt-0.5 inline-block">
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
                    <a href="mailto:totemood21@gmail.com" className="text-[15px] text-[#b06161] font-bold hover:text-[#252A1A] transition-colors mt-0.5 inline-block">
                      totemood21@gmail.com
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
              
              <form className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      id="firstName" 
                      className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all placeholder:text-[#a2a596]"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      id="lastName" 
                      className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all placeholder:text-[#a2a596]"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all placeholder:text-[#a2a596]"
                    placeholder="jane@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Subject</label>
                  <select 
                    id="subject"
                    className="w-full bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled className="text-[#a2a596]">Select a topic</option>
                    <option>Order Inquiry</option>
                    <option>Customisation</option>
                    <option>Shipping</option>
                    <option>Product Question</option>
                    <option>Collaboration</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[12px] font-bold text-[#686B59] uppercase tracking-wider">Message</label>
                  <textarea 
                    id="message" 
                    className="w-full h-[140px] md:h-[150px] bg-[#FAF9F8] border border-[#E8E5DC] rounded-[14px] px-5 py-3 text-[16px] text-[#252A1A] focus:outline-none focus:border-[#8E9476] focus:ring-1 focus:ring-[#8E9476] transition-all resize-none placeholder:text-[#a2a596]"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="button"
                    className="w-full bg-[#252A1A] text-white text-[14px] font-medium tracking-wide py-3.5 rounded-[14px] hover:bg-[#3A3E2F] transition-all flex items-center justify-center gap-1"
                  >
                    Send message &rarr;
                  </button>
                  <p className="text-[12px] text-[#8C867C] text-center mt-3 tracking-wide">
                    We usually reply within 1 business day.
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
