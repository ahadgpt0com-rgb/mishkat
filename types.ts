export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  guestsCount: number;
  message: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  icon: 'ring' | 'music' | 'camera' | 'utensils';
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'pre-wedding' | 'ceremony' | 'moments';
}

export interface WebsiteConfig {
  hero: {
    groomName: string;
    brideName: string;
    date: string;
    location: string;
    image: string;
  };
  countdownDate: string;
  stories: {
    year: string;
    title: string;
    description: string;
    image: string;
  }[];
  events: EventItem[];
  gallery: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
    mapUrl: string;
    latitude?: string;
    longitude?: string;
  };
}