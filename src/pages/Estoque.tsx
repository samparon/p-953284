
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Produto {
  id: string;
  nome: string;
}

interface EstoqueItem {
  id: string;
  produto_id: string;
  quantidade: number;
  quantidade_minima: number;
  preco_custo: number;
  lote: string;
  data_validade: string;
  status: string;
  created_at: string;
  updated_at: string;
  produtos?: Produto;
}

const Estoque = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [estoque, setEstoque] = useState<EstoqueItem[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredEstoque, setFilteredEstoque] = useState<EstoqueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EstoqueItem | null>(null);
  const [formData, setFormData] = useState({
    produto_id: '',
    quantidade: '',
    quantidade_minima: '5',
    preco_custo: '',
    lote: '',
    data_validade: '',
    status: 'disponivel'
  });

  useEffect(() => {
    fetchEstoque();
    fetchProdutos();
  }, []);

  useEffect(() => {
    const filtered = estoque.filter(item =>
      item.produtos?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lote.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEstoque(filtered);
  }, [estoque, searchTerm]);

  const fetchEstoque = async () => {
    try {
      const { data, error } = await supabase
        .from('estoque')
        .select(`
          *,
          produtos (
            id,
            nome
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstoque(data || []);
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar estoque",
        variant: "destructive",
      });
    }
  };

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('id, nome')
        .eq('ativo', true)
        .order('nome');

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const estoqueData = {
        produto_id: formData.produto_id,
        quantidade: parseInt(formData.quantidade),
        quantidade_minima: parseInt(formData.quantidade_minima),
        preco_custo: parseFloat(formData.preco_custo),
        lote: formData.lote,
        data_validade: formData.data_validade || null,
        status: formData.status
      };

      if (editingItem) {
        const { error } = await supabase
          .from('estoque')
          .update(estoqueData)
          .eq('id', editingItem.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Item do estoque atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('estoque')
          .insert([estoqueData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Item adicionado ao estoque com sucesso!",
        });
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ produto_id: '', quantidade: '', quantidade_minima: '5', preco_custo: '', lote: '', data_validade: '', status: 'disponivel' });
      fetchEstoque();
    } catch (error) {
      console.error('Erro ao salvar item do estoque:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar item do estoque",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item: EstoqueItem) => {
    setEditingItem(item);
    setFormData({
      produto_id: item.produto_id,
      quantidade: item.quantidade.toString(),
      quantidade_minima: item.quantidade_minima.toString(),
      preco_custo: item.preco_custo.toString(),
      lote: item.lote,
      data_validade: item.data_validade,
      status: item.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este item do estoque?')) return;

    try {
      const { error } = await supabase
        .from('estoque')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Item removido do estoque com sucesso!",
      });
      
      fetchEstoque();
    } catch (error) {
      console.error('Erro ao excluir item do estoque:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir item do estoque",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (item: EstoqueItem) => {
    const isLowStock = item.quantidade <= item.quantidade_minima;
    const isExpired = item.data_validade && new Date(item.data_validade) < new Date();
    
    if (isExpired) {
      return <Badge variant="destructive">Vencido</Badge>;
    }
    if (isLowStock) {
      return <Badge variant="secondary">Estoque Baixo</Badge>;
    }
    return <Badge variant="default">{item.status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Package2 className="h-8 w-8 text-amber-600" />
                Estoque
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Controle o estoque dos seus produtos
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Item' : 'Novo Item no Estoque'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="produto_id">Produto</Label>
                  <Select value={formData.produto_id} onValueChange={(value) => setFormData({ ...formData, produto_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    value={formData.quantidade}
                    onChange={(e) => setFormData({ ...formData, quantidade: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantidade_minima">Quantidade Mínima</Label>
                  <Input
                    id="quantidade_minima"
                    type="number"
                    value={formData.quantidade_minima}
                    onChange={(e) => setFormData({ ...formData, quantidade_minima: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="preco_custo">Preço de Custo (R$)</Label>
                  <Input
                    id="preco_custo"
                    type="number"
                    step="0.01"
                    value={formData.preco_custo}
                    onChange={(e) => setFormData({ ...formData, preco_custo: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="lote">Lote</Label>
                  <Input
                    id="lote"
                    value={formData.lote}
                    onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="data_validade">Data de Validade</Label>
                  <Input
                    id="data_validade"
                    type="date"
                    value={formData.data_validade}
                    onChange={(e) => setFormData({ ...formData, data_validade: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="reservado">Reservado</SelectItem>
                      <SelectItem value="indisponivel">Indisponível</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">
                  {editingItem ? 'Atualizar' : 'Adicionar'} Item
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Controle de Estoque</CardTitle>
            <CardDescription>
              Total de {estoque.length} itens no estoque
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar no estoque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Validade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstoque.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.quantidade <= item.quantidade_minima && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        )}
                        <div>
                          <div className="font-medium">{item.produtos?.nome}</div>
                          <div className="text-sm text-gray-500">
                            Min: {item.quantidade_minima} | Custo: R$ {item.preco_custo?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.quantidade <= item.quantidade_minima ? "destructive" : "default"}>
                        {item.quantidade}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lote}</TableCell>
                    <TableCell>
                      {item.data_validade ? new Date(item.data_validade).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(item)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Estoque;
