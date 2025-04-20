
import { useState, useCallback } from 'react';

export type AgendaType = 'geral' | 'banho' | 'vet';

export function useAgendaType() {
  const [agendaType, setAgendaType] = useState<AgendaType>('geral');

  const changeAgendaType = useCallback((type: AgendaType) => {
    setAgendaType(type);
  }, []);

  const getEndpointSuffix = useCallback(() => {
    switch (agendaType) {
      case 'banho':
        return '/banho';
      case 'vet':
        return '/vet';
      case 'geral':
      default:
        return '';
    }
  }, [agendaType]);

  return {
    agendaType,
    changeAgendaType,
    getEndpointSuffix,
    isGeral: agendaType === 'geral',
    isBanho: agendaType === 'banho',
    isVet: agendaType === 'vet'
  };
}
