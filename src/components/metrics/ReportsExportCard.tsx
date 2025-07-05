
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText } from 'lucide-react';
import { useReports } from '@/hooks/useReports';

const ReportsExportCard = () => {
  const [reportType, setReportType] = useState('geral');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { generateReport, exportToCSV, loading } = useReports();

  const handleExport = async () => {
    const dataInicio = startDate ? new Date(startDate) : undefined;
    const dataFim = endDate ? new Date(endDate) : undefined;
    
    const reportData = await generateReport(reportType, dataInicio, dataFim);
    
    if (reportData) {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (reportType === 'geral') {
        // Export all data types
        if (reportData.clientes) exportToCSV(reportData.clientes, `clientes_${timestamp}`);
        if (reportData.vendas) exportToCSV(reportData.vendas, `vendas_${timestamp}`);
        if (reportData.produtos) exportToCSV(reportData.produtos, `produtos_${timestamp}`);
        if (reportData.servicos) exportToCSV(reportData.servicos, `servicos_${timestamp}`);
        if (reportData.funcionarios) exportToCSV(reportData.funcionarios, `funcionarios_${timestamp}`);
      } else {
        // Export specific data type
        const data = reportData[reportType as keyof typeof reportData];
        if (data && Array.isArray(data)) {
          exportToCSV(data, `${reportType}_${timestamp}`);
        }
      }
    }
  };

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Exportar Relatórios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reportType">Tipo de Relatório</Label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Relatório Geral</SelectItem>
              <SelectItem value="clientes">Clientes</SelectItem>
              <SelectItem value="vendas">Vendas</SelectItem>
              <SelectItem value="produtos">Produtos</SelectItem>
              <SelectItem value="servicos">Serviços</SelectItem>
              <SelectItem value="funcionarios">Funcionários</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data Fim</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleExport} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Download className="h-4 w-4 mr-2" />
          {loading ? 'Gerando...' : 'Exportar Relatório'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ReportsExportCard;
