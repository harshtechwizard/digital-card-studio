# Implementation Steps - New Features

## ✅ What I've Done:

1. **Updated Database Types** (`src/types/database.ts`)
   - Added WhatsApp fields
   - Added company logo URL
   - Added office hours fields

2. **Created Migration SQL** (`supabase-migration-add-fields.sql`)
   - Ready to run in Supabase

3. **Created Business Card Preview Component** (`src/components/BusinessCardPreview.tsx`)
   - Company logo background (faded)
   - Profile photo in center
   - Smooth animations
   - WhatsApp buttons
   - Social media icons
   - Office hours display

4. **Added CSS Animations** (`src/index.css`)
   - Fade-in animation
   - Slide-up animation
   - Scale-in animation

## 🔧 What YOU Need to Do:

### Step 1: Run Database Migration

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase-migration-add-fields.sql`
4. Click "Run"

```sql
-- The migration adds these columns:
-- personal_info: whatsapp_number
-- professional_info: whatsapp_number, company_logo_url, office_opening_time, office_closing_time, office_days
```

### Step 2: Update Profile Page

Add WhatsApp field to personal info form (around line 180):

```tsx
<div>
  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
  <Input
    id="whatsappNumber"
    type="tel"
    value={personalForm.whatsapp_number}
    onChange={(e) => setPersonalForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
    placeholder="+1 (555) 123-4567"
  />
</div>
```

Add these fields to professional info form (around line 250):

```tsx
<div>
  <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
  <Input
    id="whatsappNumber"
    type="tel"
    value={professionalForm.whatsapp_number}
    onChange={(e) => setProfessionalForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
    placeholder="+1 (555) 123-4567"
  />
</div>

<div>
  <Label htmlFor="companyLogo">Company Logo URL</Label>
  <Input
    id="companyLogo"
    type="url"
    value={professionalForm.company_logo_url}
    onChange={(e) => setProfessionalForm(prev => ({ ...prev, company_logo_url: e.target.value }))}
    placeholder="https://example.com/logo.png"
  />
</div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="openingTime">Opening Time</Label>
    <Input
      id="openingTime"
      type="time"
      value={professionalForm.office_opening_time}
      onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_opening_time: e.target.value }))}
    />
  </div>
  <div>
    <Label htmlFor="closingTime">Closing Time</Label>
    <Input
      id="closingTime"
      type="time"
      value={professionalForm.office_closing_time}
      onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_closing_time: e.target.value }))}
    />
  </div>
</div>

<div>
  <Label htmlFor="officeDays">Office Days</Label>
  <Input
    id="officeDays"
    value={professionalForm.office_days}
    onChange={(e) => setProfessionalForm(prev => ({ ...prev, office_days: e.target.value }))}
    placeholder="Monday-Friday"
  />
</div>
```

### Step 3: Update Card Creator

Add WhatsApp checkbox (around line 200):

```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="whatsapp_number"
    checked={selectedFields.whatsapp_number}
    onCheckedChange={(checked) => setSelectedFields(prev => ({ ...prev, whatsapp_number: checked as boolean }))}
  />
  <Label htmlFor="whatsapp_number" className="cursor-pointer">
    WhatsApp Number {personalInfo?.whatsapp_number && <span className="text-muted-foreground">({personalInfo.whatsapp_number})</span>}
  </Label>
</div>
```

### Step 4: Update Public Card Page

Replace the entire card display section with the new preview component:

```tsx
import { BusinessCardPreview } from '@/components/BusinessCardPreview';

// In the return statement:
<BusinessCardPreview
  personalInfo={personalInfo}
  professionalInfo={professionalInfo}
  fieldsConfig={fieldsConfig}
/>
```

### Step 5: Add Preview to Card Creator

Add live preview while creating:

```tsx
import { BusinessCardPreview } from '@/components/BusinessCardPreview';

// Add this in the CardCreator page:
<div className="grid md:grid-cols-2 gap-6">
  <div>
    {/* Existing form fields */}
  </div>
  <div className="sticky top-4">
    <h3 className="text-lg font-semibold mb-4">Preview</h3>
    <BusinessCardPreview
      personalInfo={personalInfo}
      professionalInfo={professionalInfo}
      fieldsConfig={selectedFields}
    />
  </div>
</div>
```

## 🎨 Features You'll Get:

1. ✅ WhatsApp click-to-chat buttons
2. ✅ Company logo as background watermark
3. ✅ Profile photo in center with border
4. ✅ Smooth fade-in animations
5. ✅ Hover effects on buttons
6. ✅ Office hours display
7. ✅ Social media icons (Instagram, Facebook, LinkedIn)
8. ✅ Responsive design
9. ✅ Dark mode support
10. ✅ Real-time preview while creating cards

## 📱 WhatsApp Integration:

When someone clicks the WhatsApp button:
- Opens WhatsApp Web/App
- Pre-fills the number
- Ready to send message

Format: `https://wa.me/1234567890`

## 🎯 Testing Checklist:

- [ ] Run migration in Supabase
- [ ] Add WhatsApp number in profile
- [ ] Add company logo URL
- [ ] Set office hours
- [ ] Create a new business card
- [ ] Check WhatsApp field in card creator
- [ ] View public card
- [ ] Test WhatsApp button
- [ ] Test animations
- [ ] Test on mobile

## 🚀 Quick Start:

```bash
# 1. Run migration in Supabase (copy supabase-migration-add-fields.sql)

# 2. Restart your dev server
npm run dev

# 3. Go to Profile page and add:
#    - WhatsApp number
#    - Company logo URL
#    - Office hours

# 4. Create a new card and see the preview!
```

## 💡 Tips:

- Use a transparent PNG for company logo (looks better as background)
- WhatsApp number should include country code (e.g., +1234567890)
- Office hours are optional (won't show if not set)
- Preview updates in real-time as you select fields

Need help with any step? Let me know! 🎉
