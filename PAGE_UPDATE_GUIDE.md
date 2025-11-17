# Page Update Guide

Step-by-step guide to update each existing page to work with Supabase.

## 1. Profile Page (`src/pages/Profile.tsx`)

### Current Issues
- Uses old `useProfile()` hook that returns `{ profile, saveProfile }`
- Expects single profile object with nested `professionalEntries` array

### Required Changes

**Import the hook:**
```tsx
import { useProfile } from '@/hooks/useProfile';
```

**Update hook usage:**
```tsx
// OLD
const { profile, saveProfile } = useProfile();

// NEW
const {
  personalInfo,
  professionalInfo,
  loading,
  error,
  savePersonalInfo,
  saveProfessionalInfo,
  deleteProfessionalInfo
} = useProfile();
```

**Handle loading state:**
```tsx
if (loading) {
  return <div>Loading profile...</div>;
}
```

**Update form submission:**
```tsx
// OLD
const handleSubmit = (data) => {
  saveProfile(data);
};

// NEW - Personal Info
const handlePersonalSubmit = async (data) => {
  await savePersonalInfo({
    full_name: data.fullName,
    primary_email: data.primaryEmail,
    mobile_number: data.mobileNumber,
    bio: data.bio,
  });
};

// NEW - Professional Info
const handleProfessionalSubmit = async (data) => {
  await saveProfessionalInfo({
    designation: data.jobTitle,
    company_name: data.companyName,
    company_website: data.companyWebsite,
    office_email: data.officeEmail,
    is_primary: data.isPrimary,
  });
};
```

**Display data:**
```tsx
// OLD
<Input value={profile.fullName} />

// NEW
<Input value={personalInfo?.full_name || ''} />
```

---

## 2. My Cards Page (`src/pages/MyCards.tsx`)

### Current Issues
- Uses old `useBusinessCards()` hook without loading/error states
- May not handle async operations properly

### Required Changes

**Update hook usage:**
```tsx
// OLD
const { cards, addCard, updateCard, deleteCard } = useBusinessCards();

// NEW
const { cards, loading, error, addCard, updateCard, deleteCard } = useBusinessCards();
```

**Add loading state:**
```tsx
if (loading) {
  return (
    <div className="container mx-auto p-4">
      <div className="text-center">Loading your cards...</div>
    </div>
  );
}
```

**Add error handling:**
```tsx
if (error) {
  return (
    <div className="container mx-auto p-4">
      <div className="text-red-500">Error: {error}</div>
    </div>
  );
}
```

**Update delete handler:**
```tsx
// OLD
const handleDelete = (id: string) => {
  deleteCard(id);
};

// NEW
const handleDelete = async (id: string) => {
  try {
    await deleteCard(id);
    toast({ title: 'Card deleted successfully' });
  } catch (err) {
    toast({ 
      title: 'Error', 
      description: 'Failed to delete card',
      variant: 'destructive' 
    });
  }
};
```

**Update card display:**
```tsx
{cards.map(card => (
  <div key={card.id}>
    <h3>{card.name}</h3>
    <p>Slug: {card.slug}</p>
    <a href={`/card/${card.slug}`} target="_blank">
      View Public Card
    </a>
    <Button onClick={() => handleDelete(card.id)}>Delete</Button>
  </div>
))}
```

---

## 3. Card Creator Page (`src/pages/CardCreator.tsx`)

### Current Issues
- Creates cards with old structure
- Doesn't generate slugs
- Doesn't use Supabase schema

### Required Changes

**Import utilities:**
```tsx
import { useBusinessCards } from '@/hooks/useBusinessCards';
import { generateUniqueSlug } from '@/lib/slugify';
import { useNavigate } from 'react-router-dom';
```

**Update hook usage:**
```tsx
const { addCard, updateCard, loading } = useBusinessCards();
const navigate = useNavigate();
```

**Update form submission:**
```tsx
const handleSubmit = async (formData) => {
  try {
    const slug = generateUniqueSlug(formData.name);
    
    await addCard({
      name: formData.name,
      slug: slug,
      template_type: formData.template || 'default',
      fields_config: {
        // Which fields from profile to show
        showFullName: true,
        showEmail: true,
        showPhone: formData.showPhone,
        showBio: formData.showBio,
        professionalEntryIds: formData.selectedProfessionalIds || [],
      },
      design_config: {
        theme: formData.theme || 'light',
        primaryColor: formData.primaryColor,
        layout: formData.layout,
      },
      is_active: true,
    });

    toast({ title: 'Card created successfully!' });
    navigate('/my-cards');
  } catch (err) {
    toast({ 
      title: 'Error', 
      description: 'Failed to create card',
      variant: 'destructive' 
    });
  }
};
```

