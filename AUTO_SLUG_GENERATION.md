# Auto-Generated Unique Slugs

## Overview

Card slugs are now **automatically generated** from the card name. Users no longer need to manually create slugs, and the system ensures uniqueness automatically.

## What Changed

### Before ❌
- Users had to manually type the slug
- Could create duplicate slugs (causing errors)
- Confusing for users
- Extra step in card creation

### After ✅
- Slug auto-generates from card name
- Automatically ensures uniqueness
- Read-only field (can't be edited)
- One less thing for users to worry about

## How It Works

### 1. Slug Generation
When a user types a card name, the slug is automatically generated:

```
Card Name: "John Doe Personal"
Generated Slug: "john-doe-personal"
```

### 2. Global Uniqueness Check
The system checks the **entire database** (all users) to ensure uniqueness:

```
User A creates: "john-doe-personal"
User B tries same name: "john-doe-personal-1" (auto-incremented)
User C tries same name: "john-doe-personal-2" (auto-incremented)
```

**Important**: Slugs are globally unique across ALL users, not just per-user.

### 3. Real-Time Updates
- Slug updates as user types the card name
- Shows loading indicator while generating
- Displays the full URL preview

## Technical Implementation

### Auto-Generation Logic
```typescript
useEffect(() => {
  if (cardName && !id) { // Only for new cards
    const generateSlug = async () => {
      const baseSlug = slugify(cardName);
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Check if slug exists GLOBALLY in database
      let slugExists = true;
      while (slugExists) {
        const { data } = await supabase
          .from('business_cards')
          .select('slug')
          .eq('slug', finalSlug)
          .maybeSingle();
        
        if (data) {
          // Slug exists globally, try next one
          finalSlug = `${baseSlug}-${counter}`;
          counter++;
        } else {
          // Slug is available
          slugExists = false;
        }
      }
      
      setSlug(finalSlug);
    };
    
    generateSlug();
  }
}, [cardName, id]);
```

### Save Logic
```typescript
const handleSave = async () => {
  let finalSlug = slug;
  
  // For new cards, ensure slug is unique GLOBALLY
  if (!id) {
    const baseSlug = slugify(cardName);
    finalSlug = baseSlug;
    let counter = 1;
    
    // Check database for global uniqueness
    let slugExists = true;
    while (slugExists) {
      const { data } = await supabase
        .from('business_cards')
        .select('slug')
        .eq('slug', finalSlug)
        .maybeSingle();
      
      if (data) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      } else {
        slugExists = false;
      }
    }
  }
  
  await addCard({ name: cardName, slug: finalSlug, ... });
};
```

## UI Changes

### Slug Input Field
```tsx
<Label>Card URL (Auto-generated)</Label>
<Input
  value={slug}
  readOnly
  disabled
  className="bg-muted cursor-not-allowed"
  placeholder="Will be generated from card name..."
/>
<p className="text-sm text-muted-foreground">
  Your card will be available at: /card/{slug}
</p>
```

### Features:
- ✅ Read-only (can't be edited)
- ✅ Disabled styling (grayed out)
- ✅ Loading indicator while generating
- ✅ Full URL preview
- ✅ Clear messaging

## User Experience

### Creating a Card

1. **User enters card name**: "My Business Card"
2. **Slug auto-generates**: "my-business-card"
3. **URL preview shows**: `yoursite.com/card/my-business-card`
4. **User clicks save**: Card created with unique slug

### If Slug Exists

1. **User enters card name**: "My Business Card"
2. **System checks**: "my-business-card" already exists
3. **Slug becomes**: "my-business-card-1"
4. **URL preview updates**: `yoursite.com/card/my-business-card-1`

### Editing a Card

- Slug remains unchanged when editing
- Only card name and fields can be updated
- Prevents breaking existing shared links

## Benefits

### For Users
✅ **Simpler** - One less field to fill
✅ **Faster** - No thinking about URLs
✅ **Error-free** - No duplicate slug errors
✅ **Automatic** - Just works

### For System
✅ **Unique** - Guaranteed unique slugs
✅ **Consistent** - Predictable URL format
✅ **Maintainable** - Less user error
✅ **Scalable** - Handles any number of cards

## Edge Cases Handled

### 1. Special Characters
```
Input: "John's Card #1!"
Output: "johns-card-1"
```

### 2. Multiple Spaces
```
Input: "My    Business    Card"
Output: "my-business-card"
```

### 3. Leading/Trailing Spaces
```
Input: "  My Card  "
Output: "my-card"
```

### 4. Numbers
```
Input: "Card 2024"
Output: "card-2024"
```

### 5. Duplicate Names
```
First: "Business Card" → "business-card"
Second: "Business Card" → "business-card-1"
Third: "Business Card" → "business-card-2"
```

## Validation

### Slug Format
- Lowercase letters only
- Numbers allowed
- Hyphens for spaces
- No special characters
- No leading/trailing hyphens

### Regex Pattern
```typescript
/^[a-z0-9]+(?:-[a-z0-9]+)*$/
```

## Database

### Unique Constraint
The database should have a unique constraint on the slug column:

```sql
ALTER TABLE business_cards 
ADD CONSTRAINT unique_slug UNIQUE (slug);
```

This ensures database-level uniqueness as well.

## Testing

### Test Cases

1. **Basic Generation**
   - Input: "Test Card"
   - Expected: "test-card"

2. **Duplicate Handling**
   - Create "Test Card" → "test-card"
   - Create "Test Card" again → "test-card-1"
   - Create "Test Card" again → "test-card-2"

3. **Special Characters**
   - Input: "John's Card!"
   - Expected: "johns-card"

4. **Edit Existing**
   - Edit card name
   - Slug should NOT change
   - Preserves existing URLs

5. **Empty Name**
   - Input: ""
   - Expected: Validation error

## Migration Notes

### Existing Cards
- Existing cards keep their current slugs
- Only new cards get auto-generated slugs
- No migration needed

### User Communication
- Update help text to explain auto-generation
- Remove any documentation about manual slugs
- Update tutorials/guides

## Future Enhancements

Potential improvements:
- [ ] Allow custom slug override (advanced users)
- [ ] Slug preview before saving
- [ ] Slug history/analytics
- [ ] Custom slug patterns
- [ ] Vanity URLs

## Summary

Slugs are now automatically generated from card names with guaranteed uniqueness. This simplifies the card creation process and eliminates user errors. The system handles all edge cases and provides clear feedback through the UI.

**Status**: ✅ **Implemented and Working**
