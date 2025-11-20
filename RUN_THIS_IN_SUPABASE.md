# Run This in Supabase - Step by Step

## ✅ What This Does:
- Adds WhatsApp number fields
- Adds Company Logo URL field
- Adds Office Hours fields (opening time, closing time, working days)
- Creates storage buckets for images
- Sets up security policies

---

## 📋 Step-by-Step Instructions:

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql
-- Add new columns to tables
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

ALTER TABLE professional_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS office_opening_time TIME,
ADD COLUMN IF NOT EXISTS office_closing_time TIME,
ADD COLUMN IF NOT EXISTS office_days TEXT;

-- Create storage buckets (idempotent - safe to run multiple times)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('company-logos', 'company-logos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view profile photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own company logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view company logos" ON storage.objects;

-- Storage policies for profile photos
CREATE POLICY "Users can upload their own profile photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own profile photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own profile photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-photos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Public can view profile photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Storage policies for company logos
CREATE POLICY "Users can upload their own company logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-logos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own company logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own company logos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'company-logos' AND
  (string_to_array(name, '/'))[1] = auth.uid()::text
);

CREATE POLICY "Public can view company logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-logos');
```

### Step 3: Click "Run" (or press Ctrl/Cmd + Enter)

You should see: **"Success. No rows returned"** - This is GOOD! ✅

### Step 4: Verify It Worked

Run this verification query:

```sql
-- Check if columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'personal_info' AND column_name = 'whatsapp_number';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'professional_info' 
AND column_name IN ('whatsapp_number', 'company_logo_url', 'office_opening_time', 'office_closing_time', 'office_days');
```

You should see the new columns listed! ✅

### Step 5: Check Storage Buckets

1. Go to **Storage** in Supabase sidebar
2. You should see:
   - `profile-photos` bucket
   - `company-logos` bucket

---

## ✅ What You Can Do Now:

1. **Upload Profile Photos**
   - Go to Profile page in your app
   - Click "Choose File" under Profile Photo
   - Upload an image
   - It will be stored in Supabase Storage

2. **Upload Company Logos**
   - Go to Professional Info section
   - Click "Choose File" under Company Logo
   - Upload your company logo
   - It will be stored in Supabase Storage

3. **Add WhatsApp Numbers**
   - Personal WhatsApp: In Personal Info section
   - Business WhatsApp: In Professional Info section
   - Format: +1234567890 (with country code)

4. **Set Office Hours**
   - Opening Time: Use time picker (e.g., 09:00)
   - Closing Time: Use time picker (e.g., 17:00)
   - Working Days: Type text (e.g., "Monday-Friday")

---

## 🎯 Summary:

**Database Columns Added:**
- ✅ `personal_info.whatsapp_number`
- ✅ `professional_info.whatsapp_number`
- ✅ `professional_info.company_logo_url`
- ✅ `professional_info.office_opening_time`
- ✅ `professional_info.office_closing_time`
- ✅ `professional_info.office_days`

**Storage Buckets Created:**
- ✅ `profile-photos` (for profile pictures)
- ✅ `company-logos` (for company logos)

**Security Policies Set:**
- ✅ Users can only upload/edit/delete their own files
- ✅ Everyone can view the images (public read)

---

**Done! Now run `npm run dev` and test the Profile page!** 🚀
