
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  clientes: any[];
  vendas: any[];
  produtos: any[];
  servicos: any[];
  funcionarios: any[];
}

export function useReports() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateReport = async (tipo: string, dataInicio?: Date, dataFim?: Date) => {
    try {
      setLoading(true);
      const reportData: Partial<ReportData> = {};

      if (tipo === 'geral' || tipo === 'clientes') {
        const { data: clientes } = await supabase
          .from('dados_cliente')
          .select('*');
        reportData.clientes = clientes || [];
      }

      if (tipo === 'geral' || tipo === 'vendas') {
        let query = supabase.from('vendas').select('*');
        
        if (dataInicio) {
          query = query.gte('data_venda', dataInicio.toISOString());
        }
        if (dataFim) {
          query = query.lte('data_venda', dataFim.toISOString());
        }

        const { data: vendas } = await query;
        reportData.vendas = vendas || [];
      }

      if (tipo === 'geral' || tipo === 'produtos') {
        const { data: produtos } = await supabase
          .from('produtos')
          .select('*');
        reportData.produtos = produtos || [];
      }

      if (tipo === 'geral' || tipo === 'servicos') {
        const { data: servicos } = await supabase
          .from('servicos')
          .select('*');
        reportData.servicos = servicos || [];
      }

      if (tipo === 'geral' || tipo === 'funcionarios') {
        const { data: funcionarios } = await supabase
          .from('funcionarios')
          .select('*');
        reportData.funcionarios = funcionarios || [];
      }

      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "Sem dados para exportar",
        description: "Não há dados disponíveis para exportação.",
        variant: "destructive"
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Relatório exportado",
      description: `Arquivo ${filename}.csv foi baixado com sucesso.`,
    });
  };

  return { generateReport, exportToCSV, loading };
}
