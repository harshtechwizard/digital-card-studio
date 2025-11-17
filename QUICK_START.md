# Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Install Dependencies (if not done)
```bash
npm install
```

### Step 2: Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings → API
3. Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Set Up Database

1. Open Supabase SQL Editor
2. Copy entire contents of `supabase-setup.sql`
3. Paste and run it
4. Verify tables appear in Table Editor

### Step 4: Update Your Pages

Your existing pages need small updates to work with Supabase. See `HOOKS_API_REFERENCE.md` for details.

**Priority order:**
1. `src/pages/Profile.tsx` - Update to use new `useProfile()` hook
2. `src/pages/MyCards.tsx` - Add loading states
3. `src/pages/CardCreator.tsx` - Update card creation
4. `src/pages/PublicCard.tsx` - Use `usePublicCard()` hook

### Step 5: Run and Test

```bash
npm run dev
```

1. Visit `http://localhost:5173/signup`
2. Create an account
3. Log in
4. Test creating a profile and business card

## 📁 Key Files Created

- `src/lib/supabase/client.ts` - Supabase connection
- `src/contexts/AuthContext.tsx` - Authentication state
- `src/pages/Login.tsx` & `Signup.tsx` - Auth pages
- `src/hooks/useProfile.ts` - Profile data (updated)
- `src/hooks/useBusinessCards.ts` - Cards data (updated)
- `src/hooks/usePublicCard.ts` - Public card fetching
- `src/types/database.ts` - TypeScript types
- `supabase-setup.sql` - Database schema

## 🔧 What Changed

### Before (localStorage)
```tsx
const { profile, saveProfile } = useProfile();
const { cards, addCard } = useBusinessCards();
```

### After (Supabase)
```tsx
const { personalInfo, professionalInfo, savePersonalInfo } = useProfile();
const { cards, loading, error, addCard } = useBusinessCards();
```

## 📖 Full Documentation

- `SUPABASE_SETUP.md` - Detailed Supabase setup
- `HOOKS_API_REFERENCE.md` - Complete API reference
- `PROJECT_STATUS.md` - Project overview and status

## ⚡ Quick Tips

- Restart dev server after creating `.env`
- Check Supabase logs if you get errors
- Use `loading` and `error` states in your components
- All data is now user-specific (RLS protected)
- Public cards work without authentication

## 🆘 Troubleshooting

**"Missing Supabase environment variables"**
→ Create `.env` file with your credentials and restart dev server

**"Failed to fetch"**
→ Check Supabase project is active and credentials are correct

**"Row Level Security policy violation"**
→ Make sure you ran the entire `supabase-setup.sql` script

**TypeScript errors**
→ Check `HOOKS_API_REFERENCE.md` for correct hook usage

## ✅ Checklist

- [ ] Supabase project created
- [ ] `.env` file configured
- [ ] Database schema deployed
- [ ] Can sign up and log in
- [ ] Profile page updated
- [ ] MyCards page updated
- [ ] CardCreator page updated
- [ ] PublicCard page updated
- [ ] Tested creating a card
- [ ] Tested viewing public card

## 🎯 What's Next

After basic setup works:
1. Add profile photo upload (Supabase Storage)
2. Implement QR code generation
3. Add card templates/themes
4. Build analytics dashboard
5. Add more profile fields (education, awards, etc.)

---

**Need help?** Check the other documentation files or Supabase docs at [supabase.com/docs](https://supabase.com/docs)
