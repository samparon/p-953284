import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Scissors, ArrowLeft } from 'lucide-react';
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
import { servicosAPI } from '@/utils/webhookApi';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  duracao_minutos: number;
  categoria: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

const Servicos = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<Servico | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    duracao_minutos: '30',
    categoria: '',
    ativo: true
  });

  useEffect(() => {
    fetchServicos();
  }, []);

  useEffect(() => {
    const filtered = servicos.filter(servico =>
      servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServicos(filtered);
  }, [servicos, searchTerm]);

  const fetchServicos = async () => {
    try {
      const data = await servicosAPI.list();
      setServicos(data || []);
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar serviços",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const servicoData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        duracao_minutos: parseInt(formData.duracao_minutos),
        categoria: formData.categoria,
        ativo: formData.ativo
      };

      if (editingServico) {
        await servicosAPI.update({ ...servicoData, id: editingServico.id });
        toast({
          title: "Sucesso",
          description: "Serviço atualizado com sucesso!",
        });
      } else {
        await servicosAPI.create(servicoData);
        toast({
          title: "Sucesso",
          description: "Serviço criado com sucesso!",
        });
      }

      setIsDialogOpen(false);
      setEditingServico(null);
      setFormData({ nome: '', descricao: '', preco: '', duracao_minutos: '30', categoria: '', ativo: true });
      fetchServicos();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar serviço",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (servico: Servico) => {
    setEditingServico(servico);
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco.toString(),
      duracao_minutos: servico.duracao_minutos.toString(),
      categoria: servico.categoria,
      ativo: servico.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;

    try {
      await servicosAPI.delete(id);
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
      fetchServicos();
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir serviço",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
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
                <Scissors className="h-8 w-8 text-green-600" />
                Serviços
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Gerencie os serviços do seu petshop
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingServico ? 'Editar Serviço' : 'Novo Serviço'}
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
                  <Label htmlFor="duracao">Duração (minutos)</Label>
                  <Input
                    id="duracao"
                    type="number"
                    value={formData.duracao_minutos}
                    onChange={(e) => setFormData({ ...formData, duracao_minutos: e.target.value })}
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
                      <SelectItem value="banho">Banho</SelectItem>
                      <SelectItem value="tosa">Tosa</SelectItem>
                      <SelectItem value="veterinario">Veterinário</SelectItem>
                      <SelectItem value="estetica">Estética</SelectItem>
                      <SelectItem value="consulta">Consulta</SelectItem>
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
                  <Label htmlFor="ativo">Serviço ativo</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingServico ? 'Atualizar' : 'Criar'} Serviço
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Serviços</CardTitle>
            <CardDescription>
              Total de {servicos.length} serviços cadastrados
            </CardDescription>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar serviços..."
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
                  <TableHead>Duração</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServicos.map((servico) => (
                  <TableRow key={servico.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{servico.nome}</div>
                        <div className="text-sm text-gray-500">{servico.descricao}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{servico.categoria}</Badge>
                    </TableCell>
                    <TableCell>R$ {servico.preco.toFixed(2)}</TableCell>
                    <TableCell>{servico.duracao_minutos} min</TableCell>
                    <TableCell>
                      <Badge variant={servico.ativo ? "default" : "secondary"}>
                        {servico.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(servico)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(servico.id)}
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

export default Servicos;
