# Roadmap: Digital Business Card → Full-Fledged CRM

## Vision
Transform the current MVP into a comprehensive CRM system based on TM Forum Party Management standards, with dynamic card design and occupation-specific fields.

---

## Phase 1: Enhanced Profile Management (Week 1-2)

### 1.1 Add Education & Awards to Profile Page ✅ (Tables exist)

**Tasks:**
- [ ] Add Education section to Profile page
  - Institution name
  - Degree/Qualification
  - Field of study
  - Start date / End date
  - Grade/GPA
  - Description
- [ ] Add Awards section to Profile page
  - Award name
  - Issuing organization
  - Date received
  - Description
  - Certificate URL
- [ ] Update Profile page UI with new tabs
- [ ] Create hooks: `useEducation`, `useAwards`

**Database:** Already exists ✅
```sql
education (id, user_id, institution, degree, field_of_study, start_date, end_date, grade, description)
awards (id, user_id, award_name, issuing_organization, date_received, description, certificate_url)
```

### 1.2 Occupation Selection System

**Tasks:**
- [ ] Add `occupation_type` field to `personal_info` table
- [ ] Create occupation selection during signup/profile
- [ ] Define occupation categories:
  - Healthcare (Doctor, Nurse, Therapist)
  - Legal (Lawyer, Paralegal, Notary)
  - Real Estate (Agent, Broker, Property Manager)
  - Technology (Developer, Designer, Product Manager)
  - Finance (Accountant, Financial Advisor, Banker)
  - Creative (Artist, Photographer, Writer)
  - Sales & Marketing
  - Consulting
  - Education
  - Freelancer/Entrepreneur
  - Corporate/Business
  - Other

**Database Migration:**
```sql
ALTER TABLE personal_info ADD COLUMN occupation_type TEXT;
ALTER TABLE personal_info ADD COLUMN occupation_category TEXT;
```

### 1.3 Dynamic Professional Fields Based on Occupation

**Tasks:**
- [ ] Create occupation field mappings
- [ ] Build dynamic form generator
- [ ] Add occupation-specific fields to `professional_info`

**Example Fields by Occupation:**

**Healthcare:**
- Medical license number
- Specialization
- Hospital/Clinic affiliations
- Years of practice
- Board certifications

**Legal:**
- Bar association number
- Practice areas
- Court registrations
- Law firm
- Years of practice

**Real Estate:**
- Real estate license
- Agency/Brokerage
- Service areas
- Property types
- Years in business

**Technology:**
- Tech stack/Skills
- GitHub/Portfolio URL
- Years of experience
- Certifications

**Database Schema:**
```sql
ALTER TABLE professional_info ADD COLUMN occupation_specific_fields JSONB;
-- Stores flexible key-value pairs based on occupation
```

---

## Phase 2: Dynamic Card Designer (Week 3-4)

### 2.1 Card Theme System

**Tasks:**
- [ ] Create `card_themes` table
- [ ] Build theme presets (10+ templates)
- [ ] Add theme selector to Card Creator
- [ ] Implement theme preview

**Themes to Create:**
1. **Minimal** - Clean, simple, white background
2. **Corporate** - Professional blue/gray tones
3. **Creative** - Colorful gradients
4. **Dark Mode** - Black/dark gray
5. **Elegant** - Serif fonts, gold accents
6. **Modern** - Bold typography, geometric shapes
7. **Nature** - Green tones, organic shapes
8. **Tech** - Neon accents, futuristic
9. **Medical** - Clean white/blue, professional
10. **Legal** - Traditional, serif fonts, navy

**Database Schema:**
```sql
CREATE TABLE card_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  preview_image_url TEXT,
  config JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Theme config structure:
{
  "colors": {
    "primary": "#3B82F6",
    "secondary": "#10B981",
    "background": "#FFFFFF",
    "text": "#1F2937",
    "accent": "#F59E0B"
  },
  "typography": {
    "fontFamily": "Inter",
    "headingFont": "Poppins",
    "fontSize": "base"
  },
  "layout": {
    "style": "centered", // centered, left-aligned, split
    "cardShape": "rounded", // rounded, sharp, pill
    "spacing": "comfortable" // compact, comfortable, spacious
  },
  "effects": {
    "shadow": "medium",
    "gradient": true,
    "animation": "subtle"
  }
}
```

