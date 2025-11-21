# Occupation-Based Dynamic Field System

## Overview

Users select their occupation during signup/profile creation, and the system shows relevant fields based on their profession.

---

## Occupation Categories & Fields

### 1. Healthcare Professionals

**Occupations:**
- Doctor/Physician
- Surgeon
- Dentist
- Nurse
- Therapist (Physical, Occupational, Speech)
- Pharmacist
- Psychologist/Psychiatrist
- Veterinarian
- Medical Technician

**Specific Fields:**
```javascript
{
  // Required
  medicalLicenseNumber: "string",
  specialization: "string", // Cardiology, Pediatrics, etc.
  
  // Optional
  hospitalAffiliations: "array", // Multiple hospitals
  clinicName: "string",
  yearsOfPractice: "number",
  boardCertifications: "array",
  npiNumber: "string", // National Provider Identifier
  deaNumber: "string", // Drug Enforcement Administration
  medicalSchool: "string",
  residencyProgram: "string",
  fellowships: "array",
  languagesSpoken: "array",
  insuranceAccepted: "array",
  telemedicineAvailable: "boolean",
  emergencyContact: "string"
}
```

---

### 2. Legal Professionals

**Occupations:**
- Lawyer/Attorney
- Paralegal
- Legal Consultant
- Notary Public
- Judge
- Legal Advisor

**Specific Fields:**
```javascript
{
  // Required
  barAssociationNumber: "string",
  practiceAreas: "array", // Criminal, Corporate, Family, etc.
  
  // Optional
  lawFirm: "string",
  courtRegistrations: "array", // Supreme Court, District Court, etc.
  yearsOfPractice: "number",
  lawSchool: "string",
  stateBarNumbers: "array", // Multiple states
  specializations: "array",
  languagesSpoken: "array",
  consultationFee: "number",
  freeConsultation: "boolean",
  casesWon: "number",
  notaryPublic: "boolean",
  arbitrationCertified: "boolean"
}
```

---

### 3. Real Estate Professionals

**Occupations:**
- Real Estate Agent
- Real Estate Broker
- Property Manager
- Real Estate Appraiser
- Real Estate Developer

**Specific Fields:**
```javascript
{
  // Required
  realEstateLicense: "string",
  agencyBrokerage: "string",
  
  // Optional
  serviceAreas: "array", // Cities/neighborhoods
  propertyTypes: "array", // Residential, Commercial, Industrial
  yearsInBusiness: "number",
  mlsNumber: "string", // Multiple Listing Service
  specializations: "array", // Luxury, First-time buyers, etc.
  languagesSpoken: "array",
  propertiesSold: "number",
  averageSalePrice: "number",
  certifications: "array", // CRS, GRI, etc.
  teamSize: "number",
  availableForShowings: "boolean"
}
```

---

### 4. Technology Professionals

**Occupations:**
- Software Developer
- Web Developer
- Mobile App Developer
- UI/UX Designer
- Product Manager
- DevOps Engineer
- Data Scientist
- QA Engineer
- System Administrator

**Specific Fields:**
```javascript
{
  // Required
  techStack: "array", // JavaScript, Python, React, etc.
  
  // Optional
  githubUrl: "string",
  portfolioUrl: "string",
  linkedinUrl: "string",
  stackOverflowProfile: "string",
  yearsOfExperience: "number",
  certifications: "array", // AWS, Azure, Google Cloud, etc.
  openToRemote: "boolean",
  hourlyRate: "number",
  availability: "string", // Full-time, Part-time, Contract
  preferredProjectTypes: "array",
  teamSize: "number",
  notableProjects: "array",
  contributionsToOpenSource: "boolean"
}
```

---

### 5. Finance Professionals

**Occupations:**
- Accountant
- Financial Advisor
- Investment Banker
- Tax Consultant
- Auditor
- Financial Planner
- Insurance Agent

**Specific Fields:**
```javascript
{
  // Required
  licenseNumber: "string", // CPA, CFP, etc.
  specialization: "string",
  
  // Optional
  firmName: "string",
  yearsOfExperience: "number",
  certifications: "array", // CPA, CFP, CFA, etc.
  servicesOffered: "array", // Tax prep, Investment, etc.
  clientTypes: "array", // Individual, Business, Corporate
  languagesSpoken: "array",
  freeConsultation: "boolean",
  consultationFee: "number",
  assetsUnderManagement: "number",
  regulatoryLicenses: "array", // SEC, FINRA, etc.
  insuranceTypes: "array" // Life, Health, Property, etc.
}
```

