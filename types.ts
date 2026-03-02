import React from 'react';

export interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  image: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export type FolderTheme = 'green' | 'red' | 'blue' | 'orange' | 'purple' | 'gray' | 'pink' | 'cyan' | 'amber' | 'lime' | 'emerald' | 'teal' | 'rose' | 'yellow' | 'sky' | 'indigo';

export interface FolderItem {
  id: number;
  name: string;
  url: string;
  theme: FolderTheme;
  // Propriedades computadas visualmente baseadas no tema
  color?: string;
  bg?: string;
  border?: string;
}

export interface AccessLog {
  user: string;
  folder: string;
  timestamp: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
  thumbnailLink?: string;
  size?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção real, isso seria um hash
  role: 'admin' | 'user';
  createdAt: string;
}