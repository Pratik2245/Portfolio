import type { ObjectId } from "mongodb";

export interface Project {
  _id?: ObjectId;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  technologies: string[];
  category: string;
  github: string;
  live: string;
  featured: boolean;
  duration: string;
  team: string;
  challenges: string[];
  features: string[];
  results: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  _id?: ObjectId;
  category: string;
  icon: string;
  skills: {
    name: string;
    level: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Certificate {
  _id?: ObjectId;
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  image: string;
  description: string;
  skills: string[];
  verified: boolean;
  link: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: "admin" | "editor";
  createdAt: Date;
  lastLogin?: Date;
}
