
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesStatsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  loading?: boolean;
  iconBgClass?: string;
  iconTextClass?: string;
  isCurrency?: boolean;
}

const SalesStatsCard = ({
  title,
  value,
  trend,
  loading = false,
  iconBgClass = 'bg-green-100 dark:bg-green-900/30',
  iconTextClass = 'text-green-600 dark:text-green-400',
  isCurrency = false
}: SalesStatsCardProps) => {
  const formatValue = (val: string | number) => {
    if (isCurrency && typeof val === 'number') {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(val);
    }
    return val;
  };

  return (
    <Card className="dark:bg-gray-800 transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {loading ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            ) : (
              formatValue(value)
            )}
          </div>
          <div className={cn("rounded-full p-2", iconBgClass)}>
            <DollarSign className={cn("h-5 w-5", iconTextClass)} />
          </div>
        </div>
        {trend && (
          <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>
              {loading ? (
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                trend
              )}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesStatsCard;
