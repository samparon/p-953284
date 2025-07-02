import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, PawPrint, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import MetricsCard from '@/components/dashboard/MetricsCard';
import ChatsCard from '@/components/dashboard/ChatsCard';
import KnowledgeCard from '@/components/dashboard/KnowledgeCard';
import ClientsCard from '@/components/dashboard/ClientsCard';
import EvolutionCard from '@/components/dashboard/EvolutionCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ConfigCard from '@/components/dashboard/ConfigCard';
import FuncionariosCard from '@/components/dashboard/FuncionariosCard';
import PetsCard from '@/components/dashboard/PetsCard';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { data: realtimeData, isLoading } = useDashboardRealtime();

  useEffect(() => {
    if (realtimeData) {
      setLastUpdated(new Date());
    }
  }, [realtimeData]);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-petshop-blue/5 to-petshop-gold/5 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-petshop-blue dark:bg-gray-800 text-white shadow-md transition-colors duration-300">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-petshop-gold" />
            <h1 className="text-2xl font-bold">Pet Paradise Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              className="text-white hover:bg-white/10"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Badge variant="outline" className="bg-white/10 text-white border-0 px-3 py-1">
              {user?.user_metadata?.name || user?.email}
            </Badge>
            <ThemeToggle />
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo ao seu dashboard!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos os aspectos do seu petshop em um só lugar.
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Última atualização: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        {isLoading && (
          <Alert className="mb-6">
            <Bell className="h-4 w-4" />
            <AlertDescription>
              Carregando dados em tempo real...
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard />
          <ChatsCard />
          <KnowledgeCard />
          <ClientsCard />
          <EvolutionCard />
          <ScheduleCard />
          <FuncionariosCard />
          <PetsCard />
          <ConfigCard />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
