# Supabase Setup Guide for Digital Business Card MVP

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `digital-business-cards` (or your choice)
   - Database password: (save this securely)
   - Region: Choose closest to your users
5. Wait for the project to be created (~2 minutes)

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `.env.example`):

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace the placeholder values with your actual Supabase credentials
3. **IMPORTANT**: Add `.env` to your `.gitignore` file (should already be there)

## Step 4: Run Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-setup.sql` file
4. Paste it into the SQL editor
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. You should see "Success. No rows returned" - this is correct!

## Step 5: Verify Database Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see these tables:
   - ✅ personal_info
   - ✅ professional_info
   - ✅ education
   - ✅ awards
   - ✅ products_services
   - ✅ photo_gallery
   - ✅ business_cards
   - ✅ card_analytics

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates under **Authentication** → **Email Templates**

### Email Confirmation Settings

By default, Supabase requires email confirmation. For development:

1. Go to **Authentication** → **Settings**
2. Find "Enable email confirmations"
3. You can disable this for testing (NOT recommended for production)

## Step 7: Test Your Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:5173/signup`
3. Create a test account
4. Check your email for confirmation (if enabled)
5. Log in at `http://localhost:5173/login`

## Step 8: Verify Row Level Security (RLS)

Your database is now protected with RLS policies:

- ✅ Users can only see/edit their own profile data
- ✅ Business cards are publicly viewable when active
- ✅ Only card owners can edit/delete their cards
- ✅ Analytics are tracked for all card views

## What's Been Integrated

### Frontend Changes:
- ✅ Supabase client configured (`src/lib/supabase/client.ts`)
- ✅ Database types generated (`src/types/database.ts`)
- ✅ Authentication context (`src/contexts/AuthContext.tsx`)
- ✅ Login & Signup pages
- ✅ Protected routes
- ✅ Updated hooks to use Supabase instead of localStorage:
  - `useProfile.ts` - Fetches from personal_info & professional_info tables
  - `useBusinessCards.ts` - Manages business_cards table
  - `usePublicCard.ts` - Fetches public card data

### Backend (Supabase):
- ✅ Complete database schema
- ✅ Row Level Security policies
- ✅ Authentication system
- ✅ Analytics tracking

## Next Steps

### Update Your Existing Pages

Some of your existing pages may need updates to work with the new Supabase hooks:

1. **Profile Page** - Update to use new `useProfile()` hook structure
2. **MyCards Page** - Update to use new `useBusinessCards()` hook
3. **CardCreator Page** - Update to save to Supabase
4. **PublicCard Page** - Update to use `usePublicCard()` hook

### Storage Setup (Optional - for images)

If you want to upload profile photos or card images:

1. Go to **Storage** in Supabase
2. Create a new bucket called `avatars` or `card-images`
3. Set it to public if you want images accessible without auth
4. Add storage policies for user uploads

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file exists and has the correct variables
- Restart your dev server after creating/updating `.env`

### "Failed to fetch" errors
- Check your Supabase project is running (not paused)
- Verify your API keys are correct
- Check browser console for detailed error messages

### Authentication not working
- Verify email provider is enabled in Supabase
- Check if email confirmation is required
- Look at Supabase logs: **Authentication** → **Logs**

### RLS Policy errors
- Make sure you ran the entire `supabase-setup.sql` script
- Check **Authentication** → **Policies** to verify policies exist
- Try logging out and back in

## Security Notes

- ✅ Never commit your `.env` file
- ✅ Use environment variables for all sensitive data
- ✅ RLS policies protect your data at the database level
- ✅ The anon key is safe to use in frontend code
- ⚠️ Never expose your service_role key in frontend code

## Production Deployment

When deploying to production:

1. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
2. Enable email confirmations in Supabase
3. Configure custom email templates
4. Set up a custom domain for your Supabase project (optional)
5. Enable additional security features in Supabase settings
