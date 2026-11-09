export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      account_journals: {
        Row: {
          created_at: string;
          default_credit_account_id: string | null;
          default_debit_account_id: string | null;
          id: string;
          name: string;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          default_credit_account_id?: string | null;
          default_debit_account_id?: string | null;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          default_credit_account_id?: string | null;
          default_debit_account_id?: string | null;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "account_journals_default_credit_account_id_fkey";
            columns: ["default_credit_account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_journals_default_debit_account_id_fkey";
            columns: ["default_debit_account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      account_move_items: {
        Row: {
          account_id: string;
          created_at: string;
          credit: number;
          debit: number;
          id: string;
          move_id: string | null;
          name: string;
          partner_id: string;
          product_id: string | null;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          account_id: string;
          created_at?: string;
          credit?: number;
          debit?: number;
          id?: string;
          move_id?: string | null;
          name: string;
          partner_id: string;
          product_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          account_id?: string;
          created_at?: string;
          credit?: number;
          debit?: number;
          id?: string;
          move_id?: string | null;
          name?: string;
          partner_id?: string;
          product_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "account_move_items_account_id_fkey";
            columns: ["account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_move_items_move_id_fkey";
            columns: ["move_id"];
            isOneToOne: false;
            referencedRelation: "account_moves";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_move_items_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_move_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      account_moves: {
        Row: {
          created_at: string;
          date: string;
          id: string;
          journal_id: string;
          number: string | null;
          partner_id: string;
          status: Database["public"]["Enums"]["account_move_status"];
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          date: string;
          id?: string;
          journal_id: string;
          number?: string | null;
          partner_id: string;
          status?: Database["public"]["Enums"]["account_move_status"];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          date?: string;
          id?: string;
          journal_id?: string;
          number?: string | null;
          partner_id?: string;
          status?: Database["public"]["Enums"]["account_move_status"];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "account_moves_journal_id_fkey";
            columns: ["journal_id"];
            isOneToOne: false;
            referencedRelation: "account_journals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "account_moves_partner_id_fkey";
            columns: ["partner_id"];
            isOneToOne: false;
            referencedRelation: "partners";
            referencedColumns: ["id"];
          },
        ];
      };
      account_subtypes: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          type: Database["public"]["Enums"]["account_types"];
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          type: Database["public"]["Enums"]["account_types"];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          type?: Database["public"]["Enums"]["account_types"];
          updated_at?: string | null;
        };
        Relationships: [];
      };
      accounts: {
        Row: {
          account_subtype_id: string;
          code: string;
          created_at: string;
          id: string;
          name: string;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          account_subtype_id: string;
          code: string;
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          account_subtype_id?: string;
          code?: string;
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "accounts_account_subtype_id_fkey";
            columns: ["account_subtype_id"];
            isOneToOne: false;
            referencedRelation: "account_subtypes";
            referencedColumns: ["id"];
          },
        ];
      };
      partners: {
        Row: {
          created_at: string;
          email: string | null;
          id: string;
          image: string | null;
          name: string;
          nickname: string | null;
          phone: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          email?: string | null;
          id?: string;
          image?: string | null;
          name: string;
          nickname?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          id?: string;
          image?: string | null;
          name?: string;
          nickname?: string | null;
          phone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      product_brands: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      product_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          parent_id: string | null;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_templates: {
        Row: {
          barcode: string | null;
          brand_id: string | null;
          category_id: string | null;
          code: string | null;
          cost_price: number;
          created_at: string;
          default_expense_account_id: string | null;
          default_income_account_id: string | null;
          id: string;
          is_purchase: boolean;
          is_sale: boolean;
          name: string;
          sale_price: number;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          barcode?: string | null;
          brand_id?: string | null;
          category_id?: string | null;
          code?: string | null;
          cost_price?: number;
          created_at?: string;
          default_expense_account_id?: string | null;
          default_income_account_id?: string | null;
          id?: string;
          is_purchase?: boolean;
          is_sale?: boolean;
          name: string;
          sale_price?: number;
          updated_at?: string | null;
        };
        Update: {
          barcode?: string | null;
          brand_id?: string | null;
          category_id?: string | null;
          code?: string | null;
          cost_price?: number;
          created_at?: string;
          default_expense_account_id?: string | null;
          default_income_account_id?: string | null;
          id?: string;
          is_purchase?: boolean;
          is_sale?: boolean;
          name?: string;
          sale_price?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_templates_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "product_brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_templates_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "product_categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_templates_default_expense_account_id_fkey";
            columns: ["default_expense_account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_templates_default_income_account_id_fkey";
            columns: ["default_income_account_id"];
            isOneToOne: false;
            referencedRelation: "accounts";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          barcode: string | null;
          code: string | null;
          cost_price: number;
          created_at: string;
          id: string;
          is_purchase: boolean;
          is_sale: boolean;
          name: string;
          sale_price: number;
          template_id: string | null;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          barcode?: string | null;
          code?: string | null;
          cost_price?: number;
          created_at?: string;
          id?: string;
          is_purchase?: boolean;
          is_sale?: boolean;
          name: string;
          sale_price?: number;
          template_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          barcode?: string | null;
          code?: string | null;
          cost_price?: number;
          created_at?: string;
          id?: string;
          is_purchase?: boolean;
          is_sale?: boolean;
          name?: string;
          sale_price?: number;
          template_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "products_template_id_fkey";
            columns: ["template_id"];
            isOneToOne: false;
            referencedRelation: "product_templates";
            referencedColumns: ["id"];
          },
        ];
      };
      settings: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          key: string;
          updated_at: string | null;
          value: string;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          key: string;
          updated_at?: string | null;
          value: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          key?: string;
          updated_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      user_group_relations: {
        Row: {
          group_id: string;
          user_id: string;
        };
        ComputedFields: never;
        Insert: {
          group_id: string;
          user_id: string;
        };
        Update: {
          group_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_group_relations_group_id_fkey";
            columns: ["group_id"];
            isOneToOne: false;
            referencedRelation: "user_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      user_groups: {
        Row: {
          created_at: string;
          id: string;
          inherit_id: string | null;
          name: string;
          updated_at: string | null;
        };
        ComputedFields: never;
        Insert: {
          created_at?: string;
          id?: string;
          inherit_id?: string | null;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          inherit_id?: string | null;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_groups_inherit_id_fkey";
            columns: ["inherit_id"];
            isOneToOne: false;
            referencedRelation: "user_groups";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_account_move: { Args: { p_values: Json }; Returns: Json };
      has_access: {
        Args: { p_action: string; p_table: string };
        Returns: boolean;
      };
      has_group: { Args: { p_name: string }; Returns: boolean };
      post_account_move: { Args: { p_id: string }; Returns: Json };
      update_account_move: {
        Args: { p_id: string; p_values: Json };
        Returns: Json;
      };
    };
    Enums: {
      account_move_status: "draft" | "posted";
      account_types: "asset" | "liability" | "equity" | "income" | "expense";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      account_move_status: ["draft", "posted"],
      account_types: ["asset", "liability", "equity", "income", "expense"],
    },
  },
} as const;
