
import { Guest, ContactMessage, WebsiteConfig } from '../types';

// Base URL for API calls
const API_URL = '/api';

// Helper for tokens
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token || ''
  };
};

// Default Configuration (Fallback)
const DEFAULT_CONFIG: WebsiteConfig = {
  hero: {
    groomName: 'রাজ',
    brideName: 'সিমরান',
    date: '১৫ই ডিসেম্বর, ২০২৪',
    location: 'ঢাকা, বাংলাদেশ',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
  },
  countdownDate: '2024-12-15T18:00:00',
  stories: [
    {
      year: '২০২০',
      title: 'প্রথম দেখা',
      description: 'বিশ্ববিদ্যালয়ের ক্যাম্পাসে এক বসন্তের বিকেলে আমাদের প্রথম দেখা হয়।',
      image: 'https://images.unsplash.com/photo-1522673607200-1645062cd955?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
  ],
  events: [
    {
      id: 1,
      title: 'শুভ বিবাহ',
      date: '১৫ ডিসেম্বর, ২০২৪',
      time: 'সন্ধ্যা ৭:০০ টা',
      location: 'ইন্টারন্যাশনাল কনভেনশন সিটি বসুন্ধরা (ICCB)',
      description: 'আমাদের জীবনের নতুন অধ্যায় শুরুর মুহূর্তে আপনাদের দোয়া ও ভালোবাসা চাই।',
      icon: 'camera'
    }
  ],
  gallery: [
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
  ],
  contact: {
    phone: '+৮৮০ ১৭১১ ১২৩৪৫৬',
    email: 'contact@wedding.com',
    address: 'বসুন্ধরা কনভেনশন সিটি, ঢাকা',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.0980920365736!2d90.42337721543228!3d23.81511089221992!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c64c103a8093%3A0xd660a4f50365294a!2sInternational%20Convention%20City%20Bashundhara%20(ICCB)!5e0!3m2!1sen!2sbd!4v1645000000000!5m2!1sen!2sbd',
    latitude: '23.8151',
    longitude: '90.4233'
  }
};

export const saveRSVP = async (guest: Omit<Guest, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/public/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(guest)
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving RSVP", error);
    return false;
  }
};

export const getRSVPs = async (): Promise<Guest[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/rsvps`, {
      headers: getAuthHeaders()
    });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.error("Error fetching RSVPs", error);
    return [];
  }
};

export const saveMessage = async (msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/public/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving message", error);
    return false;
  }
};

export const getMessages = async (): Promise<ContactMessage[]> => {
  try {
    const response = await fetch(`${API_URL}/admin/messages`, {
      headers: getAuthHeaders()
    });
    if (response.ok) return await response.json();
    return [];
  } catch (error) {
    console.error("Error fetching messages", error);
    return [];
  }
};

export const getWebsiteConfig = async (): Promise<WebsiteConfig> => {
  try {
    const response = await fetch(`${API_URL}/public/config`);
    if (response.ok) {
      const data = await response.json();
      if (data) return data;
    }
  } catch (error) {
    console.error("Error fetching config from server, using default.", error);
  }
  return DEFAULT_CONFIG;
};

export const saveWebsiteConfig = async (config: WebsiteConfig): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/admin/config`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(config)
    });
    return response.ok;
  } catch (error) {
    console.error("Error saving config", error);
    return false;
  }
};

// Admin auth check (Offline fallback only)
export const checkAdminAuth = (id: string, password: string): boolean => {
  return id === 'admin' && password === 'admin123';
};
