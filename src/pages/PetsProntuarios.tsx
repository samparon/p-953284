
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Heart, Search, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Pet {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  peso: number;
  proprietario: string;
  telefone: string;
  ultimaConsulta: string;
  proximaConsulta?: string;
  prontuarios: Prontuario[];
}

interface Prontuario {
  id: number;
  data: string;
  veterinario: string;
  tipo: string;
  observacoes: string;
  medicamentos?: string;
}

const PetsProntuarios = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      nome: 'Rex',
      especie: 'Cão',
      raca: 'Golden Retriever',
      idade: 5,
      peso: 30.5,
      proprietario: 'João Silva',
      telefone: '(11) 99999-9999',
      ultimaConsulta: '2024-01-15',
      proximaConsulta: '2024-02-15',
      prontuarios: [
        {
          id: 1,
          data: '2024-01-15',
          veterinario: 'Dr. Maria',
          tipo: 'Consulta de rotina',
          observacoes: 'Pet saudável, aplicada vacina.',
          medicamentos: 'Vermífugo'
        }
      ]
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProntuarioDialogOpen, setIsProntuarioDialogOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    peso: '',
    proprietario: '',
    telefone: '',
    proximaConsulta: ''
  });

  const [prontuarioData, setProntuarioData] = useState({
    veterinario: '',
    tipo: '',
    observacoes: '',
    medicamentos: ''
  });

  const filteredPets = pets.filter(pet => 
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.proprietario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const petData = {
        ...formData,
        idade: parseInt(formData.idade),
        peso: parseFloat(formData.peso),
        id: Date.now(),
        ultimaConsulta: new Date().toISOString().split('T')[0],
        prontuarios: []
      };

      console.log('Dados do Pet para N8N:', petData);
      
      setPets(prev => [...prev, petData as Pet]);
      
      toast({
        title: "Pet cadastrado",
        description: "Pet foi cadastrado com sucesso.",
      });
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o pet.",
        variant: "destructive"
      });
    }
  };

  const handleProntuarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPet) return;
    
    try {
      const novoProntuario: Prontuario = {
        id: Date.now(),
        data: new Date().toISOString().split('T')[0],
        ...prontuarioData
      };

      console.log('Dados do Prontuário para N8N:', {
        petId: selectedPet.id,
        ...novoProntuario
      });
      
      setPets(prev => prev.map(pet => 
        pet.id === selectedPet.id 
          ? { ...pet, prontuarios: [...pet.prontuarios, novoProntuario] }
          : pet
      ));
      
      toast({
        title: "Prontuário adicionado",
        description: "Prontuário foi adicionado com sucesso.",
      });
      
      setIsProntuarioDialogOpen(false);
      resetProntuarioForm();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o prontuário.",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      especie: '',
      raca: '',
      idade: '',
      peso: '',
      proprietario: '',
      telefone: '',
      proximaConsulta: ''
    });
  };

  const resetProntuarioForm = () => {
    setProntuarioData({
      veterinario: '',
      tipo: '',
      observacoes: '',
      medicamentos: ''
    });
    setSelectedPet(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pets & Prontuários</h1>
          <p className="text-gray-600 dark:text-gray-400">Gerenciamento completo</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-500" />
          <span className="text-lg font-semibold">Total: {pets.length} pets cadastrados</span>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Buscar pets..." 
              className="pl-9" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Pet
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Pet</DialogTitle>
                <DialogDescription>
                  Preencha os dados do pet
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Pet</Label>
                    <Input 
                      id="nome" 
                      value={formData.nome} 
                      onChange={e => setFormData({...formData, nome: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="especie">Espécie</Label>
                    <Input 
                      id="especie" 
                      value={formData.especie} 
                      onChange={e => setFormData({...formData, especie: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="raca">Raça</Label>
                    <Input 
                      id="raca" 
                      value={formData.raca} 
                      onChange={e => setFormData({...formData, raca: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idade">Idade (anos)</Label>
                    <Input 
                      id="idade" 
                      type="number"
                      value={formData.idade} 
                      onChange={e => setFormData({...formData, idade: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="peso">Peso (kg)</Label>
                    <Input 
                      id="peso" 
                      type="number"
                      step="0.1"
                      value={formData.peso} 
                      onChange={e => setFormData({...formData, peso: e.target.value})} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="proprietario">Proprietário</Label>
                    <Input 
                      id="proprietario" 
                      value={formData.proprietario} 
                      onChange={e => setFormData({...formData, proprietario: e.target.value})} 
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
                    <Label htmlFor="proximaConsulta">Próxima Consulta</Label>
                    <Input 
                      id="proximaConsulta" 
                      type="date"
                      value={formData.proximaConsulta} 
                      onChange={e => setFormData({...formData, proximaConsulta: e.target.value})} 
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Cadastrar Pet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPets.map(pet => (
          <Card key={pet.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    {pet.nome}
                  </CardTitle>
                  <CardDescription>
                    {pet.especie} • {pet.raca} • {pet.idade} anos • {pet.peso}kg
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedPet(pet);
                    setIsProntuarioDialogOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Novo Prontuário
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <strong>Proprietário:</strong> {pet.proprietario}
                </div>
                <div>
                  <strong>Telefone:</strong> {pet.telefone}
                </div>
                <div>
                  <strong>Última consulta:</strong> {new Date(pet.ultimaConsulta).toLocaleDateString()}
                </div>
                {pet.proximaConsulta && (
                  <div>
                    <strong>Próxima consulta:</strong> {new Date(pet.proximaConsulta).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {pet.prontuarios.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Histórico de Prontuários:</h4>
                  <div className="space-y-2">
                    {pet.prontuarios.slice(-3).map(prontuario => (
                      <div key={prontuario.id} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-1">
                          <Badge variant="outline">{prontuario.tipo}</Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(prontuario.data).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-1">
                          <strong>Veterinário:</strong> {prontuario.veterinario}
                        </p>
                        <p className="text-sm">{prontuario.observacoes}</p>
                        {prontuario.medicamentos && (
                          <p className="text-sm text-blue-600">
                            <strong>Medicamentos:</strong> {prontuario.medicamentos}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isProntuarioDialogOpen} onOpenChange={setIsProntuarioDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Prontuário</DialogTitle>
            <DialogDescription>
              Adicionar prontuário para {selectedPet?.nome}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleProntuarioSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="veterinario">Veterinário</Label>
              <Input 
                id="veterinario" 
                value={prontuarioData.veterinario} 
                onChange={e => setProntuarioData({...prontuarioData, veterinario: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Consulta</Label>
              <Input 
                id="tipo" 
                value={prontuarioData.tipo} 
                onChange={e => setProntuarioData({...prontuarioData, tipo: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                value={prontuarioData.observacoes} 
                onChange={e => setProntuarioData({...prontuarioData, observacoes: e.target.value})} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicamentos">Medicamentos (opcional)</Label>
              <Input 
                id="medicamentos" 
                value={prontuarioData.medicamentos} 
                onChange={e => setProntuarioData({...prontuarioData, medicamentos: e.target.value})} 
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProntuarioDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Adicionar Prontuário</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PetsProntuarios;
