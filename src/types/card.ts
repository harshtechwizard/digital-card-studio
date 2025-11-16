export interface CardFieldSelection {
  // Personal fields
  fullName: boolean;
  primaryEmail: boolean;
  mobileNumber: boolean;
  homeAddress: boolean;
  bio: boolean;
  
  // Professional fields
  professionalEntries: string[]; // IDs of selected professional entries
  
  // Social fields
  linkedinUrl: boolean;
  twitterUrl: boolean;
  personalWebsite: boolean;
}

export interface Card {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
  fieldSelection: CardFieldSelection;
  createdAt: string;
  updatedAt: string;
}

export const defaultFieldSelection: CardFieldSelection = {
  fullName: true,
  primaryEmail: true,
  mobileNumber: false,
  homeAddress: false,
  bio: false,
  professionalEntries: [],
  linkedinUrl: false,
  twitterUrl: false,
  personalWebsite: false,
};
