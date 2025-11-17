-- Digital Business Card MVP - Database Setup
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Personal Information Table
CREATE TABLE personal_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  primary_email TEXT,
  secondary_email TEXT,
  mobile_number TEXT,
  phone_number TEXT,
  home_address JSONB,
  bio TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  profile_photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professional Information Table
CREATE TABLE professional_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  designation TEXT,
  company_name TEXT,
  company_website TEXT,
  office_address JSONB,
  office_email TEXT,
  office_phone TEXT,
  department TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  linkedin_url TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Education Table
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  degree_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  year_completed INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Awards Table
CREATE TABLE awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  issuing_org TEXT NOT NULL,
  date_received DATE,
  expiry_date DATE,
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products & Services Table
CREATE TABLE products_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  photo_url TEXT,
  website_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photo Gallery Table
CREATE TABLE photo_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Cards Table (CORE MVP)
CREATE TABLE business_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  template_type TEXT,
  fields_config JSONB,
  design_config JSONB,
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Card Analytics Table (CORE MVP)
CREATE TABLE card_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id UUID REFERENCES business_cards(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE products_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE photo_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Private Data (personal_info, professional_info, etc.)
CREATE POLICY "Users can manage their own personal info"
  ON personal_info FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own professional info"
  ON professional_info FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own education"
  ON education FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own awards"
  ON awards FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own products/services"
  ON products_services FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own photo gallery"
  ON photo_gallery FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for Business Cards (Special: Public READ, Private CUD)
CREATE POLICY "Anyone can view active business cards"
  ON business_cards FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can manage their own cards"
  ON business_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON business_cards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON business_cards FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy for Card Analytics (Anyone can insert, only owner can read)
CREATE POLICY "Anyone can insert analytics"
  ON card_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Card owners can view their analytics"
  ON card_analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM business_cards
      WHERE business_cards.id = card_analytics.card_id
      AND business_cards.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_business_cards_slug ON business_cards(slug);
CREATE INDEX idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX idx_card_analytics_card_id ON card_analytics(card_id);
CREATE INDEX idx_personal_info_user_id ON personal_info(user_id);
CREATE INDEX idx_professional_info_user_id ON professional_info(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_info_updated_at BEFORE UPDATE ON professional_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_business_cards_updated_at BEFORE UPDATE ON business_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
