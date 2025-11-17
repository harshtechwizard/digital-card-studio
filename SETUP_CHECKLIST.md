# Setup Checklist

Use this checklist to track your progress setting up the Digital Business Card MVP.

## 📋 Phase 1: Supabase Setup (15 minutes)

### Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Click "New Project"
- [ ] Fill in project details
- [ ] Save database password securely
- [ ] Wait for project to be created (~2 min)

### Get API Credentials
- [ ] Go to Settings → API
- [ ] Copy Project URL
- [ ] Copy anon/public key
- [ ] Keep these handy for next step

### Configure Environment
- [ ] Copy `.env.example` to `.env`
- [ ] Paste Project URL into `VITE_SUPABASE_URL`
- [ ] Paste anon key into `VITE_SUPABASE_ANON_KEY`
- [ ] Save the file

### Deploy Database Schema
- [ ] Open Supabase SQL Editor
- [ ] Click "New Query"
- [ ] Open `supabase-setup.sql` file
- [ ] Copy entire contents
- [ ] Paste into SQL Editor
- [ ] Click "Run" (or Ctrl/Cmd + Enter)
- [ ] Verify "Success. No rows returned" message

### Verify Database
- [ ] Go to Table Editor
- [ ] Confirm these tables exist:
  - [ ] personal_info
  - [ ] professional_info
  - [ ] education
  - [ ] awards
  - [ ] products_services
  - [ ] photo_gallery
  - [ ] business_cards
  - [ ] card_analytics

### Verify RLS Policies
- [ ] Go to Authentication → Policies
- [ ] Confirm policies exist for each table
- [ ] Should see "Users can manage their own..." policies

---

## 📋 Phase 2: Test Authentication (10 minutes)

### Start Development Server
- [ ] Run `npm install` (if not done)
- [ ] Run `npm run dev`
- [ ] Open browser to `http://localhost:5173`

### Test Signup
- [ ] Navigate to `/signup`
- [ ] Create a test account
- [ ] Check email for confirmation (if enabled)
- [ ] Confirm email (if required)

### Test Login
- [ ] Navigate to `/login`
- [ ] Log in with test account
- [ ] Verify redirect to `/my-cards`
- [ ] See your email in navigation
- [ ] See "Sign Out" button

### Test Protected Routes
- [ ] Try accessing `/profile` - should work
- [ ] Try accessing `/my-cards` - should work
- [ ] Sign out
- [ ] Try accessing `/profile` - should redirect to login
- [ ] Try accessing `/my-cards` - should redirect to login

### Test Public Routes
- [ ] While logged out, try `/card/test-slug`
- [ ] Should show "Card not found" (no cards yet)
- [ ] Should NOT redirect to login

---

## 📋 Phase 3: Update Pages (45-60 minutes)

### Update Profile Page
- [ ] Open `src/pages/Profile.tsx`
- [ ] Follow `PAGE_UPDATE_GUIDE.md` → Section 1
- [ ] Update hook usage
- [ ] Add loading state
- [ ] Update form submission
- [ ] Test saving personal info
- [ ] Test adding professional entry
- [ ] Test deleting professional entry

### Update My Cards Page
- [ ] Open `src/pages/MyCards.tsx`
- [ ] Follow `PAGE_UPDATE_GUIDE.md` → Section 2
- [ ] Add loading and error states
- [ ] Update delete handler
- [ ] Test viewing empty state
- [ ] Test deleting a card (after creating one)

### Update Card Creator Page
- [ ] Open `src/pages/CardCreator.tsx`
- [ ] Follow `PAGE_UPDATE_GUIDE.md` → Section 3
- [ ] Import `generateUniqueSlug`
- [ ] Update form submission
- [ ] Add field selection UI
- [ ] Test creating a card
- [ ] Verify redirect to My Cards

### Update Public Card Page
- [ ] Open `src/pages/PublicCard.tsx`
- [ ] Follow `PAGE_UPDATE_GUIDE.md` → Section 4
- [ ] Replace with `usePublicCard` hook
- [ ] Add loading state
- [ ] Add error handling
- [ ] Display based on fields_config
- [ ] Test viewing a public card

---

## 📋 Phase 4: End-to-End Testing (15 minutes)

