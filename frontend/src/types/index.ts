// TypeScript types for the Portfolio API

export interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  about_text: string;
  resume_headline: string;
  profile_photo: string | null;
  profile_photo_url: string | null;
  favicon: string | null;
  favicon_url: string | null;
}

export interface SocialLink {
  id: number;
  platform: string;
  platform_display: string;
  url: string;
  icon: string;
  order: number;
}

export interface Skill {
  id: number;
  name: string;
  category: number;
  category_name: string;
  proficiency: number;
  icon: string;
  color: string;
  is_featured: boolean;
}

export interface SkillCategory {
  id: number;
  name: string;
  icon: string;
  order: number;
  skills: Skill[];
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  image: string | null;
  image_url: string | null;
  technologies: string;
  tech_list: string[];
  live_url: string;
  github_url: string;
  is_featured: boolean;
  created_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  logo: string | null;
  logo_url: string | null;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string;
  credential_url: string;
  image: string | null;
  image_url: string | null;
}

export interface CV {
  id: number;
  title: string;
  file: string;
  file_url: string;
  uploaded_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
