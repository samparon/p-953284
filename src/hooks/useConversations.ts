
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
        throw historyError;
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
              
              // Use data field for timestamp
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
      console.log('Fetching conversations...');
      
      // First, get all unique session IDs from chat histories
      const { data: chatHistoryData, error: chatHistoryError } = await supabase
        .from('n8n_chat_histories')
        .select('session_id')
        .order('id', { ascending: false });
      
      if (chatHistoryError) {
        console.error('Error fetching chat history:', chatHistoryError);
        throw chatHistoryError;
      }
      
      console.log('Chat history data:', chatHistoryData?.length || 0, 'records found');
      
      if (!chatHistoryData || chatHistoryData.length === 0) {
        console.log('No chat history found');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      const uniqueSessionIds = Array.from(new Set(
        chatHistoryData.map(item => item.session_id).filter(Boolean)
      ));
      
      console.log('Unique session IDs:', uniqueSessionIds.length);
      
      if (uniqueSessionIds.length === 0) {
        console.log('No valid session IDs found');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Now get client data for these sessions
      const { data: clientsData, error: clientsError } = await supabase
        .from('dados_cliente')
        .select('*')
        .in('sessionid', uniqueSessionIds)
        .not('telefone', 'is', null);
      
      if (clientsError) {
        console.error('Error fetching clients data:', clientsError);
        throw clientsError;
      }
      
      console.log('Clients data found:', clientsData?.length || 0, 'clients');
      
      if (!clientsData || clientsData.length === 0) {
        console.log('No clients found for session IDs');
        setConversations([]);
        setLoading(false);
        return;
      }
      
      // Create conversations from client data
      const conversationsData: Conversation[] = clientsData.map((client: Client) => {
        console.log('Processing client:', client.nome, 'session:', client.sessionid);
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
      
      console.log('Created conversations:', conversationsData.length);
      
      // Get last message for each conversation
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
          
          // Use data field for timestamp
          const messageDate = chatHistory.data 
            ? new Date(chatHistory.data) 
            : new Date();
          
          conversation.time = formatMessageTime(messageDate);
        }
      }
      
      console.log('Final conversations with messages:', conversationsData);
      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Erro ao carregar conversas",
        description: "Ocorreu um erro ao carregar as conversas. Verifique a conexão com o banco de dados.",
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