---

### 6. Creative Professionals

**Occupations:**
- Graphic Designer
- Photographer
- Videographer
- Artist
- Writer/Author
- Content Creator
- Animator
- Illustrator

**Specific Fields:**
```javascript
{
  // Required
  portfolioUrl: "string",
  specialties: "array",
  
  // Optional
  behanceUrl: "string",
  dribbbleUrl: "string",
  instagramUrl: "string",
  youtubeUrl: "string",
  vimeoUrl: "string",
  yearsOfExperience: "number",
  softwareProficiency: "array", // Photoshop, Illustrator, etc.
  stylePreferences: "array",
  clientTypes: "array", // Corporate, Individual, Agency
  projectTypes: "array", // Branding, Editorial, Commercial
  awardsWon: "array",
  exhibitions: "array",
  publications: "array",
  hourlyRate: "number",
  projectMinimum: "number",
  availableForHire: "boolean"
}
```

---

### 7. Sales & Marketing Professionals

**Occupations:**
- Sales Representative
- Marketing Manager
- Digital Marketer
- Brand Manager
- Business Development Manager
- Account Executive

**Specific Fields:**
```javascript
{
  // Required
  industryFocus: "array",
  
  // Optional
  yearsOfExperience: "number",
  certifications: "array", // Google Ads, HubSpot, etc.
  specializations: "array", // SEO, PPC, Social Media, etc.
  toolsProficiency: "array", // Salesforce, HubSpot, etc.
  languagesSpoken: "array",
  territoryRegion: "string",
  quotaAchievement: "number", // Percentage
  clientTypes: "array", // B2B, B2C, Enterprise
  averageDealSize: "number",
  salesMethodology: "array", // SPIN, Challenger, etc.
  marketingChannels: "array" // Email, Social, Content, etc.
}
```

---

### 8. Consulting Professionals

**Occupations:**
- Management Consultant
- Business Consultant
- IT Consultant
- HR Consultant
- Strategy Consultant

**Specific Fields:**
```javascript
{
  // Required
  consultingAreas: "array",
  
  // Optional
  firmName: "string",
  yearsOfExperience: "number",
  certifications: "array", // PMP, Six Sigma, etc.
  clientIndustries: "array",
  projectTypes: "array",
  languagesSpoken: "array",
  hourlyRate: "number",
  projectMinimum: "number",
  availabilityType: "string", // Full-time, Part-time, Project-based
  notableClients: "array",
  caseStudies: "array",
  methodologies: "array", // Agile, Lean, etc.
  teamSize: "number"
}
```

---

### 9. Education Professionals

**Occupations:**
- Teacher
- Professor
- Tutor
- Education Consultant
- School Administrator
- Curriculum Developer

**Specific Fields:**
```javascript
{
  // Required
  teachingLicense: "string",
  subjectsTaught: "array",
  
  // Optional
  institution: "string",
  gradeLevel: "array", // Elementary, Middle, High School, College
  yearsOfExperience: "number",
  degrees: "array",
  certifications: "array",
  specializations: "array",
  languagesSpoken: "array",
  tutoringAvailable: "boolean",
  hourlyRate: "number",
  onlineTeaching: "boolean",
  publicationsResearch: "array",
  awardsRecognition: "array"
}
```

---

### 10. Freelancer/Entrepreneur

**Occupations:**
- Freelancer
- Entrepreneur
- Startup Founder
- Solopreneur
- Independent Contractor

**Specific Fields:**
```javascript
{
  // Required
  skills: "array",
  servicesOffered: "array",
  
  // Optional
  portfolioUrl: "string",
  yearsInBusiness: "number",
  hourlyRate: "number",
  projectMinimum: "number",
  availability: "string", // Full-time, Part-time, Project-based
  industryExperience: "array",
  clientTypes: "array",
  notableClients: "array",
  certifications: "array",
  toolsProficiency: "array",
  languagesSpoken: "array",
  remoteWork: "boolean",
  travelAvailable: "boolean",
  teamSize: "number"
}
```

---

### 11. Corporate/Business

**Occupations:**
- Manager
- Director
- Executive
- Operations Manager
- Project Manager
- HR Manager

