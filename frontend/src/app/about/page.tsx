import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export const metadata = {
  title: "About Us | Totemood",
  description: "The vision behind Totemood by Siya Maurya.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FFFCE6] pt-28 pb-16">
      <Section className="relative overflow-hidden">
        <AmbientGlow
          color="bg-[#8E9476]"
          opacity={0.08}
          position="top-[10%] left-[-10%]"
          width="w-[50vw]"
          height="h-[50vw]"
          shape="organic"
        />
        <Container className="relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: Content */}
            <div className="flex flex-col order-2 lg:order-1">
              <div className="mb-10">
                <h1 className="text-5xl md:text-7xl font-title text-primary mb-4 leading-none tracking-tight capitalize">
                  Siya Maurya
                </h1>
                <p className="text-lg md:text-xl text-[#D94F3C] font-heading uppercase tracking-widest">
                  BUILDING TOTEMOOD
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl font-title text-primary mb-6 italic">
                My Vision
              </h2>
              
              <div className="space-y-6 text-lg md:text-xl text-primary/80 leading-relaxed font-sans">
                <p>
                  My vision is to spread <strong>love, warmth, and meaningful connections</strong> through personalised gifting. I believe every relationship has a story, and every story deserves to be celebrated in a way that feels <strong>personal, thoughtful, and real</strong>.
                </p>
                
                <p>
                  In a world of fast and forgettable gifts, I want to bring back <strong>emotion</strong>—gifts that make people smile, feel seen, and feel loved. By turning memories into art and moments into keepsakes, I aim to help you express what words sometimes can&apos;t.
                </p>
                
                <p>
                  Every personalised gift I create is made with care, because to me, it&apos;s not just a product—it&apos;s a <strong>piece of someone&apos;s love story</strong>.
                </p>
                
                <p className="pt-4 font-heading font-bold text-primary tracking-widest uppercase">
                  - SIYA MAURYA
                </p>
              </div>
            </div>

            {/* Right Column: Photo */}
            <div className="relative w-full max-w-md mx-auto lg:max-w-none aspect-[4/5] lg:aspect-[3/4] order-1 lg:order-2">
              <div className="absolute inset-0 rounded-[2rem] overflow-hidden border-8 border-white/50 shadow-xl bg-[#EAECE3]">
                <Image 
                  src="/siya.png" 
                  alt="Siya Maurya" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* Subtle decorative elements */}
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#D94F3C]/10 rounded-full blur-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#8E9476]/20 rounded-full blur-2xl -z-10"></div>
            </div>

          </div>

        </Container>
      </Section>
    </main>
  );
}
