
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';

// Import directly from the client file where these constants are defined
const SUPABASE_URL = "https://yrpespcdsvqibwhzfetp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycGVzcGNkc3ZxaWJ3aHpmZXRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Mzc0OTIsImV4cCI6MjA1ODAxMzQ5Mn0.58Fr1ANSTydrKbiAIvoJwnP7jmYFSYVqCa5MeRZ71bc";

// Calendar API endpoint
const CALENDAR_API_URL = "https://webhook.n8nlabz.com.br/webhook/agenda";

const ConfigCard = () => {
  const [zapierWebhook, setZapierWebhook] = React.useState(localStorage.getItem('zapierWebhook') || '');

  const handleZapierWebhookChange = (value: string) => {
    setZapierWebhook(value);
    localStorage.setItem('zapierWebhook', value);
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
          {/* Supabase Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Configuração Supabase</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="supabaseUrl">URL do Supabase</Label>
                <Input
                  id="supabaseUrl"
                  value={SUPABASE_URL}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800"
                />
              </div>
              <div>
                <Label htmlFor="supabaseKey">Chave Anônima do Supabase</Label>
                <Input
                  id="supabaseKey"
                  value={SUPABASE_PUBLISHABLE_KEY}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Calendar API Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Configuração da Agenda</h3>
            <div>
              <Label htmlFor="calendarApi">URL da API de Agenda</Label>
              <Input
                id="calendarApi"
                value={CALENDAR_API_URL}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 font-mono text-sm"
              />
            </div>
          </div>

          {/* Zapier Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Configuração Zapier</h3>
            <div>
              <Label htmlFor="zapierWebhook">URL do Webhook Zapier</Label>
              <Input
                id="zapierWebhook"
                value={zapierWebhook}
                onChange={(e) => handleZapierWebhookChange(e.target.value)}
                placeholder="Cole aqui a URL do seu webhook Zapier"
                className="font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigCard;