**Specific Fields:**
```javascript
{
  // Required
  department: "string",
  
  // Optional
  employeeId: "string",
  reportingManager: "string",
  teamSize: "number",
  yearsWithCompany: "number",
  yearsInRole: "number",
  certifications: "array", // PMP, MBA, etc.
  responsibilities: "array",
  achievements: "array",
  languagesSpoken: "array",
  officeLocation: "string",
  remoteWork: "boolean",
  directReports: "number"
}
```

---

## Implementation Strategy

### 1. Database Schema

**Option A: JSONB Column (Flexible)**
```sql
ALTER TABLE professional_info 
ADD COLUMN occupation_specific_fields JSONB;

-- Example data:
{
  "medicalLicenseNumber": "MD123456",
  "specialization": "Cardiology",
  "hospitalAffiliations": ["City Hospital", "General Medical Center"],
  "yearsOfPractice": 15
}
```

**Option B: Separate Tables (Structured)**
```sql
CREATE TABLE healthcare_professional_info (
  id UUID PRIMARY KEY,
  professional_info_id UUID REFERENCES professional_info(id),
  medical_license_number TEXT,
  specialization TEXT,
  hospital_affiliations TEXT[],
  years_of_practice INTEGER
);

CREATE TABLE legal_professional_info (
  id UUID PRIMARY KEY,
  professional_info_id UUID REFERENCES professional_info(id),
  bar_association_number TEXT,
  practice_areas TEXT[],
  law_firm TEXT,
  years_of_practice INTEGER
);

-- ... one table per occupation type
```

**Recommendation:** Use JSONB for flexibility and easier maintenance.

---

### 2. Frontend Implementation

**Occupation Selector Component:**
```typescript
// OccupationSelector.tsx
const occupationCategories = [
  {
    category: "Healthcare",
    occupations: [
      "Doctor/Physician",
      "Surgeon",
      "Dentist",
      "Nurse",
      "Therapist",
      "Pharmacist"
    ]
  },
  {
    category: "Legal",
    occupations: [
      "Lawyer/Attorney",
      "Paralegal",
      "Legal Consultant",
      "Notary Public"
    ]
  },
  // ... more categories
];
```

**Dynamic Form Generator:**
```typescript
// DynamicProfessionalForm.tsx
const getFieldsForOccupation = (occupation: string) => {
  const fieldMappings = {
    "Doctor/Physician": [
      { name: "medicalLicenseNumber", type: "text", required: true },
      { name: "specialization", type: "text", required: true },
      { name: "hospitalAffiliations", type: "array", required: false },
      { name: "yearsOfPractice", type: "number", required: false }
    ],
    "Lawyer/Attorney": [
      { name: "barAssociationNumber", type: "text", required: true },
      { name: "practiceAreas", type: "multiselect", required: true },
      { name: "lawFirm", type: "text", required: false }
    ],
    // ... more mappings
  };
  
  return fieldMappings[occupation] || [];
};
```

---

### 3. User Flow

**Step 1: Signup/Profile Creation**
```
1. User signs up
2. Redirected to profile setup
3. Select occupation category
4. Select specific occupation
5. Form dynamically shows relevant fields
6. User fills in occupation-specific info
7. Save profile
```

**Step 2: Card Creation**
```
1. User creates business card
2. Select which occupation-specific fields to show
3. Preview card with occupation info
4. Save card
```

---

### 4. Validation Rules

**Per Occupation:**
```typescript
const validationRules = {
  "Doctor/Physician": {
    medicalLicenseNumber: {
      required: true,
      pattern: /^[A-Z]{2}\d{6}$/,
      message: "Invalid license format"
    },
    specialization: {
      required: true,
      minLength: 2
    }
  },
  "Lawyer/Attorney": {
    barAssociationNumber: {
      required: true,
      pattern: /^\d{6,8}$/
    }
  }
};
```

---

## Benefits of This System

1. **Relevant Fields** - Users only see fields relevant to their profession
2. **Professional Appearance** - Cards look industry-appropriate
3. **Better Networking** - People can quickly understand your expertise
4. **Flexible** - Easy to add new occupations
5. **Scalable** - JSONB allows unlimited custom fields
6. **User-Friendly** - No overwhelming forms with irrelevant fields

---

## Next Steps

1. **Add occupation selection to Profile page**
2. **Create field mappings for each occupation**
3. **Build dynamic form generator**
4. **Update Card Creator to show occupation fields**
5. **Update Public Card to display occupation info**

**Ready to implement? Let's start!**
