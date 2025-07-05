
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, PawPrint, RefreshCw, Edit3, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import DraggableCard from '@/components/dashboard/DraggableCard';
import { useDashboardRealtime } from '@/hooks/useDashboardRealtime';

// Import all dashboard cards
import MetricsCard from '@/components/dashboard/MetricsCard';
import ChatsCard from '@/components/dashboard/ChatsCard';
import KnowledgeCard from '@/components/dashboard/KnowledgeCard';
import ClientsCard from '@/components/dashboard/ClientsCard';
import EvolutionCard from '@/components/dashboard/EvolutionCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ConfigCard from '@/components/dashboard/ConfigCard';
import FuncionariosCard from '@/components/dashboard/FuncionariosCard';
import PetsCard from '@/components/dashboard/PetsCard';
import ProdutosCard from '@/components/dashboard/ProdutosCard';
import ServicosCard from '@/components/dashboard/ServicosCard';
import EstoqueCard from '@/components/dashboard/EstoqueCard';
import PedidosCard from '@/components/dashboard/PedidosCard';
import ExportDataCard from '@/components/dashboard/ExportDataCard';

// Drag and drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

// Card components mapping
const CARD_COMPONENTS = {
  'metrics': MetricsCard,
  'export-data': ExportDataCard,
  'chats': ChatsCard,
  'knowledge': KnowledgeCard,
  'clients': ClientsCard,
  'evolution': EvolutionCard,
  'schedule': ScheduleCard,
  'funcionarios': FuncionariosCard,
  'pets': PetsCard,
  'produtos': ProdutosCard,
  'servicos': ServicosCard,
  'estoque': EstoqueCard,
  'pedidos': PedidosCard,
  'config': ConfigCard,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const {
    cardOrder,
    isEditMode,
    reorderCards,
    resetToDefault,
    toggleEditMode,
  } = useDashboardLayout();
  
  // useDashboardRealtime doesn't return anything, it just sets up subscriptions
  useDashboardRealtime();

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setLastUpdated(new Date());
  }, []);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderCards(active.id as string, over.id as string);
      toast({
        title: "Layout atualizado",
        description: "A posição dos cards foi salva automaticamente.",
      });
    }
  };

  const handleResetLayout = () => {
    resetToDefault();
    toast({
      title: "Layout resetado",
      description: "O layout foi restaurado para o padrão original.",
    });
  };

  const handleToggleEditMode = () => {
    toggleEditMode();
    if (!isEditMode) {
      toast({
        title: "Modo de edição ativado",
        description: "Agora você pode arrastar os cards para reorganizá-los.",
      });
    } else {
      toast({
        title: "Modo de edição desativado",
        description: "Layout salvo com sucesso!",
      });
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
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleEditMode}
              className={`text-white hover:bg-white/10 ${isEditMode ? 'bg-white/20' : ''}`}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditMode ? 'Salvar Layout' : 'Editar Layout'}
            </Button>
            {isEditMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetLayout}
                className="text-white hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
            )}
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
            {isEditMode && (
              <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                • Modo de edição ativo - Arraste os cards para reorganizá-los
              </span>
            )}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Última atualização: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardOrder.map((cardId) => {
                const CardComponent = CARD_COMPONENTS[cardId as keyof typeof CARD_COMPONENTS];
                
                if (!CardComponent) {
                  console.warn(`Card component not found for id: ${cardId}`);
                  return null;
                }

                return (
                  <DraggableCard key={cardId} id={cardId} isEditMode={isEditMode}>
                    <CardComponent />
                  </DraggableCard>
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  );
};

export default Dashboard;
