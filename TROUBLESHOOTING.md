# Troubleshooting Guide

Common issues and their solutions.

## Setup Issues

### ❌ "Missing Supabase environment variables"

**Problem:** App crashes on startup with this error.

**Solution:**
1. Create a `.env` file in project root (copy from `.env.example`)
2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...your-key
   ```
3. Restart your dev server (`npm run dev`)

**Note:** Vite requires restart after `.env` changes.

---

### ❌ "Failed to fetch" or Network Errors

**Problem:** Can't connect to Supabase.

**Solutions:**
1. Check your Supabase project is active (not paused)
2. Verify your `.env` credentials are correct
3. Check your internet connection
4. Try accessing your Supabase dashboard - if it's down, wait for it to come back
5. Check browser console for detailed error messages

---

### ❌ Tables Not Found

**Problem:** Queries fail with "relation does not exist" error.

**Solution:**
1. Go to Supabase SQL Editor
2. Copy entire `supabase-setup.sql` file
3. Paste and run it
4. Verify tables appear in Table Editor
5. Make sure you ran the ENTIRE script, not just parts

---

## Authentication Issues

### ❌ Can't Sign Up

**Problem:** Sign up fails or hangs.

**Solutions:**
1. Check email provider is enabled:
   - Supabase Dashboard → Authentication → Providers
   - Email should be enabled
2. Check if email confirmation is required:
   - Authentication → Settings
   - Look for "Enable email confirmations"
3. Check Supabase logs:
   - Authentication → Logs
   - Look for error messages

---

### ❌ Email Confirmation Not Received

**Problem:** Signed up but no confirmation email.

**Solutions:**
1. Check spam folder
2. For development, disable email confirmation:
   - Supabase → Authentication → Settings
   - Disable "Enable email confirmations"
3. Or use Supabase's email testing:
   - Check Authentication → Logs for the confirmation link

---

### ❌ "Invalid login credentials"

**Problem:** Can't log in with correct password.

**Solutions:**
1. Make sure you confirmed your email (if required)
2. Try resetting password
3. Check Supabase → Authentication → Users to see if user exists
4. Try creating a new account to test

---

### ❌ Stuck on Loading Screen

**Problem:** App shows "Loading..." forever.

**Solutions:**
1. Check browser console for errors
2. Clear browser cache and cookies
3. Check if Supabase session is valid:
   ```tsx
   // Add this temporarily to debug
   console.log('Auth state:', { user, loading, session });
   ```
4. Try signing out and back in

---

## Database / RLS Issues

### ❌ "Row Level Security policy violation"

**Problem:** Can't read/write data even when logged in.

**Solutions:**
1. Verify RLS policies were created:
   - Supabase → Authentication → Policies
   - Each table should have policies
2. Re-run the RLS section of `supabase-setup.sql`
3. Check you're using the correct user_id:
   ```tsx
   console.log('Current user ID:', user?.id);
   ```
4. Verify the data has correct user_id in Table Editor

---

### ❌ Can't See My Data

**Problem:** Queries return empty arrays.

**Solutions:**
1. Check data exists in Supabase Table Editor
2. Verify user_id matches:
   - Your auth user ID
   - The user_id in the data rows
3. Check RLS policies allow SELECT
4. Try querying without filters first:
   ```tsx
   const { data } = await supabase.from('personal_info').select('*');
   console.log('All data:', data);
   ```

---

### ❌ Can't Update/Delete Data

**Problem:** Updates or deletes fail silently.

**Solutions:**
1. Check RLS policies allow UPDATE/DELETE
2. Verify you own the data (user_id matches)
3. Check for errors:
   ```tsx
   const { error } = await supabase.from('table').update(...);
   console.log('Update error:', error);
   ```
4. Check Supabase logs for detailed errors

---

## Frontend Issues

### ❌ TypeScript Errors

**Problem:** Type errors in hooks or components.

**Solutions:**
1. Make sure you're using the new hook APIs:
   - See `HOOKS_API_REFERENCE.md`
2. Import types from `@/types/database`:
   ```tsx
   import { Database } from '@/types/database';
   type PersonalInfo = Database['public']['Tables']['personal_info']['Row'];
   ```
3. Use optional chaining for nullable data:
   ```tsx
   personalInfo?.full_name
   ```

---

### ❌ "Cannot read property of undefined"

**Problem:** Runtime errors accessing data.

**Solutions:**
1. Check for loading state:
   ```tsx
   if (loading) return <div>Loading...</div>;
   ```
2. Check for null/undefined:
   ```tsx
   if (!personalInfo) return <div>No data</div>;
   ```
3. Use optional chaining:
   ```tsx
   <Input value={personalInfo?.full_name || ''} />
   ```

---

### ❌ Infinite Re-renders

**Problem:** Component keeps re-rendering.

**Solutions:**
1. Don't call hooks conditionally
2. Use useEffect dependencies correctly:
   ```tsx
   useEffect(() => {
     fetchData();
   }, [user]); // Add dependencies
   ```
3. Memoize callbacks if needed:
   ```tsx
   const handleSave = useCallback(async () => {
     // ...
   }, [dependencies]);
   ```

---

### ❌ Routes Not Working

**Problem:** Navigation doesn't work or shows 404.

**Solutions:**
1. Check route paths match in `App.tsx`
2. Use correct navigation:
   ```tsx
   import { useNavigate } from 'react-router-dom';
   const navigate = useNavigate();
   navigate('/my-cards');
   ```
3. Check ProtectedRoute is wrapping authenticated routes

---

## Data Issues

### ❌ Slug Already Exists

**Problem:** Can't create card with duplicate slug.

**Solution:**
Use the slug generator:
```tsx
import { generateUniqueSlug } from '@/lib/slugify';
const slug = generateUniqueSlug(cardName);
```

---

### ❌ Public Card Not Found

**Problem:** Public card URL shows "not found".

**Solutions:**
1. Check card exists in Supabase Table Editor
2. Verify `is_active` is true
3. Check slug matches exactly (case-sensitive)
4. Try accessing card while logged in first

---

### ❌ Analytics Not Tracking

**Problem:** Card views not recorded.

**Solutions:**
1. Check RLS policy allows INSERT on card_analytics
2. Verify card_id is correct
3. Check Supabase logs for errors
4. Look in Table Editor to see if any analytics exist

---

## Performance Issues

### ❌ Slow Loading

**Problem:** App takes long to load data.

**Solutions:**
1. Check your internet connection
2. Check Supabase region (should be close to you)
3. Add loading indicators:
   ```tsx
   if (loading) return <Spinner />;
   ```
4. Consider pagination for large datasets

---

### ❌ Too Many Requests

**Problem:** Hitting rate limits.

**Solutions:**
1. Don't fetch data on every render
2. Use proper useEffect dependencies
3. Consider caching with TanStack Query
4. Debounce search/filter inputs

---

## Development Issues

### ❌ Hot Reload Not Working

**Problem:** Changes don't reflect in browser.

**Solutions:**
1. Hard refresh browser (Ctrl+Shift+R)
2. Restart dev server
3. Clear browser cache
4. Check for console errors

---

### ❌ Build Fails

**Problem:** `npm run build` fails.

**Solutions:**
1. Fix all TypeScript errors first
2. Check for unused imports
3. Verify all environment variables are set
4. Try deleting `node_modules` and reinstalling:
   ```bash
   rm -rf node_modules
   npm install
   ```

---

## Debugging Tips

### Enable Detailed Logging

Add this to see what's happening:

```tsx
// In your component
useEffect(() => {
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Data:', data);
  console.log('Error:', error);
}, [user, loading, data, error]);
```

### Check Supabase Logs

1. Go to Supabase Dashboard
2. Click "Logs" in sidebar
3. Filter by:
   - API logs (for queries)
   - Auth logs (for authentication)
   - Database logs (for errors)

### Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for red errors
4. Check Network tab for failed requests

### Check Network Requests

1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Click on failed requests
4. Check Response tab for error details

### Test in Incognito

Sometimes cache causes issues. Test in incognito/private mode.

### Check Supabase Status

Visit [status.supabase.com](https://status.supabase.com) to see if there are any outages.

---

## Still Stuck?

1. Check all documentation files
2. Review Supabase documentation
3. Check browser console for errors
4. Check Supabase logs
5. Try creating a minimal reproduction
6. Search for similar issues online

## Common Error Messages

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| "Missing Supabase environment variables" | No .env file | Create .env with credentials |
| "Failed to fetch" | Network/Supabase down | Check connection and Supabase status |
| "Invalid login credentials" | Wrong password or unconfirmed email | Reset password or confirm email |
| "Row Level Security policy violation" | RLS not set up | Run supabase-setup.sql |
| "relation does not exist" | Tables not created | Run supabase-setup.sql |
| "Cannot read property of undefined" | Missing null check | Add loading/null checks |
| "Slug already exists" | Duplicate slug | Use generateUniqueSlug() |

---

**Remember:** Most issues are either:
1. Missing environment variables
2. RLS policies not set up
3. Missing null/loading checks
4. Wrong hook API usage

Check these first! 🔍
