import { LucideIcon } from 'lucide-react';

export type ProjectType = {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  category: string;
  filterType: string;
  status: string;
  rating: number;
  users: string;
  tags?: string[];
  features: string[];
  highlights: string[];
  demoImages: string[];
  demoVideos?: string[];
  demoUrl: string;
  icon: LucideIcon;
  gradient: string;
  accentColor: string;
  contact?: {
    email: string;
    website: string;
    supportLink: string;
  };
  purpose?: string[];
};
