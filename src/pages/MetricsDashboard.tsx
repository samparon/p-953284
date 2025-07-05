
import React, { useEffect } from 'react';
import { LineChart, Users, Smartphone, PawPrint, Package, Briefcase, UserCheck } from 'lucide-react';
import { useClientStats } from '@/hooks/useClientStats';
import { useSalesStats } from '@/hooks/useSalesStats';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';

// Import components
import DashboardHeader from '@/components/metrics/DashboardHeader';
import StatCard from '@/components/metrics/StatCard';
import SalesStatsCard from '@/components/metrics/SalesStatsCard';
import ClientGrowthChart from '@/components/metrics/ClientGrowthChart';
import PetTypesChart from '@/components/metrics/PetTypesChart';
import ServicesBarChart from '@/components/metrics/ServicesBarChart';
import RecentClientsTable from '@/components/metrics/RecentClientsTable';
import ReportsExportCard from '@/components/metrics/ReportsExportCard';

const MetricsDashboard = () => {
  const { stats, loading: clientsLoading, refetchStats } = useClientStats();
  const { salesStats, loading: salesLoading, refetchSalesStats } = useSalesStats();
  
  // Initialize real-time updates for the metrics dashboard
  useDashboardRealtime();
  
  // Fetch data when component mounts
  useEffect(() => {
    refetchStats();
    refetchSalesStats();
  }, [refetchStats, refetchSalesStats]);
  
  // Use real data for monthly customers growth
  const monthlyCustomersData = stats.monthlyGrowth?.length > 0 
    ? stats.monthlyGrowth 
    : [
        { month: 'Jan', clients: 0 },
        { month: 'Fev', clients: 0 },
        { month: 'Mar', clients: 0 },
        { month: 'Abr', clients: 0 },
        { month: 'Mai', clients: 0 },
        { month: 'Jun', clients: 0 },
        { month: 'Jul', clients: 0 },
        { month: 'Ago', clients: 0 },
        { month: 'Set', clients: 0 },
        { month: 'Out', clients: 0 },
        { month: 'Nov', clients: 0 },
        { month: 'Dez', clients: 0 }
      ];
  
  // Use pet breed data from the API instead of hardcoded data
  const petBreedsData = stats.petBreeds?.length > 0 
    ? stats.petBreeds 
    : [
        { name: 'Não especificado', value: 100, color: '#8B5CF6' }
      ];

  const petServicesData = salesStats.monthlySalesData?.length > 0
    ? salesStats.monthlySalesData.map(item => ({
        name: item.month,
        value: item.sales
      }))
    : [
        { name: 'Banho', value: 45 },
        { name: 'Tosa', value: 35 },
        { name: 'Consulta', value: 20 },
        { name: 'Vacinas', value: 30 },
        { name: 'Compras', value: 25 },
      ];
  
  // Use real client data from the database
  const recentClientsData = stats.recentClients?.length > 0
    ? stats.recentClients
    : [
        { id: 1, name: 'Carregando...', phone: '...', pets: 0, lastVisit: '...' }
      ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 dark:text-white">
            <LineChart className="h-6 w-6 text-petshop-blue dark:text-blue-400" />
            Dashboard de Métricas Completo
          </h2>
        </div>
        
        {/* Estatísticas Gerais em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total de Clientes"
            value={stats.totalClients}
            icon={<Users />}
            trend={`+${stats.newClientsThisMonth} este mês`}
            loading={clientsLoading}
            iconBgClass="bg-purple-100 dark:bg-purple-900/30"
            iconTextClass="text-purple-600 dark:text-purple-400"
          />
          
          <StatCard 
            title="Total de Pets"
            value={stats.totalPets}
            icon={<PawPrint />}
            trend={`Média de ${(stats.totalPets / (stats.totalClients || 1)).toFixed(1)} pets por cliente`}
            loading={clientsLoading}
            iconBgClass="bg-pink-100 dark:bg-pink-900/30"
            iconTextClass="text-pink-600 dark:text-pink-400"
          />

          <StatCard 
            title="Produtos Ativos"
            value={stats.totalProducts}
            icon={<Package />}
            trend="Produtos disponíveis"
            loading={clientsLoading}
            iconBgClass="bg-green-100 dark:bg-green-900/30"
            iconTextClass="text-green-600 dark:text-green-400"
          />

          <StatCard 
            title="Funcionários Ativos"
            value={stats.totalEmployees}
            icon={<UserCheck />}
            trend="Equipe ativa"
            loading={clientsLoading}
            iconBgClass="bg-orange-100 dark:bg-orange-900/30"
            iconTextClass="text-orange-600 dark:text-orange-400"
          />
        </div>

        {/* Estatísticas de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SalesStatsCard 
            title="Total de Vendas"
            value={salesStats.totalSales}
            trend={`${salesStats.salesThisMonth} vendas este mês`}
            loading={salesLoading}
          />
          
          <SalesStatsCard 
            title="Receita Total"
            value={salesStats.totalRevenue}
            trend={`R$ ${salesStats.revenueThisMonth.toLocaleString()} este mês`}
            loading={salesLoading}
            isCurrency={true}
          />

          <StatCard 
            title="Serviços Ativos"
            value={stats.totalServices}
            icon={<Briefcase />}
            trend="Serviços disponíveis"
            loading={clientsLoading}
            iconBgClass="bg-blue-100 dark:bg-blue-900/30"
            iconTextClass="text-blue-600 dark:text-blue-400"
          />
          
          <StatCard 
            title="Novos Clientes (Mês)"
            value={stats.newClientsThisMonth}
            icon={<Smartphone />}
            trend={`+${stats.newClientsThisMonth} comparado ao mês anterior`}
            loading={clientsLoading}
            iconBgClass="bg-indigo-100 dark:bg-indigo-900/30"
            iconTextClass="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        
        {/* Gráficos e Tabelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ClientGrowthChart data={monthlyCustomersData} loading={clientsLoading} />
          <PetTypesChart data={petBreedsData} loading={clientsLoading} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ServicesBarChart data={petServicesData} />
          <RecentClientsTable clients={recentClientsData} loading={clientsLoading} />
          <ReportsExportCard />
        </div>
      </main>
    </div>
  );
};

export default MetricsDashboard;
