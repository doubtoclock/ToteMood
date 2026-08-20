import { Star, Truck, MessageCircle, ShieldCheck } from "lucide-react";

export function ShopNewsletter() {
  return (
    <section className="bg-white pt-14 pb-14 md:pt-18 md:pb-18 border-t border-[#1C1C1A]/10">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Trust Banner */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-serif text-[#1C1C1A] mb-8">We Have Made 1,000+ Custom Tote Bags</h3>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-20">
            <div className="flex flex-col items-center max-w-[200px]">
              <Star className="w-8 h-8 text-[#b06161] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">4.9/5 Average Rating</span>
              <span className="text-xs text-[#5A5A55] text-center">From 1,000+ Reviews</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <Truck className="w-8 h-8 text-[#b06161] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">Fast & Free Shipping</span>
              <span className="text-xs text-[#5A5A55] text-center">To all customers</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <MessageCircle className="w-8 h-8 text-[#b06161] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">WhatsApp Support</span>
              <span className="text-xs text-[#5A5A55] text-center">Instant assistance</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <ShieldCheck className="w-8 h-8 text-[#b06161] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">Secure & Safe Checkout</span>
              <span className="text-xs text-[#5A5A55] text-center">Your data is protected</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
