import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

export const metadata = {
  title: "About Us | Totemood",
  description: "The human story and philosophy behind Totemood.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F8] pt-[110px] pb-24">
      {/* 1. Hero Section: The Founder Story */}
      <Section className="relative pt-0 md:pt-0">
        {/* Subtle tonal variation behind image */}
        <div className="absolute top-10 right-[5%] w-[45vw] h-[70vh] bg-[#F5F3EC] rounded-[40px] -z-10 blur-3xl opacity-80"></div>
        
        <Container>
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16 lg:gap-20">
            {/* Left Column: Content (45%) */}
            <div className="w-full lg:w-[45%] flex flex-col pt-8 lg:pt-16">
              <div className="mb-12">
                <p className="text-[14px] md:text-[16px] text-[#C25858] font-bold uppercase tracking-[0.2em] mb-4">
                  BUILDING TOTEMOOD
                </p>
                <h1 className="text-[52px] md:text-[72px] font-title text-[#252A1A] leading-[1.1] tracking-tight">
                  Siya Maurya
                </h1>
              </div>

              <h2 className="text-[24px] md:text-[28px] font-title text-[#252A1A] mb-6">
                My Vision
              </h2>
              
              <div className="space-y-6 text-[18px] md:text-[20px] text-[#5A5A55] leading-[1.7] max-w-[540px]">
                <p>
                  My vision is to spread love, warmth, and meaningful connections through personalised gifting. I believe every relationship has a story, and every story deserves to be celebrated in a way that feels personal, thoughtful, and real.
                </p>
                
                <p>
                  In a world of fast and forgettable gifts, I want to bring back emotion—gifts that make people smile, feel seen, and feel loved. By turning memories into art and moments into keepsakes, I aim to help you express what words sometimes can't.
                </p>
                
                <p>
                  Every personalised gift I create is made with care, because to me, it's not just a product—it's a piece of someone's love story.
                </p>
              </div>
            </div>

            {/* Right Column: Photo (45%) */}
            <div className="w-full lg:w-[45%] flex flex-col">
              <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden border border-[#E8E5DC] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-[#EAECE3]">
                <Image 
                  src="/siya.png" 
                  alt="Siya Maurya" 
                  fill 
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              <p className="text-[11px] font-bold text-[#8C867C] uppercase tracking-[0.15em] mt-4 ml-2">
                The person behind Totemood
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 2. Story Progression: Why Totemood Exists */}
      <Section className="py-24 md:py-32 bg-white border-y border-[#E8E5DC]">
        <Container>
          <div className="max-w-[800px] mx-auto text-center flex flex-col items-center">
            <h2 className="text-[32px] md:text-[42px] font-title text-[#252A1A] mb-8">
              Why Totemood Exists
            </h2>
            <div className="text-[18px] md:text-[22px] text-[#5A5A55] leading-[1.7] space-y-8">
              <p>
                We noticed that giving gifts had become a transaction—something bought quickly and forgotten easily. But the most meaningful relationships deserve more than generic items off a shelf.
              </p>
              <p>
                Totemood exists to turn fleeting memories and deep emotions into tangible keepsakes. We believe that when you give something deeply personal, you aren't just giving an object; you are giving a feeling, a memory, a piece of your shared history.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Visual Rhythm: How It Started */}
      <Section className="py-24 md:py-32">
        <Container>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-20">
            {/* Left Column: Image (50%) */}
            <div className="w-full lg:w-1/2">
              <div className="relative w-full aspect-[4/3] rounded-[24px] overflow-hidden border border-[#E8E5DC]">
                <Image 
                  src="/images/original_photo.png" 
                  alt="The beginning of Totemood" 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>

            {/* Right Column: Text (45%) */}
            <div className="w-full lg:w-[45%]">
              <h2 className="text-[32px] md:text-[42px] font-title text-[#252A1A] mb-6">
                How It Started
              </h2>
              <div className="space-y-6 text-[18px] text-[#5A5A55] leading-[1.7]">
                <p>
                  It began with a simple desire: to make something by hand that meant something to someone. The first pieces were created at a small desk, fueled by a passion for design and a deep appreciation for human connection.
                </p>
                <p>
                  What started as a personal creative outlet quickly resonated with people who were looking for ways to express love without relying on mass-produced goods. Slowly, carefully, Totemood grew into a dedicated studio.
                </p>
                <p>
                  Today, every piece we craft still carries that original intention. We don't just process orders; we carefully assemble the fragments of your stories into art you can hold.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 4. Emotional Finish & CTA */}
      <Section className="py-32 md:py-40 bg-[#F5F3EC] border-y border-[#E8E5DC]">
        <Container>
          <div className="flex flex-col items-center text-center max-w-[700px] mx-auto">
            <h2 className="text-[40px] md:text-[56px] lg:text-[64px] font-title text-[#252A1A] leading-[1.1] mb-10">
              Check out our bestsellers.
            </h2>
            <Link 
              href="/shop"
              className="bg-[#252A1A] text-white h-[54px] px-12 rounded-[14px] font-bold uppercase tracking-[0.1em] text-[13px] hover:bg-[#3A3E2F] transition-colors shadow-sm inline-flex items-center justify-center"
            >
              Shop our collection &rarr;
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
