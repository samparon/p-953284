
-- Criar tabela de produtos
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  categoria VARCHAR(100),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2) NOT NULL DEFAULT 0,
  duracao_minutos INTEGER DEFAULT 30,
  categoria VARCHAR(100),
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque
CREATE TABLE public.estoque (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES public.produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL DEFAULT 0,
  quantidade_minima INTEGER DEFAULT 5,
  preco_custo DECIMAL(10,2),
  lote VARCHAR(100),
  data_validade DATE,
  status VARCHAR(50) DEFAULT 'disponivel',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de pedidos
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_nome VARCHAR(255),
  cliente_telefone VARCHAR(20),
  items JSONB NOT NULL DEFAULT '[]',
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pendente',
  tipo VARCHAR(50) DEFAULT 'produto',
  observacoes TEXT,
  data_entrega DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Create policies for produtos
CREATE POLICY "Allow all operations on produtos" ON public.produtos FOR ALL USING (true);

-- Create policies for servicos
CREATE POLICY "Allow all operations on servicos" ON public.servicos FOR ALL USING (true);

-- Create policies for estoque
CREATE POLICY "Allow all operations on estoque" ON public.estoque FOR ALL USING (true);

-- Create policies for pedidos
CREATE POLICY "Allow all operations on pedidos" ON public.pedidos FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_estoque_produto_id ON public.estoque(produto_id);
CREATE INDEX idx_pedidos_status ON public.pedidos(status);
CREATE INDEX idx_pedidos_created_at ON public.pedidos(created_at);
CREATE INDEX idx_produtos_categoria ON public.produtos(categoria);
CREATE INDEX idx_servicos_categoria ON public.servicos(categoria);
