
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Conversation, N8nChatHistory, Client } from '@/types/chat';
import { formatMessageTime } from '@/utils/chatUtils';

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updateConversationLastMessage = async (sessionId: string) => {
    try {
      console.log('Updating conversation last message for session:', sessionId);
      
      const { data: historyData, error: historyError } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .eq('session_id', sessionId)
        .order('id', { ascending: false })
        .limit(1);
      
      if (historyError) {
        console.error('Error fetching history for session:', sessionId, historyError);
        return;
      }
      
      console.log('History data found:', historyData?.length || 0, 'records for session:', sessionId);
      
      if (historyData && historyData.length > 0) {
        const chatHistory = historyData[0] as N8nChatHistory;
        
        setConversations(currentConversations => {
          return currentConversations.map(conv => {
            if (conv.id === sessionId) {
              let lastMessageContent = 'Sem mensagem';
              if (chatHistory.message) {
                if (typeof chatHistory.message === 'string') {
                  try {
                    const jsonMessage = JSON.parse(chatHistory.message);
                    if (jsonMessage.type && jsonMessage.content) {
                      lastMessageContent = jsonMessage.content;
                    }
                  } catch (e) {
                    lastMessageContent = chatHistory.message;
                  }
                } else if (typeof chatHistory.message === 'object') {
                  if (chatHistory.message.content) {
                    lastMessageContent = chatHistory.message.content;
                  } else if (chatHistory.message.messages && Array.isArray(chatHistory.message.messages)) {
                    const lastMsg = chatHistory.message.messages[chatHistory.message.messages.length - 1];
                    lastMessageContent = lastMsg?.content || 'Sem mensagem';
                  } else if (chatHistory.message.type && chatHistory.message.content) {
                    lastMessageContent = chatHistory.message.content;
                  }
                }
              }
              
              const messageDate = chatHistory.data 
                ? new Date(chatHistory.data) 
                : new Date();
                
              return {
                ...conv,
                lastMessage: lastMessageContent || 'Sem mensagem',
                time: formatMessageTime(messageDate),
                unread: conv.unread + 1
              };
            }
            return conv;
          });
        });
      }
    } catch (error) {
      console.error('Error updating conversation last message:', error);
    }
  };

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== INICIANDO BUSCA DE CONVERSAS ===');
      
      // Primeiro, vamos buscar TODOS os dados das tabelas para debug
      console.log('Verificando dados na tabela n8n_chat_histories...');
      const { data: allChatHistory, error: allChatError } = await supabase
        .from('n8n_chat_histories')
        .select('*')
        .limit(10);
      
      console.log('Dados n8n_chat_histories:', {
        total: allChatHistory?.length || 0,
        samples: allChatHistory?.slice(0, 3),
        error: allChatError
      });
      
      console.log('Verificando dados na tabela dados_cliente...');
      const { data: allClients, error: allClientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .limit(10);
      
      console.log('Dados dados_cliente:', {
        total: allClients?.length || 0,
        samples: allClients?.slice(0, 3),
        error: allClientsError
      });
      
      if (allChatError || allClientsError) {
        console.error('Erro ao buscar dados básicos:', { allChatError, allClientsError });
        toast({
          title: "Erro de conexão",
          description: "Erro ao acessar o banco de dados",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (!allChatHistory || allChatHistory.length === 0) {
        console.log('Nenhum histórico de chat encontrado na tabela n8n_chat_histories');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      if (!allClients || allClients.length === 0) {
        console.log('Nenhum client encontrado na tabela dados_cliente');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Buscar sessões únicas do histórico de chat
      const uniqueSessionIds = Array.from(new Set(
        allChatHistory.map(item => item.session_id).filter(Boolean)
      ));
      
      console.log('Session IDs únicos encontrados:', uniqueSessionIds.length, uniqueSessionIds.slice(0, 5));
      
      if (uniqueSessionIds.length === 0) {
        console.log('Nenhum session_id válido encontrado');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Buscar clientes que possuem session_id correspondente
      const { data: matchingClients, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds);
      
      console.log('Clientes com sessionid correspondente:', {
        total: matchingClients?.length || 0,
        samples: matchingClients?.slice(0, 3),
        error: clientsError
      });
      
      if (clientsError) {
        console.error('Erro ao buscar clientes correspondentes:', clientsError);
        toast({
          title: "Erro ao carregar clientes",
          description: `Erro: ${clientsError.message}`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      if (!matchingClients || matchingClients.length === 0) {
        console.log('Nenhum cliente encontrado com sessionid correspondente');
        
        // Tentar busca alternativa - todos os clientes que têm sessionid
        const { data: clientsWithSession, error: alternativeError } = await supabase
          .from('dados_cliente')
          .select('*')
          .not('sessionid', 'is', null);
        
        console.log('Busca alternativa - clientes com sessionid:', {
          total: clientsWithSession?.length || 0,
          samples: clientsWithSession?.slice(0, 3),
          error: alternativeError
        });
        
        if (!clientsWithSession || clientsWithSession.length === 0) {
          setConversations([]);
          setLoading(false);
          return;
        }
        
        // Usar os clientes da busca alternativa
        const conversationsData: Conversation[] = clientsWithSession.map((client: Client) => {
          console.log('Processando cliente:', client.nome, 'session:', client.sessionid);
          return {
            id: client.sessionid,
            name: client.nome || 'Cliente sem nome',
            lastMessage: 'Carregando...',
            time: 'Recente',
            unread: 0,
            avatar: '👤',
            phone: client.telefone,
            email: client.email || 'Sem email',
            petName: client.nome_pet || 'Não informado',
            petType: client.porte_pet || 'Não informado',
            petBreed: client.raca_pet || 'Não informado',
            sessionId: client.sessionid
          };
        });
        
        console.log('Conversas criadas (busca alternativa):', conversationsData.length);
        setConversations(conversationsData);
        setLoading(false);
        return;
      }
      
      // Criar conversas a partir dos clientes encontrados
      const conversationsData: Conversation[] = matchingClients.map((client: Client) => {
        console.log('Processando cliente:', client.nome, 'session:', client.sessionid);
        return {
          id: client.sessionid,
          name: client.nome || 'Cliente sem nome',
          lastMessage: 'Carregando...',
          time: 'Recente',
          unread: 0,
          avatar: '👤',
          phone: client.telefone,
          email: client.email || 'Sem email',
          petName: client.nome_pet || 'Não informado',
          petType: client.porte_pet || 'Não informado',
          petBreed: client.raca_pet || 'Não informado',
          sessionId: client.sessionid
        };
      });
      
      console.log('Conversas criadas:', conversationsData.length);
      
      // Buscar última mensagem para cada conversa
      for (const conversation of conversationsData) {
        const { data: historyData, error: historyError } = await supabase
          .from('n8n_chat_histories')
          .select('*')
          .eq('session_id', conversation.sessionId)
          .order('id', { ascending: false })
          .limit(1);
        
        if (!historyError && historyData && historyData.length > 0) {
          const chatHistory = historyData[0] as N8nChatHistory;
          
          let lastMessageContent = 'Sem mensagem';
          if (chatHistory.message) {
            if (typeof chatHistory.message === 'string') {
              try {
                const jsonMessage = JSON.parse(chatHistory.message);
                if (jsonMessage.type && jsonMessage.content) {
                  lastMessageContent = jsonMessage.content;
                }
              } catch (e) {
                lastMessageContent = chatHistory.message;
              }
            } else if (typeof chatHistory.message === 'object') {
              if (chatHistory.message.content) {
                lastMessageContent = chatHistory.message.content;
              } else if (chatHistory.message.messages && Array.isArray(chatHistory.message.messages)) {
                const lastMsg = chatHistory.message.messages[chatHistory.message.messages.length - 1];
                lastMessageContent = lastMsg?.content || 'Sem mensagem';
              } else if (chatHistory.message.type && chatHistory.message.content) {
                lastMessageContent = chatHistory.message.content;
              }
            }
          }
          
          conversation.lastMessage = lastMessageContent || 'Sem mensagem';
          
          const messageDate = chatHistory.data 
            ? new Date(chatHistory.data) 
            : new Date();
          
          conversation.time = formatMessageTime(messageDate);
        }
      }
      
      console.log('=== BUSCA FINALIZADA ===');
      console.log('Total de conversas encontradas:', conversationsData.length);
      setConversations(conversationsData);
      
    } catch (error) {
      console.error('Erro geral ao buscar conversas:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Erro interno do sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    console.log('useConversations: Initial fetch triggered');
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    setConversations,
    loading,
    updateConversationLastMessage,
    fetchConversations
  };
}
