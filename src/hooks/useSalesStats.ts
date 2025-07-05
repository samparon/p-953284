
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useSalesStats() {
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    salesThisMonth: 0,
    revenueThisMonth: 0,
    topProducts: [],
    topServices: [],
    monthlySalesData: [],
    paymentMethods: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refetchSalesStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulando dados de vendas baseados nos clientes existentes
      const { count: totalClients } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' });

      const { data: clientsData } = await supabase
        .from('dados_cliente')
        .select('*');

      // Simulando vendas baseadas nos clientes
      const simulatedSales = totalClients || 0;
      const simulatedRevenue = simulatedSales * 45.5; // Valor médio simulado

      // Vendas deste mês (usando dados de clientes cadastrados este mês como proxy)
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { count: newClientsThisMonth } = await supabase
        .from('dados_cliente')
        .select('*', { count: 'exact' })
        .gte('created_at', firstDayOfMonth.toISOString());

      const salesThisMonth = newClientsThisMonth || 0;
      const revenueThisMonth = salesThisMonth * 45.5;

      // Simulando dados mensais de vendas
      const currentYear = new Date().getFullYear();
      const monthlySalesData = [];
      
      for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(currentYear, month, 1);
        const endOfMonth = new Date(currentYear, month + 1, 0);
        
        const { count } = await supabase
          .from('dados_cliente')
          .select('*', { count: 'exact' })
          .gte('created_at', startOfMonth.toISOString())
          .lte('created_at', endOfMonth.toISOString());
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlySalesData.push({
          month: monthNames[month],
          sales: count || 0
        });
      }

      // Simulando top produtos e serviços
      const topProducts = [
        { item_nome: 'Ração Premium', quantidade: 15 },
        { item_nome: 'Brinquedo Kong', quantidade: 12 },
        { item_nome: 'Shampoo Pet', quantidade: 8 },
        { item_nome: 'Coleira', quantidade: 6 },
        { item_nome: 'Comedouro', quantidade: 4 }
      ];

      const topServices = [
        { item_nome: 'Banho e Tosa', quantidade: 25 },
        { item_nome: 'Consulta Veterinária', quantidade: 18 },
        { item_nome: 'Vacinação', quantidade: 12 },
        { item_nome: 'Corte de Unhas', quantidade: 8 },
        { item_nome: 'Limpeza de Ouvido', quantidade: 5 }
      ];

      // Simulando métodos de pagamento
      const paymentMethods = [
        { name: 'Cartão de Crédito', value: 45, color: '#8B5CF6' },
        { name: 'PIX', value: 30, color: '#EC4899' },
        { name: 'Dinheiro', value: 15, color: '#10B981' },
        { name: 'Cartão de Débito', value: 10, color: '#3B82F6' }
      ];

      setSalesStats({
        totalSales: simulatedSales,
        totalRevenue: simulatedRevenue,
        salesThisMonth,
        revenueThisMonth,
        topProducts,
        topServices,
        monthlySalesData,
        paymentMethods
      });

    } catch (error) {
      console.error('Error fetching sales stats:', error);
      toast({
        title: "Erro ao buscar estatísticas de vendas",
        description: "Ocorreu um erro ao carregar os dados de vendas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return { salesStats, loading, refetchSalesStats };
}