### 2.2 Visual Card Designer

**Tasks:**
- [ ] Build color picker component
- [ ] Add font selector
- [ ] Create layout options
- [ ] Add background pattern/gradient selector
- [ ] Implement real-time preview
- [ ] Save custom themes

**UI Components:**
- Color palette selector
- Font dropdown (Google Fonts integration)
- Layout grid selector
- Background options (solid, gradient, pattern, image)
- Border radius slider
- Shadow intensity slider
- Animation toggle

**Update `business_cards` table:**
```sql
ALTER TABLE business_cards ADD COLUMN theme_id UUID REFERENCES card_themes(id);
ALTER TABLE business_cards ADD COLUMN custom_theme_config JSONB;
-- custom_theme_config overrides theme_id if user customizes
```

### 2.3 Card Layout Options

**Layouts to Support:**
1. **Centered** - Name/photo centered, info below
2. **Left-Aligned** - Photo left, info right
3. **Split** - Photo/info side-by-side
4. **Minimal** - Text only, no photo
5. **Showcase** - Large photo background, text overlay
6. **Grid** - Info in grid layout
7. **Timeline** - Vertical timeline style

---

## Phase 3: TM Forum Party Management Integration (Week 5-6)

### 3.1 Understanding TM Forum Party Management

**Core Concepts:**
- **Party**: Abstract entity (can be Individual or Organization)
- **Individual**: Person with characteristics
- **Organization**: Company/entity with structure
- **Party Role**: Role a party plays (Customer, Supplier, Employee, etc.)
- **Contact Medium**: Ways to contact (email, phone, address)
- **Party Characteristic**: Additional attributes
- **Party Relationship**: Relationships between parties

### 3.2 Database Schema for TM Forum Compliance

**New Tables:**

```sql
-- Party (base entity)
CREATE TABLE parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_type TEXT NOT NULL CHECK (party_type IN ('individual', 'organization')),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual (extends Party)
CREATE TABLE individuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  given_name TEXT,
  family_name TEXT,
  middle_name TEXT,
  title TEXT, -- Mr, Mrs, Dr, etc.
  gender TEXT,
  birth_date DATE,
  nationality TEXT,
  marital_status TEXT,
  preferred_language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organization (extends Party)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  trading_name TEXT NOT NULL,
  legal_name TEXT,
  organization_type TEXT, -- Corporation, LLC, Partnership, etc.
  industry TEXT,
  tax_id TEXT,
  registration_number TEXT,
  website TEXT,
  employee_count INTEGER,
  annual_revenue DECIMAL,
  founded_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Medium (TM Forum standard)
CREATE TABLE contact_mediums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  medium_type TEXT NOT NULL, -- email, phone, mobile, fax, address, social
  preferred BOOLEAN DEFAULT false,
  characteristic JSONB NOT NULL,
  -- For email: {"emailAddress": "john@example.com"}
  -- For phone: {"phoneNumber": "+1234567890", "type": "mobile"}
  -- For address: {"street": "123 Main St", "city": "NYC", "country": "USA"}
  -- For social: {"platform": "linkedin", "handle": "@johndoe"}
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Party Role (TM Forum standard)
CREATE TABLE party_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  role_type TEXT NOT NULL, -- customer, supplier, employee, partner, etc.
  status TEXT DEFAULT 'active',
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Party Characteristic (flexible attributes)
CREATE TABLE party_characteristics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  value_type TEXT, -- string, number, boolean, date
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Party Relationship (TM Forum standard)
CREATE TABLE party_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  to_party_id UUID REFERENCES parties(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- employee_of, partner_with, subsidiary_of, etc.
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.3 Migration Strategy

**Approach:**
1. Keep existing tables for backward compatibility
2. Create new TM Forum tables
3. Build data sync layer
4. Gradually migrate features to new schema

**Data Mapping:**
- `personal_info` → `individuals` + `contact_mediums`
- `professional_info` → `organizations` + `party_relationships`
- User's company → `organizations` table
- User works at company → `party_relationships` (employee_of)

---

## Phase 4: CRM Features (Week 7-8)

### 4.1 Contact Management

**Tasks:**
- [ ] Create contacts table (other people's info)
- [ ] Import contacts (CSV, vCard)
- [ ] Contact groups/circles
- [ ] Contact tags
- [ ] Search & filter
- [ ] Contact notes
- [ ] Interaction history

**Database Schema:**
```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  party_id UUID REFERENCES parties(id), -- Link to TM Forum party
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  job_title TEXT,
  email TEXT,
  phone TEXT,
  notes TEXT,
  source TEXT, -- manual, nfc, qr, import
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_circles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_circle_members (
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  circle_id UUID REFERENCES contact_circles(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, circle_id)
);