**Add field selection UI:**
```tsx
// Let users choose which profile fields to include
<div>
  <h3>Select Fields to Display</h3>
  <Checkbox 
    checked={showFullName} 
    onCheckedChange={setShowFullName}
  >
    Full Name
  </Checkbox>
  <Checkbox 
    checked={showEmail} 
    onCheckedChange={setShowEmail}
  >
    Email
  </Checkbox>
  {/* Add more field selections */}
</div>
```

---

## 4. Public Card Page (`src/pages/PublicCard.tsx`)

### Current Issues
- Fetches from localStorage
- No analytics tracking
- Doesn't use Supabase

### Required Changes

**Replace entire fetch logic:**
```tsx
import { useParams } from 'react-router-dom';
import { usePublicCard } from '@/hooks/usePublicCard';

export default function PublicCard() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = usePublicCard(slug!);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading card...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Card not found</div>
      </div>
    );
  }

  const { card, personalInfo, professionalInfo } = data;
  const fieldsConfig = card.fields_config as any;
  const designConfig = card.design_config as any;

  return (
    <div className="min-h-screen" style={{ 
      background: designConfig?.theme === 'dark' ? '#000' : '#fff' 
    }}>
      {/* Display card based on fields_config */}
      {fieldsConfig?.showFullName && (
        <h1>{personalInfo?.full_name}</h1>
      )}
      
      {fieldsConfig?.showEmail && (
        <p>{personalInfo?.primary_email}</p>
      )}
      
      {fieldsConfig?.showPhone && (
        <p>{personalInfo?.mobile_number}</p>
      )}
      
      {fieldsConfig?.showBio && (
        <p>{personalInfo?.bio}</p>
      )}
      
      {/* Display selected professional entries */}
      {professionalInfo
        .filter(prof => fieldsConfig?.professionalEntryIds?.includes(prof.id))
        .map(prof => (
          <div key={prof.id}>
            <h3>{prof.designation}</h3>
            <p>{prof.company_name}</p>
          </div>
        ))
      }
    </div>
  );
}
```

---

## Testing Checklist

After updating each page:

### Profile Page
- [ ] Can view existing profile data
- [ ] Can save personal info
- [ ] Can add professional entry
- [ ] Can delete professional entry
- [ ] Loading state shows while fetching
- [ ] Error messages display properly

### My Cards Page
- [ ] Can see list of cards
- [ ] Can delete a card
- [ ] Can navigate to edit card
- [ ] Loading state shows while fetching
- [ ] Empty state shows when no cards

### Card Creator Page
- [ ] Can create new card
- [ ] Slug is generated automatically
- [ ] Can select which fields to show
- [ ] Can choose design/theme
- [ ] Redirects to My Cards after creation
- [ ] Shows error if creation fails

### Public Card Page
- [ ] Card displays correctly
- [ ] Only selected fields are shown
- [ ] Design config is applied
- [ ] Works without authentication
- [ ] Shows 404 for invalid slugs
- [ ] Analytics are tracked (check Supabase)

---

## Common Patterns

### Loading State
```tsx
if (loading) {
  return <div>Loading...</div>;
}
```

### Error Handling
```tsx
if (error) {
  return <div className="text-red-500">Error: {error}</div>;
}
```

### Async Operations
```tsx
const handleAction = async () => {
  try {
    await someAsyncFunction();
    toast({ title: 'Success!' });
  } catch (err) {
    toast({ 
      title: 'Error', 
      description: err.message,
      variant: 'destructive' 
    });
  }
};
```

### Null Safety
```tsx
<Input value={personalInfo?.full_name || ''} />
```

---

## Need Help?

- Check `HOOKS_API_REFERENCE.md` for hook APIs
- Check `SUPABASE_SETUP.md` for database issues
- Check Supabase Table Editor to see actual data
- Check browser console for errors
- Check Supabase logs for backend errors
