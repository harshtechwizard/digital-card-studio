# Updated Hooks API Reference

Your hooks have been updated to use Supabase. Here's how to use them in your components.

## useAuth Hook

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, session, loading, signUp, signIn, signOut } = useAuth();

  // user: Current user object or null
  // session: Current session or null
  // loading: Boolean indicating if auth state is loading
  // signUp(email, password): Create new account
  // signIn(email, password): Sign in existing user
  // signOut(): Sign out current user
}
```

## useProfile Hook (UPDATED)

**Old API (localStorage):**
```tsx
const { profile, saveProfile } = useProfile();
```

**New API (Supabase):**
```tsx
import { useProfile } from '@/hooks/useProfile';

function ProfilePage() {
  const {
    personalInfo,        // Personal info object or null
    professionalInfo,    // Array of professional entries
    loading,            // Boolean
    error,              // Error string or null
    savePersonalInfo,   // Function to save personal info
    saveProfessionalInfo, // Function to save professional entry
    deleteProfessionalInfo, // Function to delete professional entry
    refetch             // Function to manually refetch data
  } = useProfile();

  // Save personal info
  const handleSavePersonal = async () => {
    await savePersonalInfo({
      full_name: 'John Doe',
      primary_email: 'john@example.com',
      mobile_number: '+1234567890',
      bio: 'Software Developer',
    });
  };

  // Save professional info
  const handleSaveProfessional = async () => {
    await saveProfessionalInfo({
      designation: 'Senior Developer',
      company_name: 'Tech Corp',
      company_website: 'https://techcorp.com',
      is_primary: true,
    });
  };

  // Delete professional entry
  const handleDelete = async (id: string) => {
    await deleteProfessionalInfo(id);
  };
}
```

## useBusinessCards Hook (UPDATED)

**Old API (localStorage):**
```tsx
const { cards, addCard, updateCard, deleteCard } = useBusinessCards();
```

**New API (Supabase):**
```tsx
import { useBusinessCards } from '@/hooks/useBusinessCards';

function MyCardsPage() {
  const {
    cards,      // Array of business cards
    loading,    // Boolean
    error,      // Error string or null
    addCard,    // Function to create new card
    updateCard, // Function to update card
    deleteCard, // Function to delete card
    refetch     // Function to manually refetch cards
  } = useBusinessCards();

  // Create new card
  const handleCreate = async () => {
    const newCard = await addCard({
      name: 'My Business Card',
      slug: 'my-card-123',
      template_type: 'modern',
      fields_config: { /* selected fields */ },
      design_config: { theme: 'light' },
      is_active: true,
    });
  };

  // Update card
  const handleUpdate = async (cardId: string) => {
    await updateCard(cardId, {
      name: 'Updated Name',
      is_active: false,
    });
  };

  // Delete card
  const handleDelete = async (cardId: string) => {
    await deleteCard(cardId);
  };
}
```

## usePublicCard Hook (NEW)

```tsx
import { usePublicCard } from '@/hooks/usePublicCard';

function PublicCardPage() {
  const { slug } = useParams();
  const { data, loading, error } = usePublicCard(slug!);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Card not found</div>;

  const { card, personalInfo, professionalInfo } = data;

  // card: Business card data
  // personalInfo: User's personal info
  // professionalInfo: Array of professional entries
}
```

## Database Types

All database types are available from `@/types/database`:

```tsx
import { Database } from '@/types/database';

type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
type BusinessCard = Database['public']['Tables']['business_cards']['Row'];
type ProfessionalInfo = Database['public']['Tables']['professional_info']['Row'];

// For inserts (optional fields)
type BusinessCardInsert = Database['public']['Tables']['business_cards']['Insert'];

// For updates (all fields optional)
type BusinessCardUpdate = Database['public']['Tables']['business_cards']['Update'];
```

## Migration Checklist

Update these files to use the new hooks:

- [ ] `src/pages/Profile.tsx` - Use new `useProfile()` structure
- [ ] `src/pages/MyCards.tsx` - Use new `useBusinessCards()` with loading states
- [ ] `src/pages/CardCreator.tsx` - Update to save to Supabase
- [ ] `src/pages/PublicCard.tsx` - Use `usePublicCard()` hook
- [ ] Remove old type files if not needed:
  - `src/types/profile.ts` (replaced by database types)
  - `src/types/businessCard.ts` (replaced by database types)

## Error Handling

All hooks now return an `error` state. Handle errors in your components:

```tsx
const { cards, loading, error } = useBusinessCards();

if (error) {
  return (
    <div className="text-red-500">
      Error: {error}
    </div>
  );
}
```

## Loading States

All hooks return a `loading` state. Show loading indicators:

```tsx
const { personalInfo, loading } = useProfile();

if (loading) {
  return <div>Loading profile...</div>;
}
```

## Authentication Required

All protected hooks require authentication. Wrap your app with `AuthProvider` and use `ProtectedRoute` for authenticated pages (already done in `App.tsx`).
