
import React from 'react';
import { Button } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
    variant?: VariantProps<typeof buttonVariants>['variant'];
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-institutional-blue mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action && (
          <Button 
            onClick={action.onClick} 
            variant={action.variant || "default"}
            className={action.variant === "outline" ? "" : "gradient-institutional text-white"}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}
