export interface NavItem {
  label: string;
  href: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export interface SocialLinks {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface BankDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  swiftCode: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  values: string[];
  founded: string;
  contact: ContactInfo;
  socials: SocialLinks;
  bankDetails: BankDetails;
  mobileMoney: string;
  nav: NavItem[];
  primaryCta: NavItem;
  secondaryCta: NavItem;
  url: string;
}

export type ProjectCategory =
  | "Health"
  | "Education"
  | "Humanitarian Aid"
  | "Water & Sanitation";

export type ProjectStatus = "Active" | "Completed" | "Planned";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  location: string;
  date: string;
  summary: string;
  heroImage?: string;
  objective?: string;
  activities?: string[];
  outcomes?: string[];
  beneficiaries?: string;
  partners?: string[];
  gallery?: string[];
  relatedStorySlugs?: string[];
  body?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author?: string;
  role?: string;
  date: string;
  location?: string;
  category: string;
  heroImage?: string;
  relatedProjectSlugs?: string[];
  body: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  placeholder?: boolean;
}

export interface Partner {
  name: string;
  logo?: string;
  url?: string;
  description?: string;
  placeholder?: boolean;
}

export interface ImpactStat {
  value: string;
  label: string;
  note?: string;
}

export interface Report {
  title: string;
  date: string;
  type: string;
  url?: string;
  description?: string;
  placeholder?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AreaOfWork {
  id: string;
  title: string;
  summary: string;
  description: string;
  items: string[];
  icon: string;
  image?: string;
}
