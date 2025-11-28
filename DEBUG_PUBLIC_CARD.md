# Debug Public Card Issue

## Problem

When clicking a card from "My Cards", it shows all sections correctly.
When sharing the URL and opening it, it only shows up to professional info.

## How to Debug

### Step 1: Open Browser Console

1. Open your card from "My Cards" (click on the card)
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for these logs:

```
usePublicCard: Fetching card with slug: your-slug
usePublicCard: Found card: {card data}
usePublicCard: Fetching personal info for user: user-id
usePublicCard: Personal info: {data}
usePublicCard: Fetching professional info for user: user-id
usePublicCard: Professional info: {data}
usePublicCard: Data set successfully
```

### Step 2: Check What Data is Loaded

In the console, type:

```javascript
// This will show you what data the PublicCard component has
console.log('Card data:', data);
console.log('Education:', data.education);
console.log('Awards:', data.awards);
console.log('Products:', data.productsServices);
console.log('Photos:', data.photos);
console.log('Fields Config:', data.card.fields_config);
```

### Step 3: Check Fields Config

The issue might be that `fields_config` doesn't have the IDs for education, awards, products, photos.

Check if these exist:
```javascript
console.log('Education IDs:', data.card.fields_config.educationIds);
console.log('Award IDs:', data.card.fields_config.awardIds);
console.log('Product IDs:', data.card.fields_config.productServiceIds);
console.log('Photo IDs:', data.card.fields_config.photoIds);
```

### Step 4: Check if Data is Being Filtered

The sections only show if:
1. The data exists (education, awards, etc.)
2. The IDs are in fields_config
3. The filtered array has length > 0

Check:
```javascript
const fieldsConfig = data.card.fields_config || {};
const selectedEducation = data.education?.filter(e => fieldsConfig.educationIds?.includes(e.id)) || [];
console.log('Selected Education:', selectedEducation);
```

## Possible Issues

### Issue 1: Fields Config Not Saved

**Problem:** When you created the card, the educationIds, awardIds, etc. weren't saved to fields_config.

**Solution:** Edit the card in Card Creator and make sure you select the education, awards, products, photos checkboxes, then save.

### Issue 2: Data Not Being Fetched

**Problem:** The usePublicCard hook isn't fetching education, awards, products, photos.

**Check:** Look for these console logs:
- "usePublicCard: Education error:"
- "usePublicCard: Awards error:"
- "usePublicCard: Products/Services error:"
- "usePublicCard: Photos error:"

### Issue 3: RLS Policies

**Problem:** Row Level Security might be blocking public access to education, awards, products, photos tables.

**Check:** Go to Supabase Dashboard → Authentication → Policies

Make sure these tables have policies that allow public SELECT:
- education
- awards
- products_services
- photo_gallery

**Fix:** Run this SQL in Supabase:

```sql
-- Allow public read access to education
CREATE POLICY "Public can view education for active cards"
  ON education FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM business_cards WHERE is_active = true
    )
  );

-- Allow public read access to awards
CREATE POLICY "Public can view awards for active cards"
  ON awards FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM business_cards WHERE is_active = true
    )
  );

-- Allow public read access to products_services
CREATE POLICY "Public can view products for active cards"
  ON products_services FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM business_cards WHERE is_active = true
    )
  );

-- Allow public read access to photo_gallery
CREATE POLICY "Public can view photos for active cards"
  ON photo_gallery FOR SELECT
  USING (
    user_id IN (
      SELECT user_id FROM business_cards WHERE is_active = true
    )
  );
```

## Quick Test

### Test 1: Check if Data Exists

1. Go to Supabase Dashboard → Table Editor
2. Check these tables:
   - education (should have your entries)
   - awards (should have your entries)
   - products_services (should have your entries)
   - photo_gallery (should have your entries)

### Test 2: Check Fields Config

1. Go to Supabase Dashboard → Table Editor
2. Open business_cards table
3. Find your card
4. Look at fields_config column
5. It should have:
```json
{
  "educationIds": ["id1", "id2"],
  "awardIds": ["id1", "id2"],
  "productServiceIds": ["id1", "id2"],
  "photoIds": ["id1", "id2"]
}
```

### Test 3: Re-save the Card

1. Go to My Cards
2. Click Edit on your card
3. Make sure education, awards, products, photos checkboxes are selected
4. Click Save
5. Try sharing again

## Most Likely Solution

**The issue is probably that the fields_config doesn't have the IDs saved.**

**Fix:**
1. Go to Card Creator
2. Edit your card
3. Select the checkboxes for education, awards, products, photos
4. Save the card
5. Share and test again

## Console Commands to Debug

Open browser console on the public card page and run:

```javascript
// Get the card data
const cardElement = document.querySelector('[data-card-id]');

// Or check React DevTools
// 1. Install React DevTools extension
// 2. Open DevTools → Components tab
// 3. Find PublicCardContent component
// 4. Check props.data
```

## Summary

The sections ARE in the code and WILL display if:
1. ✅ Data exists in database
2. ✅ IDs are in fields_config
3. ✅ RLS policies allow public read
4. ✅ Arrays have length > 0

**Most likely issue:** Fields config doesn't have the IDs saved. Re-edit and save the card.
