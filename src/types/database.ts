export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      personal_info: {
        Row: {
          id: string
          user_id: string
          full_name: string
          date_of_birth: string | null
          primary_email: string | null
          secondary_email: string | null
          mobile_number: string | null
          phone_number: string | null
          whatsapp_number: string | null
          home_address: Json | null
          bio: string | null
          instagram_url: string | null
          facebook_url: string | null
          linkedin_url: string | null
          profile_photo_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name: string
          date_of_birth?: string | null
          primary_email?: string | null
          secondary_email?: string | null
          mobile_number?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          home_address?: Json | null
          bio?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          linkedin_url?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          date_of_birth?: string | null
          primary_email?: string | null
          secondary_email?: string | null
          mobile_number?: string | null
          phone_number?: string | null
          whatsapp_number?: string | null
          home_address?: Json | null
          bio?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          linkedin_url?: string | null
          profile_photo_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      professional_info: {
        Row: {
          id: string
          user_id: string
          designation: string | null
          company_name: string | null
          company_website: string | null
          company_logo_url: string | null
          office_address: Json | null
          office_email: string | null
          office_phone: string | null
          whatsapp_number: string | null
          department: string | null
          office_opening_time: string | null
          office_closing_time: string | null
          office_days: string | null
          instagram_url: string | null
          facebook_url: string | null
          linkedin_url: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          designation?: string | null
          company_name?: string | null
          company_website?: string | null
          company_logo_url?: string | null
          office_address?: Json | null
          office_email?: string | null
          office_phone?: string | null
          whatsapp_number?: string | null
          department?: string | null
          office_opening_time?: string | null
          office_closing_time?: string | null
          office_days?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          linkedin_url?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          designation?: string | null
          company_name?: string | null
          company_website?: string | null
          company_logo_url?: string | null
          office_address?: Json | null
          office_email?: string | null
          office_phone?: string | null
          whatsapp_number?: string | null
          department?: string | null
          office_opening_time?: string | null
          office_closing_time?: string | null
          office_days?: string | null
          instagram_url?: string | null
          facebook_url?: string | null
          linkedin_url?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
          id: string
          user_id: string
          degree_name: string
          institution: string
          year_completed: number | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          degree_name: string
          institution: string
          year_completed?: number | null
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          degree_name?: string
          institution?: string
          year_completed?: number | null
          description?: string | null
          created_at?: string
        }
      }
      awards: {
        Row: {
          id: string
          user_id: string
          title: string
          issuing_org: string
          date_received: string | null
          expiry_date: string | null
          certificate_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          issuing_org: string
          date_received?: string | null
          expiry_date?: string | null
          certificate_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          issuing_org?: string
          date_received?: string | null
          expiry_date?: string | null
          certificate_url?: string | null
          created_at?: string
        }
      }
      products_services: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          category: string | null
          photo_url: string | null
          website_link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          category?: string | null
          photo_url?: string | null
          website_link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          category?: string | null
          photo_url?: string | null
          website_link?: string | null
          created_at?: string
        }
      }
      photo_gallery: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          caption: string | null
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          photo_url: string
          caption?: string | null
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string
          caption?: string | null
          display_order?: number | null
          created_at?: string
        }
      }
      business_cards: {
        Row: {
          id: string
          user_id: string
          name: string
          slug: string
          template_type: string | null
          fields_config: Json | null
          design_config: Json | null
          is_default: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          slug: string
          template_type?: string | null
          fields_config?: Json | null
          design_config?: Json | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          slug?: string
          template_type?: string | null
          fields_config?: Json | null
          design_config?: Json | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      card_analytics: {
        Row: {
          id: string
          card_id: string
          viewed_at: string
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
        }
        Insert: {
          id?: string
          card_id: string
          viewed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
        Update: {
          id?: string
          card_id?: string
          viewed_at?: string
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
        }
      }
    }
  }
}
