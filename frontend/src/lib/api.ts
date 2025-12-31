// API client for communicating with Django backend

import axios from "axios";
import type {
  PersonalInfo,
  SocialLink,
  SkillCategory,
  Skill,
  Project,
  Education,
  Certification,
  CV,
  ContactMessage,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Personal Info
export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const response = await api.get("/personal-info/");
  return response.data;
};

// Social Links
export const getSocialLinks = async (): Promise<SocialLink[]> => {
  const response = await api.get("/social-links/");
  return response.data;
};

// Skills
export const getSkillCategories = async (): Promise<SkillCategory[]> => {
  const response = await api.get("/skill-categories/");
  return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await api.get("/skills/");
  return response.data;
};

export const getFeaturedSkills = async (): Promise<Skill[]> => {
  const response = await api.get("/skills/featured/");
  return response.data;
};

// Projects
export const getProjects = async (featured?: boolean): Promise<Project[]> => {
  const params = featured ? { featured: "true" } : {};
  const response = await api.get("/projects/", { params });
  return response.data;
};

export const getProject = async (slug: string): Promise<Project> => {
  const response = await api.get(`/projects/${slug}/`);
  return response.data;
};

// Education
export const getEducation = async (): Promise<Education[]> => {
  const response = await api.get("/education/");
  return response.data;
};

// Certifications
export const getCertifications = async (): Promise<Certification[]> => {
  const response = await api.get("/certifications/");
  return response.data;
};

// CV
export const getCV = async (): Promise<CV | null> => {
  try {
    const response = await api.get("/cv/");
    return response.data;
  } catch {
    return null;
  }
};

// Contact
export const submitContactMessage = async (
  message: ContactMessage
): Promise<{ message: string; data: ContactMessage }> => {
  const response = await api.post("/contact/", message);
  return response.data;
};

export default api;
