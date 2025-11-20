# Final Setup Instructions

## ✅ What I've Done:

### 1. Updated Database Types
- Added `whatsapp_number` to personal_info
- Added `whatsapp_number`, `company_logo_url`, `office_opening_time`, `office_closing_time`, `office_days` to professional_info

### 2. Updated Profile Page
**Personal Info Section - Added:**
- WhatsApp Number field (with country code hint)

**Professional Info Section - Added:**
- WhatsApp Business Number field
- Company Logo upload (with preview and remove button)
- Office Hours section:
  - Opening Time (time picker)
  - Closing Time (time picker)
  - Working Days (text input like "Monday-Friday")

### 3. Created Business Card Preview Component
- Shows company logo as faded background
- Profile photo in center
- Smooth animations
- WhatsApp click-to-chat buttons
- Office hours display

### 4. Added CSS Animations
- Fade-in, slide-up, scale-in animations

---

## 🔧 What YOU Need to Do:

### Step 1: Create Storage Buckets in Supabase (5 minutes)

1. Go to Supabase Dashboard → Storage
2. Create two buckets:
   - `profile-photos` (for profile pictures)
   - `company-logos` (for company logos)
3. Make both buckets **PUBLIC**
4. Set policies:
   ```sql
   -- Allow authenticated users to upload
   CREATE POLICY "Users can upload their own files"
   ON storage.objects FOR INSERT
   WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Allow public read
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (true);
   ```

### Step 2: Run Database Migration (2 minutes)

1. Open Supabase SQL Editor
2. Copy and paste this:

```sql
-- Add new columns
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

ALTER TABLE professional_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS office_opening_time TIME,
ADD COLUMN IF NOT EXISTS office_closing_time TIME,
ADD COLUMN IF NOT EXISTS office_days TEXT;
```

3. Click "Run"

### Step 3: Test the Profile Page

1. Run `npm run dev`
2. Go to Profile page
3. You should now see:
   - WhatsApp Number field in Personal Info
   - WhatsApp Business Number in Professional Info
   - Company Logo upload section
   - Office Hours section (Opening Time, Closing Time, Working Days)

### Step 4: Add Data

1. Fill in WhatsApp number (with country code like +1234567890)
2. Upload a company logo (PNG with transparent background works best)
3. Set office hours (e.g., 09:00 to 17:00)
4. Set working days (e.g., "Monday-Friday")
5. Click "Save Personal Information"

---

## 📱 How It Works:

### WhatsApp Integration:
- When someone clicks the WhatsApp button on your card, it opens:
  - WhatsApp Web (on desktop)
  - WhatsApp App (on mobile)
- Pre-fills your number, ready to send message

### Company Logo:
- Uploaded to Supabase Storage
- Displayed as faded background on business card
- Also shown in profile preview

### Office Hours:
- Displayed at bottom of business card
- Format: "Mon-Fri: 9:00 AM - 5:00 PM"
- Optional (won't show if not set)

---

## 🎨 What the Card Will Look Like:

```
┌─────────────────────────────────┐
│  [Company Logo - Faded BG]      │  ← Your uploaded logo
│                                  │
│      ┌───────────────┐          │
│      │ Profile Photo │          │  ← Your profile picture
│      └───────────────┘          │
│                                  │
│      John Doe                    │
│      Senior Developer            │
│      Acme Corp                   │
│                                  │
│  📧 📱 💬 🌐                    │  ← Email, Phone, WhatsApp, Website
│                                  │
│  Office: Mon-Fri 9AM-5PM        │  ← Your office hours
│                                  │
│  [Save Contact] [Share]         │
└─────────────────────────────────┘
```

---

## 🚀 Next Steps (After Testing Profile):

1. Update CardCreator to add WhatsApp checkbox
2. Update PublicCard to use new BusinessCardPreview component
3. Test the complete flow

---

## ⚠️ Important Notes:

1. **Storage Buckets**: Must create `profile-photos` and `company-logos` buckets in Supabase
2. **WhatsApp Format**: Must include country code (e.g., +1234567890)
3. **Logo Format**: PNG with transparent background looks best
4. **Office Hours**: Optional - card won't show them if not set

---

## 🐛 Troubleshooting:

**"Failed to upload photo/logo"**
→ Make sure you created the storage buckets in Supabase

**"Policy violation"**
→ Make sure storage buckets are set to PUBLIC

**"WhatsApp button doesn't work"**
→ Make sure number includes country code (+1234567890)

---

**Ready to test! Run `npm run dev` and go to the Profile page!** 🎉
