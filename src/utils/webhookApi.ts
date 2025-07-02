
// Utility to get webhook endpoints from localStorage
const getWebhookEndpoints = () => {
  const savedEndpoints = localStorage.getItem('webhookEndpoints');
  return savedEndpoints ? JSON.parse(savedEndpoints) : {};
};

// Generic webhook API call function
export const callWebhook = async (endpoint: string, data: any, action: string = 'create') => {
  const endpoints = getWebhookEndpoints();
  const url = endpoints[endpoint];
  
  if (!url) {
    throw new Error(`Endpoint ${endpoint} não configurado`);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      ...data
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro na chamada do webhook: ${response.statusText}`);
  }

  return response.json();
};

// Specific API functions for each module
export const produtosAPI = {
  create: (data: any) => callWebhook('produtos', data, 'create'),
  list: () => callWebhook('produtos', {}, 'list'),
  update: (data: any) => callWebhook('produtos', data, 'update'),
  delete: (id: string) => callWebhook('produtos', { id }, 'delete'),
};

export const servicosAPI = {
  create: (data: any) => callWebhook('servicos', data, 'create'),
  list: () => callWebhook('servicos', {}, 'list'),
  update: (data: any) => callWebhook('servicos', data, 'update'),
  delete: (id: string) => callWebhook('servicos', { id }, 'delete'),
};

export const estoqueAPI = {
  create: (data: any) => callWebhook('estoque', data, 'create'),
  list: () => callWebhook('estoque', {}, 'list'),
  update: (data: any) => callWebhook('estoque', data, 'update'),
  delete: (id: string) => callWebhook('estoque', { id }, 'delete'),
};

export const pedidosAPI = {
  create: (data: any) => callWebhook('pedidos', data, 'create'),
  list: () => callWebhook('pedidos', {}, 'list'),
  update: (data: any) => callWebhook('pedidos', data, 'update'),
  delete: (id: string) => callWebhook('pedidos', { id }, 'delete'),
};
