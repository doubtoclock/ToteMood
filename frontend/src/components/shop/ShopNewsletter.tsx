import { Star, Truck, Clock, ShieldCheck, Mail } from "lucide-react";

export function ShopNewsletter() {
  return (
    <section className="bg-white pt-16 pb-24 md:pt-20 md:pb-32 border-t border-[#1C1C1A]/10">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Trust Banner */}
        <div className="text-center mb-10">
          <h3 className="text-xl md:text-2xl font-serif text-[#1C1C1A] mb-8">Trusted by 10,000+ Happy Customers</h3>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 lg:gap-20">
            <div className="flex flex-col items-center max-w-[200px]">
              <Star className="w-8 h-8 text-[#757D5C] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">4.9/5 Average Rating</span>
              <span className="text-xs text-[#5A5A55] text-center">From 10,000+ Reviews</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <Truck className="w-8 h-8 text-[#757D5C] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">Fast & Free Shipping</span>
              <span className="text-xs text-[#5A5A55] text-center">On orders over ₹5,000</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <Clock className="w-8 h-8 text-[#757D5C] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">30-Day Money Back</span>
              <span className="text-xs text-[#5A5A55] text-center">No questions asked</span>
            </div>
            
            <div className="flex flex-col items-center max-w-[200px]">
              <ShieldCheck className="w-8 h-8 text-[#757D5C] mb-3 stroke-[1.5]" />
              <span className="text-sm font-bold text-[#1C1C1A] mb-1">Secure & Safe Checkout</span>
              <span className="text-xs text-[#5A5A55] text-center">Your data is protected</span>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-16 bg-[#F8F6EF] p-4 rounded-2xl md:rounded-full border border-[#1C1C1A]/10">
          <div className="hidden md:flex items-center gap-3 px-4 text-[#5A5A55]">
            <Mail className="w-5 h-5 shrink-0" />
          </div>
          <div className="flex w-full md:w-auto flex-grow items-center relative">
            <Mail className="w-5 h-5 text-[#8C867C] absolute left-4 md:hidden" />
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-transparent border-none outline-none text-[#1C1C1A] placeholder:text-[#8C867C] pl-12 md:pl-2 pr-4 py-3"
            />
          </div>
          <button className="w-full md:w-auto bg-[#757D5C] text-white px-8 py-3.5 md:py-3 rounded-xl md:rounded-full font-medium tracking-wide hover:bg-[#5C6348] transition-colors shrink-0 mt-2 md:mt-0">
            Subscribe
          </button>
        </div>

      </div>
    </section>
  );
}
