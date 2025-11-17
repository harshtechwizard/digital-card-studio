# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Login/     │  │   Profile    │  │   My Cards   │      │
│  │   Signup     │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Card      │  │   Public     │  │  Templates   │      │
│  │   Creator    │  │    Card      │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                      Auth Context                            │
│              (User State, Login, Logout)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  useProfile  │  │useBusinessCards│ │usePublicCard │      │
│  │    Hook      │  │     Hook      │  │    Hook      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                   Supabase Client                            │
│              (Database, Auth, Storage)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Backend                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                  Authentication                       │   │
│  │              (Email/Password, Sessions)              │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                PostgreSQL Database                    │   │
│  │                                                       │   │
│  │  ┌────────────────┐  ┌────────────────┐            │   │
│  │  │ personal_info  │  │professional_info│            │   │
│  │  └────────────────┘  └────────────────┘            │   │
│  │                                                       │   │
│  │  ┌────────────────┐  ┌────────────────┐            │   │
│  │  │business_cards  │  │ card_analytics │            │   │
│  │  └────────────────┘  └────────────────┘            │   │
│  │                                                       │   │
│  │  ┌────────────────┐  ┌────────────────┐            │   │
│  │  │   education    │  │     awards     │            │   │
│  │  └────────────────┘  └────────────────┘            │   │
│  │                                                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            Row Level Security (RLS)                   │   │
│  │         (Protects data at database level)            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User → Login Page → AuthContext → Supabase Auth
                                        ↓
                                   JWT Token
                                        ↓
                              Stored in Browser
                                        ↓
                            Used for all API calls
```

### 2. Profile Data Flow

```
Profile Page → useProfile Hook → Supabase Client
                                        ↓
                              Query with user_id
                                        ↓
                                   RLS Check
                                        ↓
                          personal_info + professional_info
                                        ↓
                              Return to Component
```

### 3. Business Card Creation Flow

```
Card Creator → useBusinessCards Hook → Generate Slug
                                              ↓
                                      Supabase Insert
                                              ↓
                                         RLS Check
                                              ↓
                                    business_cards table
                                              ↓
                                      Return new card
                                              ↓
                                   Navigate to My Cards
```

### 4. Public Card View Flow

```
Public URL → PublicCard Page → usePublicCard Hook
                                        ↓
                              Query by slug (no auth)
                                        ↓
                                   RLS allows read
                                        ↓
                          Fetch card + personal_info
                                        ↓
                              Track in analytics
                                        ↓
                                  Display card
```

## Database Schema Relationships

```
auth.users (Supabase managed)
    │
    ├─── personal_info (1:1)
    │       └── user_id → auth.users.id
    │
    ├─── professional_info (1:many)
    │       └── user_id → auth.users.id
    │
    ├─── education (1:many)
    │       └── user_id → auth.users.id
    │
    ├─── awards (1:many)
    │       └── user_id → auth.users.id
    │
    ├─── products_services (1:many)
    │       └── user_id → auth.users.id
    │
    ├─── photo_gallery (1:many)
    │       └── user_id → auth.users.id
    │
    └─── business_cards (1:many)
            └── user_id → auth.users.id
                    │
                    └─── card_analytics (1:many)
                            └── card_id → business_cards.id
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Frontend Protection              │
│    (ProtectedRoute Component)           │
│    - Redirects to login if no user      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         API Layer Protection             │
│      (Supabase Client with JWT)         │
│    - Sends auth token with requests     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Database Layer Protection           │
│     (Row Level Security Policies)       │
│    - Enforces access at DB level        │
│    - Users can only see their data      │
│    - Public cards readable by all       │
└─────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── AuthProvider
│   ├── Login (public)
│   ├── Signup (public)
│   ├── PublicCard (public)
│   │
│   └── ProtectedRoute
│       ├── AppNav (with user info)
│       │
│       ├── Index (Templates)
│       ├── Profile
│       │   ├── PersonalInfoForm
│       │   └── ProfessionalInfoForm
│       │
│       ├── MyCards
│       │   └── CardList
│       │       └── CardItem
│       │
│       └── CardCreator
│           ├── FieldSelector
│           ├── DesignCustomizer
│           └── CardPreview
```

## State Management

```
┌─────────────────────────────────────────┐
│          Global State                    │
│        (AuthContext)                     │
│   - user                                 │
│   - session                              │
│   - loading                              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Component State                  │
│         (React Hooks)                    │
│   - useProfile                           │
│   - useBusinessCards                     │
│   - usePublicCard                        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│         Server State                     │
│      (Supabase Database)                 │
│   - Persisted data                       │
│   - Real-time updates (optional)         │
└─────────────────────────────────────────┘
```

## API Endpoints (via Supabase)

All API calls go through Supabase client:

```
Authentication:
  POST   /auth/signup
  POST   /auth/signin
  POST   /auth/signout
  GET    /auth/session

