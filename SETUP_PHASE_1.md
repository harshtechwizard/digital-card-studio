# Phase 1 Setup Guide

## Quick Setup (5 minutes)

### Step 1: Create Storage Buckets in Supabase

Go to your Supabase Dashboard → Storage → Create new buckets:

#### Bucket 1: product-photos
- Name: `product-photos`
- Public: ✅ Yes
- File size limit: 2 MB
- Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

#### Bucket 2: gallery-photos
- Name: `gallery-photos`
- Public: ✅ Yes
- File size limit: 5 MB
- Allowed MIME types: `image/jpeg, image/jpg, image/png, image/webp`

**OR** run the SQL script:
```bash
# In Supabase SQL Editor, run:
CREATE_STORAGE_BUCKETS.sql
```

### Step 2: Restart Dev Server

```bash
npm run dev
```

### Step 3: Test the Features

1. **Login** to your account
2. **Go to Profile page**
   - You'll see 4 tabs now: Personal, Education, Professional, Showcase
3. **Add data:**
   - Personal tab: Add WhatsApp number
   - Education tab: Add your education
   - Professional tab: Add professional info (already working)
   - Showcase tab: Add awards, products/services, photos
4. **Create a card:**
   - Go to "My Cards" → "Create New Card"
   - Select which fields to show (including new ones)
   - See live preview
   - Save card
5. **View public card:**
   - Click "Share" on your card
   - Open the public URL
   - See all selected fields displayed beautifully

## What's New

### Profile Page (4 Tabs)
```
Personal → Education → Professional → Showcase
```

**Personal Tab:**
- ✅ WhatsApp Number (new field)
- All existing personal fields

**Education Tab (NEW):**
- Add/Edit/Delete education entries
- Fields: Degree, Institution, Year, Description

**Professional Tab:**
- All existing professional fields
- Multiple professional entries

**Showcase Tab (NEW):**
- Awards & Certifications section
- Products & Services section (with photo upload)
- Photo Gallery section (with photo upload)

### Card Creator
- ✅ WhatsApp checkbox
- ✅ Education selection
- ✅ Awards selection
- ✅ Products/Services selection
- ✅ Photo Gallery selection
- ✅ Live preview updates

### Public Card
- ✅ Displays education section
- ✅ Displays awards section
- ✅ Displays products/services (grid layout)
- ✅ Displays photo gallery (grid layout)
- ✅ Only shows selected fields

## Troubleshooting

### Issue: "Failed to upload photo"
**Solution:** Make sure you created the storage buckets (`product-photos` and `gallery-photos`)

### Issue: "Storage bucket not found"
**Solution:** 
1. Go to Supabase Dashboard → Storage
2. Create the missing bucket
3. Set it as Public
4. Configure file size limits

### Issue: "RLS policy error"
**Solution:** Run the `CREATE_STORAGE_BUCKETS.sql` script to create RLS policies

### Issue: "Photos not displaying"
**Solution:** 
1. Check if bucket is set to Public
2. Verify the photo URL is accessible
3. Check browser console for errors

## Features Checklist

After setup, you should be able to:

- [x] Add WhatsApp number in personal info
- [x] Add education entries
- [x] Add awards with certificate URLs
- [x] Add products/services with photos
- [x] Add photos to gallery
- [x] Select which fields to show on each card
- [x] See live preview while creating cards
- [x] View beautiful public cards with all selected fields
- [x] Edit and delete all entries
- [x] Upload photos (products and gallery)

## Database Tables

All tables already exist (no migration needed):
- ✅ `personal_info` (whatsapp_number field already added)
- ✅ `education`
- ✅ `awards`
- ✅ `products_services`
- ✅ `photo_gallery`

## Storage Buckets

Need to create manually:
- ⚠️ `product-photos` (NEW)
- ⚠️ `gallery-photos` (NEW)

Already exist:
- ✅ `profile-photos`
- ✅ `company-logos`

## File Structure

New files added:
```
src/
├── hooks/
│   ├── useEducation.ts          ← NEW
│   ├── useAwards.ts             ← NEW
│   ├── useProductsServices.ts   ← NEW
│   └── usePhotoGallery.ts       ← NEW
```

Modified files:
```
src/
├── pages/
│   ├── Profile.tsx              ← UPDATED (4 tabs, new sections)
│   ├── CardCreator.tsx          ← UPDATED (new field selections)
│   └── PublicCard.tsx           ← UPDATED (new sections display)
└── hooks/
    └── usePublicCard.ts         ← UPDATED (fetch new data)
```

## Next Steps

After Phase 1 is working:
1. Test all features thoroughly
2. Add more data (education, awards, products, photos)
3. Create multiple cards with different field combinations
4. Share cards and verify public display
5. Ready for Phase 2 (Card Design Customization)

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check Supabase logs
3. Verify storage buckets are created
4. Verify RLS policies are in place
5. Check that all files are saved

## Summary

Phase 1 adds:
- ✅ WhatsApp in personal info
- ✅ Education section
- ✅ Awards section
- ✅ Products/Services section
- ✅ Photo Gallery section
- ✅ Full CRUD for all
- ✅ Field selection in Card Creator
- ✅ Beautiful display in Public Card

**Total setup time: ~5 minutes**
**No breaking changes**
**All existing features work as before**
