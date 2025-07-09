
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useClientStats() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalPets: 0,
    newClientsThisMonth: 0,
    totalProducts: 0,
    totalServices: 0,
    totalEmployees: 0,
    monthlyGrowth: [],
    petBreeds: [],
    recentClients: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchStats = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== INICIANDO BUSCA DE ESTATÍSTICAS ===');
      
      // Verificar dados brutos primeiro
      console.log('Verificando dados das tabelas...');
      
      const { data: clientsData, error: clientsDataError } = await supabase
        .from('dados_cliente')
        .select('*');
      
      console.log('Dados dados_cliente:', {
        total: clientsData?.length || 0,
        samples: clientsData?.slice(0, 3),
        error: clientsDataError
      });
      
      const { data: productsData, error: productsDataError } = await supabase
        .from('produtos')
        .select('*');
      
      console.log('Dados produtos:', {
        total: productsData?.length || 0,
        samples: productsData?.slice(0, 3),
        error: productsDataError
      });
      
      const { data: servicesData, error: servicesDataError } = await supabase
        .from('servicos')
        .select('*');
      
      console.log('Dados servicos:', {
        total: servicesData?.length || 0,
        samples: servicesData?.slice(0, 3),
        error: servicesDataError
      });
      
      const { data: employeesData, error: employeesDataError } = await supabase
        .from('funcionarios')
        .select('*');
      
      console.log('Dados funcionarios:', {
        total: employeesData?.length || 0,
        samples: employeesData?.slice(0, 3),
        error: employeesDataError
      });
      
      if (clientsDataError || productsDataError || servicesDataError || employeesDataError) {
        console.error('Erros ao buscar dados:', {
          clientsDataError,
          productsDataError,
          servicesDataError,
          employeesDataError
        });
        toast({
          title: "Erro ao carregar estatísticas",
          description: "Erro ao acessar dados do banco",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Calcular estatísticas
      const totalClients = clientsData?.length || 0;
      const totalPets = clientsData?.filter(client => client.nome_pet)?.length || 0;
      const totalProducts = productsData?.filter(product => product.ativo)?.length || 0;
      const totalServices = servicesData?.filter(service => service.ativo)?.length || 0;
      const totalEmployees = employeesData?.filter(employee => employee.status === 'ativo')?.length || 0;
      
      // Calcular novos clientes este mês
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const newClientsThisMonth = clientsData?.filter(client => {
        if (!client.created_at) return false;
        const clientDate = new Date(client.created_at);
        return clientDate >= firstDayOfMonth && clientDate <= today;
      })?.length || 0;
      
      // Crescimento mensal
      const monthlyGrowthData = [];
      for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(today.getFullYear(), month, 1);
        const endOfMonth = new Date(today.getFullYear(), month + 1, 0);
        
        const monthClients = clientsData?.filter(client => {
          if (!client.created_at) return false;
          const clientDate = new Date(client.created_at);
          return clientDate >= startOfMonth && clientDate <= endOfMonth;
        })?.length || 0;
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlyGrowthData.push({
          month: monthNames[month],
          clients: monthClients
        });
      }
      
      // Raças de pets
      const breedCounts = {};
      clientsData?.forEach(client => {
        if (client.raca_pet) {
          breedCounts[client.raca_pet] = (breedCounts[client.raca_pet] || 0) + 1;
        }
      });
      
      const colors = [
        '#8B5CF6', '#EC4899', '#10B981', '#3B82F6', 
        '#F59E0B', '#EF4444', '#6366F1', '#14B8A6',
        '#F97316', '#8B5CF6', '#06B6D4', '#D946EF'
      ];
      
      const petBreeds = Object.entries(breedCounts).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));
      
      // Clientes recentes
      const recentClients = clientsData
        ?.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        ?.slice(0, 5)
        ?.map(client => ({
          id: client.id,
          name: client.nome || 'Sem nome',
          phone: client.telefone || 'Sem telefone',
          pets: client.nome_pet ? 1 : 0,
          lastVisit: client.created_at ? new Date(client.created_at).toLocaleDateString('pt-BR') : 'Desconhecido'
        })) || [];
      
      console.log('Estatísticas calculadas:', {
        totalClients,
        totalPets,
        newClientsThisMonth,
        totalProducts,
        totalServices,
        totalEmployees,
        petBreeds: petBreeds.length,
        recentClients: recentClients.length
      });
      
      // Atualizar estatísticas
      setStats({
        totalClients,
        totalPets,
        newClientsThisMonth,
        totalProducts,
        totalServices,
        totalEmployees,
        monthlyGrowth: monthlyGrowthData,
        petBreeds,
        recentClients
      });
      
      console.log('=== BUSCA DE ESTATÍSTICAS FINALIZADA ===');

    } catch (error) {
      console.error('Erro geral ao buscar estatísticas:', error);
      toast({
        title: "Erro ao atualizar estatísticas",
        description: "Erro interno do sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { stats, loading, refetchStats };
}
