
-- Criar tabela de vendas para rastrear transações
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id BIGINT REFERENCES public.dados_cliente(id),
  tipo VARCHAR NOT NULL CHECK (tipo IN ('produto', 'servico')),
  item_id UUID, -- Referência para produtos ou serviços
  item_nome VARCHAR NOT NULL,
  quantidade INTEGER NOT NULL DEFAULT 1,
  valor_unitario NUMERIC NOT NULL,
  valor_total NUMERIC NOT NULL,
  desconto NUMERIC DEFAULT 0,
  metodo_pagamento VARCHAR,
  status VARCHAR NOT NULL DEFAULT 'concluida' CHECK (status IN ('pendente', 'concluida', 'cancelada')),
  data_venda TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações
CREATE POLICY "Allow all operations on vendas" 
ON public.vendas 
FOR ALL 
USING (true);

-- Criar trigger para atualizar timestamps
CREATE TRIGGER update_vendas_updated_at
  BEFORE UPDATE ON public.vendas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de relatórios personalizados
CREATE TABLE public.relatorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR NOT NULL,
  tipo VARCHAR NOT NULL CHECK (tipo IN ('clientes', 'vendas', 'produtos', 'servicos', 'funcionarios', 'geral')),
  filtros JSONB,
  colunas JSONB NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  criado_por VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir todas as operações
CREATE POLICY "Allow all operations on relatorios" 
ON public.relatorios 
FOR ALL 
USING (true);

-- Criar trigger para atualizar timestamps
CREATE TRIGGER update_relatorios_updated_at
  BEFORE UPDATE ON public.relatorios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir alguns dados de exemplo de vendas
INSERT INTO public.vendas (cliente_id, tipo, item_nome, quantidade, valor_unitario, valor_total, metodo_pagamento, data_venda)
SELECT 
  id,
  'servico',
  'Banho e Tosa',
  1,
  50.00,
  50.00,
  'Dinheiro',
  created_at + INTERVAL '1 hour'
FROM public.dados_cliente 
LIMIT 5;
