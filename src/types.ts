export interface Record {
  id: number;
  title: string;
  category: string;
  status: string;
  priority: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface CommunityPost {
  id: number;
  title: string;
  content: string;
  author: string;
  imageUrl?: string;
  createdAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  dateFormat: string;
  itemsPerPage: number;
  autoBackup: boolean;
}
