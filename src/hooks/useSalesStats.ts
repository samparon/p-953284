
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
      
      // Fetch total sales count
      const { count: totalSales } = await supabase
        .from('vendas')
        .select('*', { count: 'exact' })
        .eq('status', 'concluida');

      // Fetch total revenue
      const { data: revenueData } = await supabase
        .from('vendas')
        .select('valor_total')
        .eq('status', 'concluida');

      const totalRevenue = revenueData?.reduce((sum, venda) => sum + Number(venda.valor_total), 0) || 0;

      // Fetch this month's data
      const today = new Date();
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      
      const { count: salesThisMonth } = await supabase
        .from('vendas')
        .select('*', { count: 'exact' })
        .eq('status', 'concluida')
        .gte('data_venda', firstDayOfMonth.toISOString());

      const { data: monthlyRevenueData } = await supabase
        .from('vendas')
        .select('valor_total')
        .eq('status', 'concluida')
        .gte('data_venda', firstDayOfMonth.toISOString());

      const revenueThisMonth = monthlyRevenueData?.reduce((sum, venda) => sum + Number(venda.valor_total), 0) || 0;

      // Fetch top products and services
      const { data: topProducts } = await supabase
        .from('vendas')
        .select('item_nome, quantidade')
        .eq('tipo', 'produto')
        .eq('status', 'concluida')
        .limit(5);

      const { data: topServices } = await supabase
        .from('vendas')
        .select('item_nome, quantidade')
        .eq('tipo', 'servico')
        .eq('status', 'concluida')
        .limit(5);

      // Fetch monthly sales data for chart
      const currentYear = new Date().getFullYear();
      const monthlySalesData = [];
      
      for (let month = 0; month < 12; month++) {
        const startOfMonth = new Date(currentYear, month, 1);
        const endOfMonth = new Date(currentYear, month + 1, 0);
        
        const { count } = await supabase
          .from('vendas')
          .select('*', { count: 'exact' })
          .eq('status', 'concluida')
          .gte('data_venda', startOfMonth.toISOString())
          .lte('data_venda', endOfMonth.toISOString());
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        monthlySalesData.push({
          month: monthNames[month],
          sales: count || 0
        });
      }

      // Fetch payment methods data
      const { data: paymentData } = await supabase
        .from('vendas')
        .select('metodo_pagamento')
        .eq('status', 'concluida')
        .not('metodo_pagamento', 'is', null);

      const paymentCounts = {};
      paymentData?.forEach(venda => {
        if (venda.metodo_pagamento) {
          paymentCounts[venda.metodo_pagamento] = (paymentCounts[venda.metodo_pagamento] || 0) + 1;
        }
      });

      const colors = ['#8B5CF6', '#EC4899', '#10B981', '#3B82F6', '#F59E0B'];
      const paymentMethods = Object.entries(paymentCounts).map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length]
      }));

      setSalesStats({
        totalSales: totalSales || 0,
        totalRevenue,
        salesThisMonth: salesThisMonth || 0,
        revenueThisMonth,
        topProducts: topProducts || [],
        topServices: topServices || [],
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
