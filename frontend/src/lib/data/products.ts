export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  gallery?: string[];
  isCustomizable: boolean;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "ghibli-art-tote",
    name: "CUSTOM GHIBLI ART TOTE BAG",
    description: "Bag will have custom Ghibli image only. Add size and approval on WhatsApp after placing orders.",
    price: 499,
    originalPrice: 599,
    image: "/images/product/W1.png",
    gallery: [
      "/images/product/W1.png",
      "/images/product/W2.png",
      "/images/product/W3.png",
      "/images/product/W4.png",
    ],
    isCustomizable: true,
    category: "Bestseller",
    rating: 4.8,
    reviews: 142
  },
  {
    id: "ghibli-text-tote",
    name: "CUSTOM GHIBLI TOTE BAG WITH TEXT",
    description: "Custom Ghibli image + custom text. Add size and approval on WhatsApp after placing orders.",
    price: 599,
    originalPrice: 749,
    image: "/images/product/W5.png",
    gallery: [
      "/images/product/W5.png",
      "/images/product/W6.png",
      "/images/product/W7.png",
      "/images/product/W8.png",
    ],
    isCustomizable: true,
    category: "Bestseller",
    rating: 4.9,
    reviews: 215
  },
  {
    id: "emoji-ghibli-tote",
    name: "CUTE EMOJI WITH GHIBLI TOTE",
    description: "Emoji and text around Ghibli bags. Add size and approval on WhatsApp after placing orders.",
    price: 599,
    originalPrice: 719,
    image: "/images/product/W9.png",
    gallery: [
      "/images/product/W9.png",
      "/images/product/W10.png",
      "/images/product/W11.png",
      "/images/product/W12.png",
    ],
    isCustomizable: true,
    category: "Bestseller",
    rating: 4.7,
    reviews: 89
  },
  {
    id: "polaroid-tote",
    name: "POLAROID TOTE BAG",
    description: "Old vintage type Polaroid design. Add size and approval on WhatsApp after placing orders.",
    price: 499,
    originalPrice: 599,
    image: "/images/product/W13.png",
    gallery: [
      "/images/product/W13.png",
      "/images/product/W14.png",
      "/images/product/W15.png",
      "/images/product/W16.png",
    ],
    isCustomizable: true,
    category: "New",
    rating: 5.0,
    reviews: 34
  },
  {
    id: "any-design-tote",
    name: "ANY DESIGN TOTE BAG",
    description: "Customer can customise any ready to print design. Add size and approval on WhatsApp after placing orders.",
    price: 499,
    originalPrice: 599,
    image: "/images/product/W17.png",
    gallery: [
      "/images/product/W17.png",
      "/images/product/W18.png",
      "/images/product/W19.png",
      "/images/product/W20.png",
    ],
    isCustomizable: true,
    category: "New",
    rating: 4.9,
    reviews: 76
  }
];
