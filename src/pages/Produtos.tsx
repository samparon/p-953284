
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const Produtos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    ativo: true
  });

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    const filtered = produtos.filter(produto =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProdutos(filtered);
  }, [produtos, searchTerm]);

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProdutos(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const produtoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        categoria: formData.categoria,
        ativo: formData.ativo
      };

      if (editingProduto) {
        const { error } = await supabase
          .from('produtos')
          .update(produtoData)
          .eq('id', editingProduto.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('produtos')
          .insert([produtoData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Produto criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      setEditingProduto(null);
      setFormData({ nome: '', descricao: '', preco: '', categoria: '', ativo: true });
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar produto",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      categoria: produto.categoria,
      ativo: produto.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Produto excluído com sucesso!",
      });
      
      fetchProdutos();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
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
                <Package className="h-8 w-8 text-blue-600" />
                Produtos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie os produtos do seu petshop
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduto ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="racao">Ração</SelectItem>
                      <SelectItem value="medicamentos">Medicamentos</SelectItem>
                      <SelectItem value="brinquedos">Brinquedos</SelectItem>
                      <SelectItem value="higiene">Higiene</SelectItem>
                      <SelectItem value="acessorios">Acessórios</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                  />
                  <Label htmlFor="ativo">Produto ativo</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingProduto ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Produtos</CardTitle>
            <CardDescription>
              Total de {produtos.length} produtos cadastrados
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar produtos..."
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{produto.nome}</div>
                        <div className="text-sm text-gray-500">{produto.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{produto.categoria}</Badge>
                    </TableCell>
                    <TableCell>R$ {produto.preco.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={produto.ativo ? "default" : "secondary"}>
                        {produto.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(produto)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(produto.id)}
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

export default Produtos;
