# Mini CRM & Contact Management System

> A personal CRM with digital business cards, NFC integration, and comprehensive contact management.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)

---

## 📋 Overview

A comprehensive personal CRM system that enables users to:
- Manage their own contact information and create customizable digital business cards
- Share business cards via NFC tags, QR codes, or direct links
- Store and organize contacts using circles (groups) and tags
- Track interactions with notes and tasks
- Import contacts via NFC scanning

**Perfect for:** Sales professionals, freelancers, consultants, networkers, and small business owners.

---

## ✨ Key Features

### 🎴 Digital Business Cards
- Create unlimited customizable digital business cards
- Multiple templates (Personal, Professional, Custom)
- Real-time preview and design customization
- Shareable via unique URLs and QR codes
- View analytics (page views, engagement tracking)

### 📱 NFC Integration
- **Write** your business card to NFC tags (mobile)
- **Read** NFC tags to instantly import contacts (mobile)
- Universal NFC compatibility (iOS 14+, Android 8.0+)

### 👥 Contact Management
- Store unlimited contacts with rich information
- Organize contacts into **Circles** (groups like "Personal", "Professional")
- Tag contacts for flexible categorization
- Advanced search and filtering
- Import contacts via NFC, vCard, or CSV

### 📝 Interaction Tracking
- **Notes**: Add rich text notes to any contact
- **Tasks**: Create tasks with reminders, due dates, and priorities
- File attachments support (PDF, images, documents)
- Task dashboard with overdue alerts

### 🔐 Security & Privacy
- Row-level security (RLS) for data isolation
- JWT-based authentication with OAuth support
- Encrypted file storage
- GDPR/CCPA compliant

---

## 🏗️ Architecture

### Tech Stack

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
├─────────────────────────────────────────────────┤
│  Web App: Next.js 14 (App Router)               │
│  - React 18 + TypeScript                        │
│  - Tailwind CSS                                 │
│  - React Query (data fetching)                  │
│  - Zustand (state management)                   │
├─────────────────────────────────────────────────┤
│  Mobile Apps: React Native (Expo)               │
│  - iOS & Android                                │
│  - react-native-nfc-manager                     │
│  - Offline support with SQLite                  │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│                   Backend                       │
├─────────────────────────────────────────────────┤
│  Supabase (Backend-as-a-Service)                │
│  - PostgreSQL 15+ Database                      │
│  - Authentication (Email, OAuth)                │
│  - Storage (S3-compatible + CDN)                │
│  - Edge Functions (Deno)                        │
│  - Real-time subscriptions                      │
│  - Auto-generated REST/GraphQL APIs             │
└─────────────────────────────────────────────────┘
```

### Database Schema (Simplified)

```
Users (Supabase Auth)
├── Personal Info (1:1)
├── Professional Info (1:N)
├── Education (1:N)
├── Awards (1:N)
├── Business Cards (1:N)
└── Contacts (1:N)
    ├── Contact_Circles (N:N)
    ├── Contact_Tags (N:N)
    ├── Notes (1:N)
    └── Tasks (1:N)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- For mobile development:
  - Expo CLI
  - iOS Simulator (Mac) or Android Studio

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Aeternik/CMS.git
cd CMS
```

2. **Set up Supabase**
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (or link to existing project)
npx supabase init
npx supabase start

# Run migrations
npx supabase db push
```

3. **Install dependencies**

```bash
# Web app
cd web
npm install

# Mobile app
cd ../mobile
npm install
```

4. **Configure environment variables**

Create `.env.local` files:

**Web (`web/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Mobile (`mobile/.env`):**
```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. **Run the applications**

```bash
# Web app (development)
cd web
npm run dev
# Visit http://localhost:3000

# Mobile app
cd mobile
npx expo start
# Scan QR code with Expo Go app
```

---

## 📁 Project Structure

```
mini-crm/
├── web/                       # Next.js web application
│   ├── app/                   # App router pages
│   │   ├── (auth)/           # Auth routes (login, signup)
│   │   ├── (dashboard)/      # Protected dashboard routes
│   │   └── card/[slug]/      # Public business card viewer
│   ├── components/           # React components
│   ├── lib/                  # Utilities and helpers
│   │   ├── supabase/        # Supabase client
│   │   └── hooks/           # Custom hooks
│   └── types/               # TypeScript types
│
├── mobile/                   # React Native mobile app
│   ├── src/
│   │   ├── screens/         # Screen components
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # Services (Supabase, NFC)
│   │   └── store/           # State management
│   └── app.json            # Expo configuration
│
├── supabase/                # Supabase configuration
│   ├── migrations/          # Database migrations
│   └── functions/           # Edge functions
│
└── docs/                    # Documentation
    ├── requirements.md      # Detailed requirements
    └── architecture.md      # Architecture documentation
```

---

## 🔧 Configuration

### Database Setup

Run the database migrations to create all necessary tables:

```bash
npx supabase db push
```

### Row Level Security (RLS)

RLS policies are automatically applied via migrations. Key policies:
- Users can only access their own data
- Business cards can be viewed publicly when active
- All other tables are user-scoped

### Storage Buckets

Create three storage buckets in Supabase:
1. **profiles** (5MB limit, images only)
2. **attachments** (10MB limit, multiple file types)
3. **cards** (5MB limit, images for card customization)

---

## 📱 Mobile Development

### NFC Testing

NFC functionality requires physical devices:
- **iOS**: iPhone 7+ with iOS 14+
- **Android**: Devices with NFC hardware, Android 8.0+

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure builds
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📊 Key Features Breakdown

### Personal Information Management
- Profile photo and bio
- Contact details (email, phone, address)
- Education qualifications
- Awards and certifications
- Products/services offered
- Photo gallery

### Business Card Templates
- **Personal-Small**: Name, Phone, Email
- **Personal-Detailed**: + Address, Bio
- **Professional-Small**: Name, Title, Company, Contact
- **Professional-Detailed**: + Company address, Website
- **Custom**: Choose any fields

### Contact Organization
- **Circles**: Group-based organization (e.g., "Work", "Family")
- **Tags**: Flexible labeling (e.g., "Lead", "VIP", "Follow-up")
- Many-to-many relationships (contacts can be in multiple circles/tags)

### Search & Filter
- Full-text search across names, companies, notes
- Filter by circles, tags, date added
- Sort by name, company, date
- Advanced boolean filters

---

## 🔐 Security Features

- JWT-based authentication with refresh tokens
- Row Level Security (RLS) on all tables
- Encrypted data at rest and in transit
- Rate limiting on API endpoints
- Input validation and sanitization
- File upload malware scanning
- Two-factor authentication ready
- Audit logging


---

**Made with ❤️ by aeternik (https://github.com/Aeternik)**
