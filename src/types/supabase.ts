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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attendance_records: {
        Row: {
          date: string
          employee_id: string | null
          id: string
          status: string
          time_in: string | null
          time_out: string | null
          total_hours: number | null
        }
        Insert: {
          date: string
          employee_id?: string | null
          id: string
          status: string
          time_in?: string | null
          time_out?: string | null
          total_hours?: number | null
        }
        Update: {
          date?: string
          employee_id?: string | null
          id?: string
          status?: string
          time_in?: string | null
          time_out?: string | null
          total_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string
          birth_date: string
          department: string
          email: string
          emergency_contact: string
          gender: string
          id: string
          initials: string
          join_date: string
          name: string
          phone: string
          position: string
          salary: number
          status: string
        }
        Insert: {
          address: string
          birth_date: string
          department: string
          email: string
          emergency_contact: string
          gender: string
          id: string
          initials: string
          join_date: string
          name: string
          phone: string
          position: string
          salary: number
          status: string
        }
        Update: {
          address?: string
          birth_date?: string
          department?: string
          email?: string
          emergency_contact?: string
          gender?: string
          id?: string
          initials?: string
          join_date?: string
          name?: string
          phone?: string
          position?: string
          salary?: number
          status?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          emergency_leave: number
          emergency_used: number
          employee_id: string
          sick_leave: number
          sick_used: number
          vacation_leave: number
          vacation_used: number
        }
        Insert: {
          emergency_leave: number
          emergency_used: number
          employee_id: string
          sick_leave: number
          sick_used: number
          vacation_leave: number
          vacation_used: number
        }
        Update: {
          emergency_leave?: number
          emergency_used?: number
          employee_id?: string
          sick_leave?: number
          sick_used?: number
          vacation_leave?: number
          vacation_used?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          applied_date: string
          days: number
          department: string
          employee_id: string | null
          employee_name: string
          end_date: string
          id: string
          leave_type: string
          reason: string
          start_date: string
          status: string
        }
        Insert: {
          applied_date: string
          days: number
          department: string
          employee_id?: string | null
          employee_name: string
          end_date: string
          id: string
          leave_type: string
          reason: string
          start_date: string
          status: string
        }
        Update: {
          applied_date?: string
          days?: number
          department?: string
          employee_id?: string | null
          employee_name?: string
          end_date?: string
          id?: string
          leave_type?: string
          reason?: string
          start_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          basic_salary: number
          department: string
          employee_id: string | null
          employee_name: string
          gross_pay: number
          id: string
          net_pay: number
          overtime: number
          pagibig: number
          period: string
          philhealth: number
          sss: number
          status: string
          tax: number
          total_deductions: number
        }
        Insert: {
          basic_salary: number
          department: string
          employee_id?: string | null
          employee_name: string
          gross_pay: number
          id: string
          net_pay: number
          overtime: number
          pagibig: number
          period: string
          philhealth: number
          sss: number
          status: string
          tax: number
          total_deductions: number
        }
        Update: {
          basic_salary?: number
          department?: string
          employee_id?: string | null
          employee_name?: string
          gross_pay?: number
          id?: string
          net_pay?: number
          overtime?: number
          pagibig?: number
          period?: string
          philhealth?: number
          sss?: number
          status?: string
          tax?: number
          total_deductions?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_evaluations: {
        Row: {
          attendance_rating: number
          comments: string
          communication_rating: number
          date: string
          department: string
          employee_id: string | null
          employee_name: string
          evaluator: string
          id: string
          initiative_rating: number
          overall_rating: number
          period: string
          productivity_rating: number
          teamwork_rating: number
        }
        Insert: {
          attendance_rating: number
          comments: string
          communication_rating: number
          date: string
          department: string
          employee_id?: string | null
          employee_name: string
          evaluator: string
          id: string
          initiative_rating: number
          overall_rating: number
          period: string
          productivity_rating: number
          teamwork_rating: number
        }
        Update: {
          attendance_rating?: number
          comments?: string
          communication_rating?: number
          date?: string
          department?: string
          employee_id?: string | null
          employee_name?: string
          evaluator?: string
          id?: string
          initiative_rating?: number
          overall_rating?: number
          period?: string
          productivity_rating?: number
          teamwork_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
