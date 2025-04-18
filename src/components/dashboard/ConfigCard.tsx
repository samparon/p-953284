
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ConfigCard = () => {
  // Get Supabase URL and key from the client's internal config
  const supabaseUrl = supabase.supabaseUrl;
  const supabaseKey = supabase.supabaseKey;
  
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
        <div className="grid gap-4">
          <div>
            <Label htmlFor="supabaseUrl">URL do Supabase</Label>
            <Input
              id="supabaseUrl"
              value={supabaseUrl}
              readOnly
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
          <div>
            <Label htmlFor="supabaseKey">Chave Anônima do Supabase</Label>
            <Input
              id="supabaseKey"
              value={supabaseKey}
              readOnly
              className="bg-gray-50 dark:bg-gray-800 font-mono text-sm"
            />
          </div>
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
      </CardContent>
    </Card>
  );
};

export default ConfigCard;
