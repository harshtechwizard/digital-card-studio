export interface BusinessCard {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  bio: string;
  avatar?: string;
  theme: 'light' | 'dark' | 'gradient';
  createdAt: string;
  updatedAt: string;
}

export const defaultCard: Omit<BusinessCard, 'id' | 'createdAt' | 'updatedAt'> = {
  name: '',
  title: '',
  company: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  bio: '',
  theme: 'light',
};
