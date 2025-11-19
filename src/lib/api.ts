// Lightweight API helpers for the landing page sections

// Read once at module load; Vite injects these at build/dev time
// Use the official Vite typing for import.meta.env
const BASE_URL_RAW = (import.meta as ImportMeta).env
  ?.VITE_BASE_URL as string | undefined;
export const getBaseUrl = (): string | undefined => {
  if (!BASE_URL_RAW) return undefined;
  const trimmed = BASE_URL_RAW.trim();
  return trimmed ? trimmed : undefined;
};

async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function apiGet<T>(path: string): Promise<T> {
  // Prefer base URL from .env
  let base = getBaseUrl();
  // Fallback to same-origin if not set, or localhost:5000 only when dev
  if (!base) {
  const dev = (import.meta as ImportMeta).env?.DEV as boolean | undefined;
    base = dev ? "http://localhost:5000" : ""; // empty => relative
  }
  const normalizedBase = base.replace(/\/$/, "");
  const url = `${normalizedBase}${path}`;
  console.debug("apiGet -> fetching:", url);
  const res = await fetch(url, { mode: "cors" });
  return safeJson<T>(res);
}

// Types (minimal; aligned with backend)
export type HeaderBanner = {
  address: string;
  email: string;
  openingHours: string;
  mobileNumber: string;
};

export type HeroSection = {
  title1: string; // subTitle
  title2: string; // mainTitle
  backgroundImage: string; // hero image
};

export type HeroScrollItem = {
  image: string;
  title1: string;
  title2: string;
  order: number;
};

export type AboutSection = {
  leftImage: string;
  rightTitle1: string;
  rightTitle2: string;
  legendTitle: string;
  description: string;
};

export type HowWeWorkItem = {
  image: string;
  title: string;
  description: string;
  order: number;
};

export type GalleryItem = {
  image: string;
  title: string;
  order: number;
};

export type FaqItem = { question: string; answer: string; order: number };

export type EventItem = {
  image: string;
  title: string;
  mondayToThursday: { startTime: string; endTime: string };
  fridayToSaturday: { startTime: string; endTime: string };
  order: number;
};

export type ContactSection = {
  address: string;
  email: string;
  mobileNumber: string;
  openingHours: string;
};

export type FooterContact = { phone: string; email: string };

export type Testimonial = {
  name: string;
  role: string;
  text: string;
  image: string;
  quoteImage?: string;
  stars: number;
  order: number;
};

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  bgImage?: string;
  socials: { platform: string; url: string }[];
  order: number;
};

export type NavItem = { label: string; href: string; order: number };

export type FoodCategory = {
  title: string;
  itemCount: number;
  icon: string;
  category: string;
  slug: string;
  order: number;
};

export type LocationSection = {
  address: string;
  openingLine1: string;
  openingLine2?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
  };
  mapEmbedUrl: string;
};

// Endpoints
export const endpoints = {
  headerBanner: "/api/header-banner",
  heroSection: "/api/hero-section",
  heroScroll: "/api/hero-scroll-menu",
  aboutSection: "/api/about-section",
  howWeWork: "/api/how-we-work",
  gallery: "/api/gallery",
  faq: "/api/faq",
  events: "/api/events",
  contactSection: "/api/contact-section",
  footerContact: "/api/footer-contact",
  testimonials: "/api/testimonials",
  team: "/api/team",
  navbar: "/api/navbar",
  foodCategories: "/api/food-categories",
  locationSection: "/api/location-section",
  // Menu
  menu: "/api/menu",
};

// Helper for image onError fallback
export function onImgErrorFallback(fallbackSrc: string) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== fallbackSrc) img.src = fallbackSrc;
  };
}