Personal Info:
  GET    /rest/v1/personal_info?user_id=eq.{id}
  POST   /rest/v1/personal_info
  PATCH  /rest/v1/personal_info?id=eq.{id}

Professional Info:
  GET    /rest/v1/professional_info?user_id=eq.{id}
  POST   /rest/v1/professional_info
  PATCH  /rest/v1/professional_info?id=eq.{id}
  DELETE /rest/v1/professional_info?id=eq.{id}

Business Cards:
  GET    /rest/v1/business_cards?user_id=eq.{id}
  GET    /rest/v1/business_cards?slug=eq.{slug}&is_active=eq.true
  POST   /rest/v1/business_cards
  PATCH  /rest/v1/business_cards?id=eq.{id}
  DELETE /rest/v1/business_cards?id=eq.{id}

Analytics:
  POST   /rest/v1/card_analytics
  GET    /rest/v1/card_analytics?card_id=eq.{id}
```

## Environment Configuration

```
Development:
  .env
    ├── VITE_SUPABASE_URL
    └── VITE_SUPABASE_ANON_KEY

Production:
  Environment Variables (Vercel/Netlify)
    ├── VITE_SUPABASE_URL
    └── VITE_SUPABASE_ANON_KEY
```

## File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn components
│   ├── ProtectedRoute.tsx     # Auth wrapper
│   ├── NavLink.tsx
│   ├── BusinessCardForm.tsx
│   └── BusinessCardPreview.tsx
│
├── contexts/
│   └── AuthContext.tsx        # Global auth state
│
├── hooks/
│   ├── useProfile.ts          # Profile CRUD
│   ├── useBusinessCards.ts    # Cards CRUD
│   └── usePublicCard.ts       # Public card fetch
│
├── lib/
│   ├── supabase/
│   │   └── client.ts          # Supabase instance
│   ├── utils.ts               # Utilities
│   └── slugify.ts             # Slug generation
│
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Profile.tsx
│   ├── MyCards.tsx
│   ├── CardCreator.tsx
│   ├── PublicCard.tsx
│   └── Index.tsx
│
├── types/
│   └── database.ts            # Supabase types
│
├── App.tsx                    # Root component
└── main.tsx                   # Entry point
```

## Technology Stack

```
Frontend:
  ├── React 18
  ├── TypeScript
  ├── Vite
  ├── React Router v6
  ├── Tailwind CSS
  ├── shadcn/ui
  └── TanStack Query

Backend:
  ├── Supabase
  │   ├── PostgreSQL
  │   ├── Auth (JWT)
  │   ├── Row Level Security
  │   └── REST API

Development:
  ├── npm
  ├── ESLint
  └── TypeScript
```

## Deployment Flow

```
Local Development
      ↓
Git Commit & Push
      ↓
GitHub Repository
      ↓
Vercel/Netlify (Auto Deploy)
      ↓
Production Site
      ↓
Supabase (Production DB)
```
