
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  pending: '#f59e0b',
  in_progress: '#3b82f6', 
  completed: '#10b981',
  cancelled: '#ef4444'
};

const statusLabels = {
  pending: 'En attente',
  in_progress: 'En cours',
  completed: 'Terminées',
  cancelled: 'Annulées'
};

interface TaskStatusChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function TaskStatusChart({ data }: TaskStatusChartProps) {
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Répartition des Tâches</CardTitle>
        <CardDescription>
          Distribution par statut
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  value, 
                  statusLabels[name as keyof typeof statusLabels] || name
                ]}
              />
              <Legend 
                formatter={(value) => statusLabels[value as keyof typeof statusLabels] || value}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
