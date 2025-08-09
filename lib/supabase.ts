import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: string;
          preferred_language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: string;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: string;
          preferred_language?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      professors: {
        Row: {
          id: string;
          name: string;
          title_i18n: Record<string, string> | null;
          quote_i18n: Record<string, string> | null;
          bio_i18n: Record<string, string> | null;
          photo_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title_i18n?: Record<string, string> | null;
          quote_i18n?: Record<string, string> | null;
          bio_i18n?: Record<string, string> | null;
          photo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title_i18n?: Record<string, string> | null;
          quote_i18n?: Record<string, string> | null;
          bio_i18n?: Record<string, string> | null;
          photo_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          type: 'event' | 'olympiad';
          name_i18n: Record<string, string>;
          description_i18n: Record<string, string> | null;
          location: string | null;
          starts_at: string;
          ends_at: string | null;
          tags: string[] | null;
          cover_url: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: 'event' | 'olympiad';
          name_i18n: Record<string, string>;
          description_i18n?: Record<string, string> | null;
          location?: string | null;
          starts_at: string;
          ends_at?: string | null;
          tags?: string[] | null;
          cover_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: 'event' | 'olympiad';
          name_i18n?: Record<string, string>;
          description_i18n?: Record<string, string> | null;
          location?: string | null;
          starts_at?: string;
          ends_at?: string | null;
          tags?: string[] | null;
          cover_url?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      professor_of_the_day: {
        Row: {
          id: string;
          name: string;
          title_i18n: Record<string, string> | null;
          quote_i18n: Record<string, string> | null;
          bio_i18n: Record<string, string> | null;
          photo_url: string | null;
          is_active: boolean;
          created_at: string;
        };
      };
    };
  };
}
