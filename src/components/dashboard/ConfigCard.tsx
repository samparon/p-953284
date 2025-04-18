
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';

// Supabase constants
const SUPABASE_URL = "https://yrpespcdsvqibwhzfetp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycGVzcGNkc3ZxaWJ3aHpmZXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Mzc0OTIsImV4cCI6MjA1ODAxMzQ5Mn0.58Fr1ANSTydrKbiAIvoJwnP7jmYFSYVqCa5MeRZ71bc";

// Default webhook base URL
const DEFAULT_WEBHOOK_BASE = "https://webhook.n8nlabz.com.br/webhook";

// Webhook endpoints configuration
const defaultEndpoints = {
  mensagem: `${DEFAULT_WEBHOOK_BASE}/envia_mensagem`,
  pausaBot: `${DEFAULT_WEBHOOK_BASE}/pausa_bot`,
  iniciaBot: `${DEFAULT_WEBHOOK_BASE}/inicia_bot`,
  agenda: `${DEFAULT_WEBHOOK_BASE}/agenda`,
  agendaAlterar: `${DEFAULT_WEBHOOK_BASE}/agenda/alterar`,
  agendaAdicionar: `${DEFAULT_WEBHOOK_BASE}/agenda/adicionar`,
  agendaExcluir: `${DEFAULT_WEBHOOK_BASE}/agenda/excluir`,
  enviaRag: `${DEFAULT_WEBHOOK_BASE}/envia_rag`,
  excluirArquivoRag: `${DEFAULT_WEBHOOK_BASE}/excluir-arquivo-rag`,
  excluirRag: `${DEFAULT_WEBHOOK_BASE}/excluir-rag`,
  instanciaEvolution: `${DEFAULT_WEBHOOK_BASE}/instanciaevolution`,
  atualizarQrCode: `${DEFAULT_WEBHOOK_BASE}/atualizar-qr-code`,
  confirma: `${DEFAULT_WEBHOOK_BASE}/confirma`,
};

const ConfigCard = () => {
  const [endpoints, setEndpoints] = React.useState(() => {
    const savedEndpoints = localStorage.getItem('webhookEndpoints');
    return savedEndpoints ? JSON.parse(savedEndpoints) : defaultEndpoints;
  });

  const handleEndpointChange = (key: string, value: string) => {
    const newEndpoints = { ...endpoints, [key]: value };
    setEndpoints(newEndpoints);
    localStorage.setItem('webhookEndpoints', JSON.stringify(newEndpoints));
  };

  const endpointGroups = {
    'Configuração Supabase': [
      { id: 'supabaseUrl', label: 'URL do Supabase', value: SUPABASE_URL, readOnly: true },
      { id: 'supabaseKey', label: 'Chave Anônima do Supabase', value: SUPABASE_PUBLISHABLE_KEY, readOnly: true }
    ],
    'Configuração da Agenda': [
      { id: 'agenda', label: 'URL Base da Agenda', key: 'agenda' },
      { id: 'agendaAdicionar', label: 'Adicionar Evento', key: 'agendaAdicionar' },
      { id: 'agendaAlterar', label: 'Alterar Evento', key: 'agendaAlterar' },
      { id: 'agendaExcluir', label: 'Excluir Evento', key: 'agendaExcluir' }
    ],
    'Configuração do Bot': [
      { id: 'mensagem', label: 'Enviar Mensagem', key: 'mensagem' },
      { id: 'pausaBot', label: 'Pausar Bot', key: 'pausaBot' },
      { id: 'iniciaBot', label: 'Iniciar Bot', key: 'iniciaBot' },
      { id: 'confirma', label: 'Confirmar', key: 'confirma' }
    ],
    'Configuração RAG': [
      { id: 'enviaRag', label: 'Enviar RAG', key: 'enviaRag' },
      { id: 'excluirArquivoRag', label: 'Excluir Arquivo RAG', key: 'excluirArquivoRag' },
      { id: 'excluirRag', label: 'Excluir RAG', key: 'excluirRag' }
    ],
    'Configuração Evolution': [
      { id: 'instanciaEvolution', label: 'Instância Evolution', key: 'instanciaEvolution' },
      { id: 'atualizarQrCode', label: 'Atualizar QR Code', key: 'atualizarQrCode' }
    ]
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Settings2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <div>
            <CardTitle className="text-lg font-medium">Configurações</CardTitle>
            <CardDescription>Configurações gerais do sistema</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {Object.entries(endpointGroups).map(([groupTitle, fields]) => (
            <div key={groupTitle} className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {groupTitle}
              </h3>
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.id}>
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input
                      id={field.id}
                      value={field.readOnly ? field.value : endpoints[field.key as keyof typeof endpoints]}
                      onChange={field.readOnly ? undefined : (e) => handleEndpointChange(field.key, e.target.value)}
                      readOnly={field.readOnly}
                      className={`${field.readOnly ? 'bg-gray-50 dark:bg-gray-800' : ''} font-mono text-sm`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigCard;