### Profile Flow
- [ ] Log in
- [ ] Go to Profile page
- [ ] Fill in personal information
- [ ] Save personal info
- [ ] Verify data persists on refresh
- [ ] Add a professional entry
- [ ] Verify it appears in list
- [ ] Delete professional entry
- [ ] Verify it's removed

### Card Creation Flow
- [ ] Go to My Cards page
- [ ] Click "Create New Card" (or similar)
- [ ] Fill in card details
- [ ] Select fields to display
- [ ] Choose design/theme
- [ ] Save card
- [ ] Verify redirect to My Cards
- [ ] See new card in list

### Public Card Flow
- [ ] Copy card slug from My Cards
- [ ] Open incognito/private window
- [ ] Navigate to `/card/{slug}`
- [ ] Verify card displays correctly
- [ ] Verify only selected fields show
- [ ] Verify design is applied

### Analytics Flow
- [ ] View a public card
- [ ] Log back into your account
- [ ] Go to Supabase Table Editor
- [ ] Open `card_analytics` table
- [ ] Verify a new row was created
- [ ] Check it has correct card_id

---

## 📋 Phase 5: Verification (5 minutes)

### Data Verification
- [ ] Open Supabase Table Editor
- [ ] Check `personal_info` - should have your data
- [ ] Check `professional_info` - should have entries
- [ ] Check `business_cards` - should have your cards
- [ ] Check `card_analytics` - should have views

### Security Verification
- [ ] Create a second test account
- [ ] Log in with second account
- [ ] Verify you can't see first account's data
- [ ] Try to access first account's card via API (should fail)
- [ ] Verify you can view first account's public card

### TypeScript Verification
- [ ] Run `npm run build`
- [ ] Verify no TypeScript errors
- [ ] Fix any errors that appear

---

## 📋 Optional Enhancements

### Profile Photos
- [ ] Set up Supabase Storage bucket
- [ ] Add upload functionality
- [ ] Update profile to display photo

### QR Codes
- [ ] Install QR code library
- [ ] Generate QR for card URL
- [ ] Add download button

### Analytics Dashboard
- [ ] Create analytics page
- [ ] Fetch card_analytics data
- [ ] Display charts/stats

### Card Templates
- [ ] Design multiple templates
- [ ] Add template selector
- [ ] Apply template styles

---

## 🎯 Success Criteria

You're done when:
- ✅ Can sign up and log in
- ✅ Can create and edit profile
- ✅ Can create business cards
- ✅ Can view public cards without auth
- ✅ Analytics are tracked
- ✅ RLS prevents unauthorized access
- ✅ No TypeScript errors
- ✅ App builds successfully

---

## 📚 Reference Documents

While working through this checklist, refer to:

- **Getting stuck?** → `TROUBLESHOOTING.md`
- **Need API examples?** → `HOOKS_API_REFERENCE.md`
- **Updating pages?** → `PAGE_UPDATE_GUIDE.md`
- **Supabase issues?** → `SUPABASE_SETUP.md`
- **Understanding architecture?** → `ARCHITECTURE.md`

---

## 🆘 Common Issues

If you encounter issues:

1. **"Missing Supabase environment variables"**
   - Create `.env` file with credentials
   - Restart dev server

2. **"Row Level Security policy violation"**
   - Re-run `supabase-setup.sql`
   - Check Supabase logs

3. **TypeScript errors**
   - Check `HOOKS_API_REFERENCE.md`
   - Use correct hook APIs

4. **Can't see data**
   - Check Supabase Table Editor
   - Verify user_id matches
   - Check RLS policies

---

## ⏱️ Time Estimates

- Phase 1 (Supabase Setup): 15 minutes
- Phase 2 (Test Auth): 10 minutes
- Phase 3 (Update Pages): 45-60 minutes
- Phase 4 (Testing): 15 minutes
- Phase 5 (Verification): 5 minutes

**Total: 90-105 minutes (1.5-2 hours)**

---

## 🎉 Completion

When all checkboxes are checked:
- [ ] Take a screenshot of your working app
- [ ] Commit your changes to git
- [ ] Deploy to production (optional)
- [ ] Share your first digital business card! 🚀

---

**Good luck! You've got this! 💪**
