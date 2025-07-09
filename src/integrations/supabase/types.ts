export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          altura_cm: number | null
          circunferencia_abdomen_cm: number | null
          circunferencia_braco_cm: number | null
          circunferencia_cintura_cm: number | null
          circunferencia_quadril_cm: number | null
          created_at: string
          data_avaliacao: string
          gordura_visceral: number | null
          id: string
          idade_metabolica: number | null
          imc: number | null
          massa_muscular_kg: number | null
          observacoes: string | null
          paciente_id: string
          percentual_gordura: number | null
          peso_kg: number | null
        }
        Insert: {
          altura_cm?: number | null
          circunferencia_abdomen_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_cintura_cm?: number | null
          circunferencia_quadril_cm?: number | null
          created_at?: string
          data_avaliacao: string
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          observacoes?: string | null
          paciente_id: string
          percentual_gordura?: number | null
          peso_kg?: number | null
        }
        Update: {
          altura_cm?: number | null
          circunferencia_abdomen_cm?: number | null
          circunferencia_braco_cm?: number | null
          circunferencia_cintura_cm?: number | null
          circunferencia_quadril_cm?: number | null
          created_at?: string
          data_avaliacao?: string
          gordura_visceral?: number | null
          id?: string
          idade_metabolica?: number | null
          imc?: number | null
          massa_muscular_kg?: number | null
          observacoes?: string | null
          paciente_id?: string
          percentual_gordura?: number | null
          peso_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      Cadastro_cliente: {
        Row: {
          created_at: string
          email: string | null
          id: number
          nome: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          nome?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          active: boolean | null
          bot_message: string | null
          conversation_id: string | null
          created_at: string | null
          data: string | null
          id: number
          message_type: string | null
          phone: string | null
          user_message: string | null
        }
        Insert: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Update: {
          active?: boolean | null
          bot_message?: string | null
          conversation_id?: string | null
          created_at?: string | null
          data?: string | null
          id?: number
          message_type?: string | null
          phone?: string | null
          user_message?: string | null
        }
        Relationships: []
      }
      configuracoes_clinica: {
        Row: {
          crn: string | null
          email: string | null
          endereco: string | null
          especialidade: string | null
          id: string
          logo_url: string | null
          nome_clinica: string | null
          nome_profissional: string | null
          telefone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          crn?: string | null
          email?: string | null
          endereco?: string | null
          especialidade?: string | null
          id?: string
          logo_url?: string | null
          nome_clinica?: string | null
          nome_profissional?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          crn?: string | null
          email?: string | null
          endereco?: string | null
          especialidade?: string | null
          id?: string
          logo_url?: string | null
          nome_clinica?: string | null
          nome_profissional?: string | null
          telefone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consultas: {
        Row: {
          created_at: string
          data_consulta: string
          duracao_minutos: number | null
          id: string
          observacoes: string | null
          paciente_id: string | null
          status: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          data_consulta: string
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          paciente_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          data_consulta?: string
          duracao_minutos?: number | null
          id?: string
          observacoes?: string | null
          paciente_id?: string | null
          status?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultas_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          active: boolean | null
          app: string | null
          bairro: string | null
          city: string | null
          cliente_name: string | null
          complemento: string | null
          cpf: string | null
          created_at: string
          distance: string | null
          email: string | null
          id: number
          lat: string | null
          location: string | null
          long: string | null
          phone: string | null
          street_name: string | null
          street_number: string | null
          uf: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          active?: boolean | null
          app?: string | null
          bairro?: string | null
          city?: string | null
          cliente_name?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          distance?: string | null
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
          street_name?: string | null
          street_number?: string | null
          uf?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          active?: boolean | null
          app?: string | null
          bairro?: string | null
          city?: string | null
          cliente_name?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string
          distance?: string | null
          email?: string | null
          id?: number
          lat?: string | null
          location?: string | null
          long?: string | null
          phone?: string | null
          street_name?: string | null
          street_number?: string | null
          uf?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      dados_cliente: {
        Row: {
          asaas_customer_id: string | null
          cpf_cnpj: string | null
          created_at: string | null
          email: string | null
          id: number
          nome: string | null
          nome_pet: string | null
          payments: Json | null
          porte_pet: string | null
          raca_pet: string | null
          sessionid: string | null
          telefone: string | null
        }
        Insert: {
          asaas_customer_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          nome_pet?: string | null
          payments?: Json | null
          porte_pet?: string | null
          raca_pet?: string | null
          sessionid?: string | null
          telefone?: string | null
        }
        Update: {
          asaas_customer_id?: string | null
          cpf_cnpj?: string | null
          created_at?: string | null
          email?: string | null
          id?: number
          nome?: string | null
          nome_pet?: string | null
          payments?: Json | null
          porte_pet?: string | null
          raca_pet?: string | null
          sessionid?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      dinastia_mensagens: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
          titulo: string | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
          titulo?: string | null
        }
        Relationships: []
      }
      estoque: {
        Row: {
          created_at: string
          data_validade: string | null
          id: string
          lote: string | null
          preco_custo: number | null
          produto_id: string | null
          quantidade: number
          quantidade_minima: number | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_validade?: string | null
          id?: string
          lote?: string | null
          preco_custo?: number | null
          produto_id?: string | null
          quantidade?: number
          quantidade_minima?: number | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_validade?: string | null
          id?: string
          lote?: string | null
          preco_custo?: number | null
          produto_id?: string | null
          quantidade?: number
          quantidade_minima?: number | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          cargo: string
          created_at: string
          data_admissao: string
          email: string
          id: string
          nome: string
          salario: number
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          cargo: string
          created_at?: string
          data_admissao: string
          email: string
          id?: string
          nome: string
          salario?: number
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          cargo?: string
          created_at?: string
          data_admissao?: string
          email?: string
          id?: string
          nome?: string
          salario?: number
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      imagens_drive: {
        Row: {
          created_at: string | null
          drive_id: string
          id: number
          nome: string
        }
        Insert: {
          created_at?: string | null
          drive_id: string
          id?: number
          nome: string
        }
        Update: {
          created_at?: string | null
          drive_id?: string
          id?: number
          nome?: string
        }
        Relationships: []
      }
      itens_refeicao: {
        Row: {
          alimento: string
          id: string
          observacoes: string | null
          quantidade: string | null
          refeicao_id: string
        }
        Insert: {
          alimento: string
          id?: string
          observacoes?: string | null
          quantidade?: string | null
          refeicao_id: string
        }
        Update: {
          alimento?: string
          id?: string
          observacoes?: string | null
          quantidade?: string | null
          refeicao_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itens_refeicao_refeicao_id_fkey"
            columns: ["refeicao_id"]
            isOneToOne: false
            referencedRelation: "refeicoes"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_chat_histories: {
        Row: {
          data: string | null
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          data?: string | null
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          data?: string | null
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      pacientes: {
        Row: {
          avatar_url: string | null
          created_at: string
          data_nascimento: string | null
          email: string
          genero: string | null
          id: string
          nome: string
          objetivo: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          data_nascimento?: string | null
          email: string
          genero?: string | null
          id?: string
          nome: string
          objetivo?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string
          genero?: string | null
          id?: string
          nome?: string
          objetivo?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      pausa_bot: {
        Row: {
          created_at: string
          id: number
          number: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          number?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          number?: string | null
          status?: string | null
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          cliente_nome: string | null
          cliente_telefone: string | null
          created_at: string
          data_entrega: string | null
          id: string
          items: Json
          observacoes: string | null
          status: string | null
          tipo: string | null
          updated_at: string
          valor_total: number
        }
        Insert: {
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          data_entrega?: string | null
          id?: string
          items?: Json
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          valor_total?: number
        }
        Update: {
          cliente_nome?: string | null
          cliente_telefone?: string | null
          created_at?: string
          data_entrega?: string | null
          id?: string
          items?: Json
          observacoes?: string | null
          status?: string | null
          tipo?: string | null
          updated_at?: string
          valor_total?: number
        }
        Relationships: []
      }
      planos_nutricionais: {
        Row: {
          calorias_diarias: number | null
          created_at: string
          data_fim: string | null
          data_inicio: string | null
          id: string
          objetivo: string | null
          observacoes: string | null
          paciente_id: string
          titulo: string
        }
        Insert: {
          calorias_diarias?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          objetivo?: string | null
          observacoes?: string | null
          paciente_id: string
          titulo: string
        }
        Update: {
          calorias_diarias?: number | null
          created_at?: string
          data_fim?: string | null
          data_inicio?: string | null
          id?: string
          objetivo?: string | null
          observacoes?: string | null
          paciente_id?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "planos_nutricionais_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          descricao: string | null
          id: string
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          preco?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      prontuarios: {
        Row: {
          altura_cm: number | null
          consulta_id: string | null
          created_at: string
          data_registro: string
          id: string
          massa_muscular_kg: number | null
          observacoes_medicas: string | null
          paciente_id: string | null
          percentual_gordura: number | null
          peso_kg: number | null
          recomendacoes: string | null
        }
        Insert: {
          altura_cm?: number | null
          consulta_id?: string | null
          created_at?: string
          data_registro: string
          id?: string
          massa_muscular_kg?: number | null
          observacoes_medicas?: string | null
          paciente_id?: string | null
          percentual_gordura?: number | null
          peso_kg?: number | null
          recomendacoes?: string | null
        }
        Update: {
          altura_cm?: number | null
          consulta_id?: string | null
          created_at?: string
          data_registro?: string
          id?: string
          massa_muscular_kg?: number | null
          observacoes_medicas?: string | null
          paciente_id?: string | null
          percentual_gordura?: number | null
          peso_kg?: number | null
          recomendacoes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prontuarios_consulta_id_fkey"
            columns: ["consulta_id"]
            isOneToOne: false
            referencedRelation: "consultas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prontuarios_paciente_id_fkey"
            columns: ["paciente_id"]
            isOneToOne: false
            referencedRelation: "pacientes"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase: {
        Row: {
          created_at: string
          description: string | null
          frete: string | null
          id: number
          invoiceNumber: string | null
          pay: boolean
          phone: string | null
          qrcode: string | null
          servico_frete: string | null
          url_qrcode: string | null
          value: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          frete?: string | null
          id?: number
          invoiceNumber?: string | null
          pay?: boolean
          phone?: string | null
          qrcode?: string | null
          servico_frete?: string | null
          url_qrcode?: string | null
          value: string
        }
        Update: {
          created_at?: string
          description?: string | null
          frete?: string | null
          id?: number
          invoiceNumber?: string | null
          pay?: boolean
          phone?: string | null
          qrcode?: string | null
          servico_frete?: string | null
          url_qrcode?: string | null
          value?: string
        }
        Relationships: []
      }
      refeicoes: {
        Row: {
          horario: string | null
          id: string
          nome: string
          ordem: number | null
          plano_id: string
        }
        Insert: {
          horario?: string | null
          id?: string
          nome: string
          ordem?: number | null
          plano_id: string
        }
        Update: {
          horario?: string | null
          id?: string
          nome?: string
          ordem?: number | null
          plano_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refeicoes_plano_id_fkey"
            columns: ["plano_id"]
            isOneToOne: false
            referencedRelation: "planos_nutricionais"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string | null
          created_at: string
          descricao: string | null
          duracao_minutos: number | null
          id: string
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          nome: string
          preco?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          duracao_minutos?: number | null
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      tokens: {
        Row: {
          CachedTokens: string | null
          CompletionTokens: string | null
          CostUSD: number | null
          id: number
          Input: string | null
          Output: string | null
          PromptTokens: string | null
          Timestamp: string
          Workflow: string | null
        }
        Insert: {
          CachedTokens?: string | null
          CompletionTokens?: string | null
          CostUSD?: number | null
          id?: number
          Input?: string | null
          Output?: string | null
          PromptTokens?: string | null
          Timestamp?: string
          Workflow?: string | null
        }
        Update: {
          CachedTokens?: string | null
          CompletionTokens?: string | null
          CostUSD?: number | null
          id?: number
          Input?: string | null
          Output?: string | null
          PromptTokens?: string | null
          Timestamp?: string
          Workflow?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
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
