
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClientStats } from './useClientStats';
import { useConversations } from './useConversations';

export function useDashboardRealtime() {
  const { fetchConversations } = useConversations();
  const { refetchStats } = useClientStats();

  useEffect(() => {
    console.log('Setting up dashboard-wide realtime updates');
    
    // Subscribe to changes in the clients table
    const clientsSubscription = supabase
      .channel('dashboard_clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'dados_cliente' 
        }, 
        async (payload) => {
          console.log('Client data changed:', payload);
          await refetchStats();
        }
      )
      .subscribe();

    // Subscribe to changes in products table
    const productsSubscription = supabase
      .channel('dashboard_products_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'produtos' 
        }, 
        async (payload) => {
          console.log('Products data changed:', payload);
          await refetchStats();
        }
      )
      .subscribe();

    // Subscribe to changes in services table
    const servicesSubscription = supabase
      .channel('dashboard_services_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'servicos' 
        }, 
        async (payload) => {
          console.log('Services data changed:', payload);
          await refetchStats();
        }
      )
      .subscribe();

    // Subscribe to changes in employees table
    const employeesSubscription = supabase
      .channel('dashboard_employees_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'funcionarios' 
        }, 
        async (payload) => {
          console.log('Employees data changed:', payload);
          await refetchStats();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up dashboard realtime subscriptions');
      clientsSubscription.unsubscribe();
      productsSubscription.unsubscribe();
      servicesSubscription.unsubscribe();
      employeesSubscription.unsubscribe();
    };
  }, [refetchStats, fetchConversations]);
}
