import { Record, Category, CommunityPost } from '../types';

const isProduction = import.meta.env.PROD;

const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const setLocalStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const api = {
  async getRecords(): Promise<Record[]> {
    if (isProduction) {
      return getLocalStorage<Record[]>('chudau_records', []);
    }
    const res = await fetch('/api/records');
    return res.json();
  },

  async createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    if (isProduction) {
      const records = getLocalStorage<Record[]>('chudau_records', []);
      const newRecord: Record = {
        ...record,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLocalStorage('chudau_records', [newRecord, ...records]);
      return newRecord.id;
    }
    const res = await fetch('/api/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    const data = await res.json();
    return data.id;
  },

  async getCategories(): Promise<Category[]> {
    if (isProduction) {
      return [
        { id: 1, name: "Bình Tỳ Bà", icon: "pottery", color: "#28A745" },
        { id: 2, name: "Bình Thố", icon: "box", color: "#1E3A8A" },
        { id: 3, name: "Đĩa Cổ", icon: "disc", color: "#F59E0B" },
        { id: 4, name: "Lư Hương", icon: "flame", color: "#EF4444" },
      ];
    }
    const res = await fetch('/api/categories');
    return res.json();
  },

  async getCommunity(): Promise<CommunityPost[]> {
    if (isProduction) {
      return getLocalStorage<CommunityPost[]>('chudau_community', []);
    }
    const res = await fetch('/api/community');
    return res.json();
  },

  async createCommunityPost(post: Omit<CommunityPost, 'id' | 'createdAt'>): Promise<number> {
    if (isProduction) {
      const posts = getLocalStorage<CommunityPost[]>('chudau_community', []);
      const newPost: CommunityPost = {
        ...post,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      setLocalStorage('chudau_community', [newPost, ...posts]);
      return newPost.id;
    }
    const res = await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    return data.id;
  }
};
