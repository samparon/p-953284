
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';

const PedidosCard = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/pedidos');
  };
  
  return (
    <Card className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-gray-800 dark:border-gray-700 dark:text-white" onClick={handleClick}>
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6" />
          Pedidos
        </CardTitle>
        <CardDescription className="text-purple-100">
          Gestão de pedidos
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4 flex justify-center">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-full">
            <ShoppingCart className="h-14 w-14 text-purple-500 dark:text-purple-400 animate-pulse" />
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Gerencie pedidos, status de entrega e clientes.
        </p>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-700/50 rounded-b-lg border-t dark:border-gray-700 flex justify-center py-3">
        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/50">
          Gerenciar pedidos
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PedidosCard;
