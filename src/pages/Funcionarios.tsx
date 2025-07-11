
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  salario: number;
  data_admissao: string;
  status: 'ativo' | 'inativo';
  created_at: string;
  updated_at: string;
}

const Funcionarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    salario: '',
    data_admissao: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const fetchFuncionarios = async () => {
    try {
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFuncionarios((data || []) as Funcionario[]);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funcionários",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const funcionarioData = {
        nome: formData.nome,
        cargo: formData.cargo,
        email: formData.email,
        telefone: formData.telefone,
        salario: parseFloat(formData.salario),
        data_admissao: formData.data_admissao,
        status: formData.status
      };

      if (editingFuncionario) {
        const { error } = await supabase
          .from('funcionarios')
          .update(funcionarioData)
          .eq('id', editingFuncionario.id);

        if (error) throw error;
        toast({
          title: "Funcionário atualizado",
          description: "Os dados foram atualizados com sucesso.",
        });
      } else {
        const { error } = await supabase
          .from('funcionarios')
          .insert([funcionarioData]);

        if (error) throw error;
        toast({
          title: "Funcionário adicionado",
          description: "Novo funcionário foi cadastrado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os dados.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      cargo: '',
      email: '',
      telefone: '',
      salario: '',
      data_admissao: '',
      status: 'ativo'
    });
    setEditingFuncionario(null);
  };

  const handleEdit = (funcionario: Funcionario) => {
    setEditingFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cargo: funcionario.cargo,
      email: funcionario.email,
      telefone: funcionario.telefone,
      salario: funcionario.salario.toString(),
      data_admissao: funcionario.data_admissao,
      status: funcionario.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) return;

    try {
      const { error } = await supabase
        .from('funcionarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Funcionário removido",
        description: "O funcionário foi removido com sucesso.",
        variant: "destructive"
      });
      fetchFuncionarios();
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir funcionário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Funcionários</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerenciamento de equipe</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-orange-500" />
          <span className="text-lg font-semibold">Total: {funcionarios.length} funcionários</span>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingFuncionario ? 'Editar Funcionário' : 'Novo Funcionário'}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do funcionário
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input 
                    id="nome" 
                    value={formData.nome} 
                    onChange={e => setFormData({...formData, nome: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cargo">Cargo</Label>
                  <Input 
                    id="cargo" 
                    value={formData.cargo} 
                    onChange={e => setFormData({...formData, cargo: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input 
                    id="telefone" 
                    value={formData.telefone} 
                    onChange={e => setFormData({...formData, telefone: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salario">Salário</Label>
                  <Input 
                    id="salario" 
                    type="number"
                    value={formData.salario} 
                    onChange={e => setFormData({...formData, salario: e.target.value})} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data_admissao">Data de Admissão</Label>
                  <Input 
                    id="data_admissao" 
                    type="date"
                    value={formData.data_admissao} 
                    onChange={e => setFormData({...formData, data_admissao: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select 
                  id="status" 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value as 'ativo' | 'inativo'})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingFuncionario ? 'Atualizar' : 'Cadastrar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {funcionarios.map(funcionario => (
          <Card key={funcionario.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{funcionario.nome}</CardTitle>
                  <CardDescription>{funcionario.cargo}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={funcionario.status === 'ativo' ? 'default' : 'secondary'}>
                    {funcionario.status}
                  </Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(funcionario)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(funcionario.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Email:</strong> {funcionario.email}
                </div>
                <div>
                  <strong>Telefone:</strong> {funcionario.telefone}
                </div>
                <div>
                  <strong>Salário:</strong> R$ {funcionario.salario.toLocaleString()}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Admissão: {new Date(funcionario.data_admissao).toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Funcionarios;
