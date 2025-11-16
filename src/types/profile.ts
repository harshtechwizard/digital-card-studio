export interface ProfessionalEntry {
  id: string;
  jobTitle: string;
  companyName: string;
  companyWebsite: string;
  officeEmail: string;
}

export interface Profile {
  // Personal
  fullName: string;
  primaryEmail: string;
  mobileNumber: string;
  homeAddress: string;
  bio: string;
  
  // Professional
  professionalEntries: ProfessionalEntry[];
  
  // Links & Socials
  linkedinUrl: string;
  twitterUrl: string;
  personalWebsite: string;
}

export const defaultProfile: Profile = {
  fullName: '',
  primaryEmail: '',
  mobileNumber: '',
  homeAddress: '',
  bio: '',
  professionalEntries: [],
  linkedinUrl: '',
  twitterUrl: '',
  personalWebsite: '',
};
