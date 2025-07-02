
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Pedido {
  id: string;
  cliente_nome: string;
  cliente_telefone: string;
  items: any[];
  valor_total: number;
  status: string;
  tipo: string;
  observacoes: string;
  data_entrega: string;
  created_at: string;
  updated_at: string;
}

const Pedidos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPedido, setEditingPedido] = useState<Pedido | null>(null);
  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_telefone: '',
    valor_total: '',
    status: 'pendente',
    tipo: 'produto',
    observacoes: '',
    data_entrega: ''
  });

  useEffect(() => {
    fetchPedidos();
  }, []);

  useEffect(() => {
    const filtered = pedidos.filter(pedido =>
      pedido.cliente_nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente_telefone.includes(searchTerm) ||
      pedido.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPedidos(filtered);
  }, [pedidos, searchTerm]);

  const fetchPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure items is always an array
      const pedidosWithArrayItems = (data || []).map(pedido => ({
        ...pedido,
        items: Array.isArray(pedido.items) ? pedido.items : []
      }));
      
      setPedidos(pedidosWithArrayItems);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pedidos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pedidoData = {
        cliente_nome: formData.cliente_nome,
        cliente_telefone: formData.cliente_telefone,
        valor_total: parseFloat(formData.valor_total),
        status: formData.status,
        tipo: formData.tipo,
        observacoes: formData.observacoes,
        data_entrega: formData.data_entrega || null,
        items: []
      };

      if (editingPedido) {
        const { error } = await supabase
          .from('pedidos')
          .update(pedidoData)
          .eq('id', editingPedido.id);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Pedido atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('pedidos')
          .insert([pedidoData]);

        if (error) throw error;
        
        toast({
          title: "Sucesso",
          description: "Pedido criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      setEditingPedido(null);
      setFormData({ cliente_nome: '', cliente_telefone: '', valor_total: '', status: 'pendente', tipo: 'produto', observacoes: '', data_entrega: '' });
      fetchPedidos();
    } catch (error) {
      console.error('Erro ao salvar pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar pedido",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pedido: Pedido) => {
    setEditingPedido(pedido);
    setFormData({
      cliente_nome: pedido.cliente_nome,
      cliente_telefone: pedido.cliente_telefone,
      valor_total: pedido.valor_total.toString(),
      status: pedido.status,
      tipo: pedido.tipo,
      observacoes: pedido.observacoes,
      data_entrega: pedido.data_entrega
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) return;

    try {
      const { error } = await supabase
        .from('pedidos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Pedido excluído com sucesso!",
      });
      
      fetchPedidos();
    } catch (error) {
      console.error('Erro ao excluir pedido:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir pedido",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pendente': { variant: 'secondary' as const, label: 'Pendente' },
      'confirmado': { variant: 'default' as const, label: 'Confirmado' },
      'em_preparo': { variant: 'default' as const, label: 'Em Preparo' },
      'pronto': { variant: 'default' as const, label: 'Pronto' },
      'entregue': { variant: 'default' as const, label: 'Entregue' },
      'cancelado': { variant: 'destructive' as const, label: 'Cancelado' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendente;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
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
                <ShoppingCart className="h-8 w-8 text-purple-600" />
                Pedidos
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie os pedidos dos seus clientes
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPedido ? 'Editar Pedido' : 'Novo Pedido'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="cliente_nome">Nome do Cliente</Label>
                  <Input
                    id="cliente_nome"
                    value={formData.cliente_nome}
                    onChange={(e) => setFormData({ ...formData, cliente_nome: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cliente_telefone">Telefone</Label>
                  <Input
                    id="cliente_telefone"
                    value={formData.cliente_telefone}
                    onChange={(e) => setFormData({ ...formData, cliente_telefone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="valor_total">Valor Total (R$)</Label>
                  <Input
                    id="valor_total"
                    type="number"
                    step="0.01"
                    value={formData.valor_total}
                    onChange={(e) => setFormData({ ...formData, valor_total: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="produto">Produto</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="misto">Misto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="em_preparo">Em Preparo</SelectItem>
                      <SelectItem value="pronto">Pronto</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="data_entrega">Data de Entrega</Label>
                  <Input
                    id="data_entrega"
                    type="date"
                    value={formData.data_entrega}
                    onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingPedido ? 'Atualizar' : 'Criar'} Pedido
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Pedidos</CardTitle>
            <CardDescription>
              Total de {pedidos.length} pedidos
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pedidos..."
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Entrega</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pedido.cliente_nome}</div>
                        <div className="text-sm text-gray-500">{pedido.cliente_telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pedido.tipo}</Badge>
                    </TableCell>
                    <TableCell>R$ {pedido.valor_total.toFixed(2)}</TableCell>
                    <TableCell>
                      {getStatusBadge(pedido.status)}
                    </TableCell>
                    <TableCell>
                      {pedido.data_entrega ? new Date(pedido.data_entrega).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(pedido)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(pedido.id)}
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

export default Pedidos;
