
import React, { useState } from 'react';
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
  id: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
  salario: number;
  dataAdmissao: string;
  status: 'ativo' | 'inativo';
}

const Funcionarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: 1,
      nome: 'João Silva',
      cargo: 'Veterinário',
      email: 'joao@petparadise.com',
      telefone: '(11) 99999-9999',
      salario: 5000,
      dataAdmissao: '2023-01-15',
      status: 'ativo'
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFuncionario, setEditingFuncionario] = useState<Funcionario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    salario: '',
    dataAdmissao: '',
    status: 'ativo' as 'ativo' | 'inativo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const funcionarioData = {
        ...formData,
        salario: parseFloat(formData.salario),
        id: editingFuncionario ? editingFuncionario.id : Date.now()
      };

      // Simular chamada para N8N
      console.log('Dados para N8N:', funcionarioData);
      
      if (editingFuncionario) {
        setFuncionarios(prev => prev.map(f => f.id === editingFuncionario.id ? funcionarioData as Funcionario : f));
        toast({
          title: "Funcionário atualizado",
          description: "Os dados foram atualizados com sucesso.",
        });
      } else {
        setFuncionarios(prev => [...prev, funcionarioData as Funcionario]);
        toast({
          title: "Funcionário adicionado",
          description: "Novo funcionário foi cadastrado com sucesso.",
        });
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
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
      dataAdmissao: '',
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
      dataAdmissao: funcionario.dataAdmissao,
      status: funcionario.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setFuncionarios(prev => prev.filter(f => f.id !== id));
    toast({
      title: "Funcionário removido",
      description: "O funcionário foi removido com sucesso.",
      variant: "destructive"
    });
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
                  <Label htmlFor="dataAdmissao">Data de Admissão</Label>
                  <Input 
                    id="dataAdmissao" 
                    type="date"
                    value={formData.dataAdmissao} 
                    onChange={e => setFormData({...formData, dataAdmissao: e.target.value})} 
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
                Admissão: {new Date(funcionario.dataAdmissao).toLocaleDateString()}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Funcionarios;
