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
      counseling_requests: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          phone: string
          date: string
          time: string
          modality: string
          status: string
          message: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          phone: string
          date: string
          time: string
          modality: string
          status?: string
          message?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          phone?: string
          date?: string
          time?: string
          modality?: string
          status?: string
          message?: string | null
        }
      }
      donations: {
        Row: {
          id: number
          created_at: string
          donor_name: string | null
          amount: number
          payment_method: string | null
          status: string
          message: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          donor_name?: string | null
          amount: number
          payment_method?: string | null
          status?: string
          message?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          donor_name?: string | null
          amount?: number
          payment_method?: string | null
          status?: string
          message?: string | null
        }
      }
      gallery: {
        Row: {
          id: number
          created_at: string
          title: string
          category: string
          image_url: string
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          category: string
          image_url: string
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          category?: string
          image_url?: string
        }
      }
      hero_slides: {
        Row: {
          id: number
          created_at: string
          title: string
          subtitle: string
          image_url: string
          cta_text: string
          cta_link: string
          active: boolean
          sort_order: number
        }
        Insert: {
          id?: number
          created_at?: string
          title: string
          subtitle: string
          image_url: string
          cta_text?: string
          cta_link?: string
          active?: boolean
          sort_order?: number
        }
        Update: {
          id?: number
          created_at?: string
          title?: string
          subtitle?: string
          image_url?: string
          cta_text?: string
          cta_link?: string
          active?: boolean
          sort_order?: number
        }
      }
      testimonials: {
        Row: {
          id: number
          created_at: string
          name: string
          role: string
          message: string
          avatar_url: string | null
          rating: number
          active: boolean
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          role: string
          message: string
          avatar_url?: string | null
          rating?: number
          active?: boolean
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          role?: string
          message?: string
          avatar_url?: string | null
          rating?: number
          active?: boolean
        }
      }
      volunteers: {
        Row: {
          id: number
          created_at: string
          name: string
          email: string
          phone: string
          availability: string
          skills: string
          motivation: string
          status: string
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          email: string
          phone: string
          availability: string
          skills: string
          motivation: string
          status?: string
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          email?: string
          phone?: string
          availability?: string
          skills?: string
          motivation?: string
          status?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string
          full_name: string | null
          avatar_url: string | null
          role: string
        }
        Insert: {
          id: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
        }
        Update: {
          id?: string
          updated_at?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
