-- Migration: Add WhatsApp, Company Logo, and Office Hours
-- Run this in Supabase SQL Editor AFTER the initial setup

-- Add WhatsApp to personal_info
ALTER TABLE personal_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Add WhatsApp and Company Logo to professional_info
ALTER TABLE professional_info 
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT,
ADD COLUMN IF NOT EXISTS office_opening_time TIME,
ADD COLUMN IF NOT EXISTS office_closing_time TIME,
ADD COLUMN IF NOT EXISTS office_days TEXT; -- e.g., "Monday-Friday" or "Mon-Sat"

-- Update existing records to have default values (optional)
-- This ensures no null issues with existing data
