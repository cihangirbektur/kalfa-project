export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      atolye_alanlari: {
        Row: {
          ad: string
          amac: string | null
          created_at: string
          id: string
          kategori: string
          kitap_lise_url: string | null
          kitap_ortaokul_url: string | null
          konu_basliklari: Json
          sure_hafta: number
        }
        Insert: {
          ad: string
          amac?: string | null
          created_at?: string
          id?: string
          kategori?: string
          kitap_lise_url?: string | null
          kitap_ortaokul_url?: string | null
          konu_basliklari?: Json
          sure_hafta?: number
        }
        Update: {
          ad?: string
          amac?: string | null
          created_at?: string
          id?: string
          kategori?: string
          kitap_lise_url?: string | null
          kitap_ortaokul_url?: string | null
          konu_basliklari?: Json
          sure_hafta?: number
        }
        Relationships: []
      }
      denetim_bulgulari: {
        Row: {
          created_at: string
          gecti: boolean
          id: string
          ilgili_asama: string | null
          kanit_alintisi: string | null
          kural_no: number
          mesaj: string | null
          plan_id: string | null
          seviye: string
        }
        Insert: {
          created_at?: string
          gecti?: boolean
          id?: string
          ilgili_asama?: string | null
          kanit_alintisi?: string | null
          kural_no: number
          mesaj?: string | null
          plan_id?: string | null
          seviye: string
        }
        Update: {
          created_at?: string
          gecti?: boolean
          id?: string
          ilgili_asama?: string | null
          kanit_alintisi?: string | null
          kural_no?: number
          mesaj?: string | null
          plan_id?: string | null
          seviye?: string
        }
        Relationships: [
          {
            foreignKeyName: "denetim_bulgulari_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planlar"
            referencedColumns: ["id"]
          },
        ]
      }
      geri_bildirimler: {
        Row: {
          created_at: string
          id: string
          not_metni: string | null
          plan_id: string | null
          uygulandi_mi: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          not_metni?: string | null
          plan_id?: string | null
          uygulandi_mi?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          not_metni?: string | null
          plan_id?: string | null
          uygulandi_mi?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "geri_bildirimler_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planlar"
            referencedColumns: ["id"]
          },
        ]
      }
      kazanimlar: {
        Row: {
          atolye_alani: string
          bloom_seviyesi: string
          created_at: string
          id: string
          kategori: string
          kod: string
          metin: string
          yas_grubu: string
        }
        Insert: {
          atolye_alani: string
          bloom_seviyesi: string
          created_at?: string
          id?: string
          kategori?: string
          kod: string
          metin: string
          yas_grubu: string
        }
        Update: {
          atolye_alani?: string
          bloom_seviyesi?: string
          created_at?: string
          id?: string
          kategori?: string
          kod?: string
          metin?: string
          yas_grubu?: string
        }
        Relationships: []
      }
      ogretim_modelleri: {
        Row: {
          ad: string
          asamalar: Json
          created_at: string
          denetim_kurallari: Json
          id: string
        }
        Insert: {
          ad: string
          asamalar?: Json
          created_at?: string
          denetim_kurallari?: Json
          id?: string
        }
        Update: {
          ad?: string
          asamalar?: Json
          created_at?: string
          denetim_kurallari?: Json
          id?: string
        }
        Relationships: []
      }
      planlar: {
        Row: {
          butce: number
          created_at: string
          durum: string
          icerik: Json
          id: string
          kazanim_id: string | null
          model_id: string | null
          ogrenci_sayisi: number
          program_donemi: string
          toplam_sure: number
          versiyon: number
          yas_grubu: string
        }
        Insert: {
          butce?: number
          created_at?: string
          durum?: string
          icerik?: Json
          id?: string
          kazanim_id?: string | null
          model_id?: string | null
          ogrenci_sayisi?: number
          program_donemi?: string
          toplam_sure?: number
          versiyon?: number
          yas_grubu: string
        }
        Update: {
          butce?: number
          created_at?: string
          durum?: string
          icerik?: Json
          id?: string
          kazanim_id?: string | null
          model_id?: string | null
          ogrenci_sayisi?: number
          program_donemi?: string
          toplam_sure?: number
          versiyon?: number
          yas_grubu?: string
        }
        Relationships: [
          {
            foreignKeyName: "planlar_kazanim_id_fkey"
            columns: ["kazanim_id"]
            isOneToOne: false
            referencedRelation: "kazanimlar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planlar_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ogretim_modelleri"
            referencedColumns: ["id"]
          },
        ]
      }
      surumler: {
        Row: {
          created_at: string
          id: string
          plan_id: string | null
          snapshot: Json
          versiyon_no: number
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id?: string | null
          snapshot?: Json
          versiyon_no: number
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string | null
          snapshot?: Json
          versiyon_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "surumler_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "planlar"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
