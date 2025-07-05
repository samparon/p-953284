
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useReports } from '@/hooks/useReports';
import { useToast } from '@/hooks/use-toast';

const ExportDataCard = () => {
  const navigate = useNavigate();
  const { generateReport, exportToCSV, loading } = useReports();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleQuickExport = async () => {
    setIsExporting(true);
    
    try {
      const reportData = await generateReport('geral');
      
      if (reportData) {
        const timestamp = new Date().toISOString().split('T')[0];
        
        // Export all data types
        if (reportData.clientes) {
          exportToCSV(reportData.clientes, `relatorio_clientes_${timestamp}`);
        }
        if (reportData.vendas) {
          exportToCSV(reportData.vendas, `relatorio_vendas_${timestamp}`);
        }
        if (reportData.produtos) {
          exportToCSV(reportData.produtos, `relatorio_produtos_${timestamp}`);
        }
        if (reportData.servicos) {
          exportToCSV(reportData.servicos, `relatorio_servicos_${timestamp}`);
        }
        if (reportData.funcionarios) {
          exportToCSV(reportData.funcionarios, `relatorio_funcionarios_${timestamp}`);
        }

        toast({
          title: "Dados exportados com sucesso!",
          description: "Todos os relatórios do CRM foram baixados.",
        });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro ao exportar dados",
        description: "Ocorreu um erro ao exportar os dados do CRM.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleNavigateToMetrics = () => {
    navigate('/metrics');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white">
      <CardHeader className="pb-2 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-700 dark:to-green-800 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6" />
          Exportar Dados CRM
        </CardTitle>
        <CardDescription className="text-green-100">
          Baixar todos os relatórios
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-full relative">
            <FileSpreadsheet className="h-14 w-14 text-green-500 dark:text-green-400" />
            <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              CSV
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <Download className="h-5 w-5 text-green-600 dark:text-green-400 mr-1" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Exportação completa disponível</span>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={handleQuickExport}
              disabled={loading || isExporting}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exportando...' : 'Exportar Tudo'}
            </Button>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Inclui: Clientes, Vendas, Produtos, Serviços e Funcionários
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge 
          variant="outline" 
          className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800/50 cursor-pointer"
          onClick={handleNavigateToMetrics}
        >
          Ver métricas detalhadas
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ExportDataCard;