CREATE TABLE contact_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE contact_tag_assignments (
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES contact_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (contact_id, tag_id)
);

CREATE TABLE contact_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT, -- call, email, meeting, note
  subject TEXT,
  notes TEXT,
  interaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Task Management

**Tasks:**
- [ ] Create tasks for contacts
- [ ] Task reminders
- [ ] Task priorities
- [ ] Due dates
- [ ] Task status tracking

**Database Schema:**
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  reminder_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Analytics & Insights

**Features:**
- Card view analytics (already tracking)
- Contact engagement tracking
- Interaction frequency
- Lead scoring
- Conversion tracking

---

## Phase 5: Advanced Features (Week 9-12)

### 5.1 NFC Integration (Mobile App)
- React Native app
- NFC tag writing
- NFC tag reading
- Offline mode

### 5.2 Team Collaboration
- Team accounts
- Shared contacts
- Role-based access
- Team analytics

### 5.3 Integrations
- Google Contacts sync
- Outlook sync
- Zapier integration
- API for third-party apps

### 5.4 Premium Features
- Custom domains (card.yourcompany.com)
- White-label solution
- Advanced analytics
- Bulk operations
- Export/import tools

---

## Implementation Priority

### Immediate (Next 2 Weeks)
1. ✅ Add Education & Awards to Profile page
2. ✅ Add Occupation selection
3. ✅ Create dynamic professional fields
4. ✅ Build basic card theme system (5 themes)

### Short-term (Weeks 3-4)
1. ✅ Visual card designer
2. ✅ Custom color/font selection
3. ✅ Layout options

### Medium-term (Weeks 5-8)
1. ✅ TM Forum Party Management schema
2. ✅ Contact management
3. ✅ Task management
4. ✅ Basic CRM features

### Long-term (Weeks 9-12)
1. ✅ Mobile app
2. ✅ Advanced CRM features
3. ✅ Integrations
4. ✅ Team features

---

## Technical Considerations

### Database
- Use JSONB for flexible fields
- Maintain backward compatibility
- Create views for complex queries
- Index frequently queried fields

### Frontend
- Component library for dynamic forms
- Theme system with CSS variables
- State management (Zustand/Redux)
- Form validation (Zod)

### Performance
- Lazy loading for large datasets
- Pagination for contacts
- Caching with React Query
- Optimistic updates

### Security
- RLS policies for all new tables
- API rate limiting
- Input sanitization
- File upload validation

---

## Next Steps

**What would you like to start with?**

1. **Education & Awards** - Add to profile page (quickest)
2. **Occupation System** - Dynamic fields based on profession
3. **Card Designer** - Visual theme customization
4. **TM Forum Schema** - Database restructuring
5. **Contact Management** - Basic CRM features

Let me know which feature you want to tackle first, and I'll help you implement it!
