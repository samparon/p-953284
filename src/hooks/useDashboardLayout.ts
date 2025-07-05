
import { useState, useEffect, useCallback } from 'react';

export interface DashboardCard {
  id: string;
  component: React.ComponentType;
  title: string;
}

const DEFAULT_CARD_ORDER = [
  'metrics',
  'export-data',
  'chats',
  'knowledge',
  'clients',
  'evolution',
  'schedule',
  'funcionarios',
  'pets',
  'produtos',
  'servicos',
  'estoque',
  'pedidos',
  'config'
];

export function useDashboardLayout() {
  const [cardOrder, setCardOrder] = useState<string[]>(DEFAULT_CARD_ORDER);
  const [isEditMode, setIsEditMode] = useState(false);

  // Load saved order from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('dashboard-card-order');
    if (savedOrder) {
      try {
        const parsedOrder = JSON.parse(savedOrder);
        if (Array.isArray(parsedOrder) && parsedOrder.length > 0) {
          setCardOrder(parsedOrder);
        }
      } catch (error) {
        console.error('Failed to parse saved card order:', error);
      }
    }
  }, []);

  // Save order to localStorage whenever it changes
  const saveOrder = useCallback((newOrder: string[]) => {
    setCardOrder(newOrder);
    localStorage.setItem('dashboard-card-order', JSON.stringify(newOrder));
  }, []);

  // Reorder cards after drag & drop
  const reorderCards = useCallback((activeId: string, overId: string) => {
    setCardOrder((items) => {
      const oldIndex = items.indexOf(activeId);
      const newIndex = items.indexOf(overId);
      
      if (oldIndex === -1 || newIndex === -1) return items;
      
      const newOrder = [...items];
      newOrder.splice(oldIndex, 1);
      newOrder.splice(newIndex, 0, activeId);
      
      // Save immediately after reordering
      localStorage.setItem('dashboard-card-order', JSON.stringify(newOrder));
      
      return newOrder;
    });
  }, []);

  // Reset to default order
  const resetToDefault = useCallback(() => {
    setCardOrder(DEFAULT_CARD_ORDER);
    localStorage.setItem('dashboard-card-order', JSON.stringify(DEFAULT_CARD_ORDER));
  }, []);

  // Toggle edit mode
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  return {
    cardOrder,
    isEditMode,
    reorderCards,
    resetToDefault,
    toggleEditMode,
    saveOrder
  };
}
