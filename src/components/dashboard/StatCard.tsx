
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StatCard as StatCardType } from '@/types/user';

interface StatCardProps {
  stat: StatCardType;
  className?: string;
}

export function StatCard({ stat, className = '' }: StatCardProps) {
  const getTrendIcon = () => {
    if (stat.trend > 0) return <TrendingUp className="h-4 w-4" />;
    if (stat.trend < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (stat.trend > 0) return 'text-success';
    if (stat.trend < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${stat.color}`}>
          <span className="text-lg">{stat.icon}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
          <Badge variant="secondary" className={`${getTrendColor()} bg-transparent`}>
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className="text-xs">{Math.abs(stat.trend)}%</span>
            </div>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {stat.trend > 0 ? 'Augmentation' : stat.trend < 0 ? 'Diminution' : 'Stable'} par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  );
}
