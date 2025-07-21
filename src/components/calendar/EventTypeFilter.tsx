import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventType } from '@/types/user';
import { cn } from '@/lib/utils';

interface EventTypeFilterProps {
  selectedType: EventType | null;
  onTypeSelect: (type: EventType | null) => void;
  eventCounts?: Record<EventType, number>;
  className?: string;
}

const eventTypeOptions = [
  { value: 'rendez-vous', label: 'Rendez-vous', color: 'bg-info/20 text-info border-info/30' },
  { value: 'reunion', label: 'Réunions', color: 'bg-primary/20 text-primary border-primary/30' },
  { value: 'conference', label: 'Conférences', color: 'bg-accent/20 text-accent-foreground border-accent/30' },
  { value: 'evenement-public', label: 'Événements publics', color: 'bg-success/20 text-success border-success/30' },
  { value: 'autre', label: 'Autres', color: 'bg-muted text-muted-foreground border-border' }
];

export function EventTypeFilter({ 
  selectedType, 
  onTypeSelect, 
  eventCounts,
  className 
}: EventTypeFilterProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-medium text-sm">Filtrer par type</h3>
      
      <div className="flex flex-wrap gap-2">
        {/* All events button */}
        <Button
          variant={selectedType === null ? "default" : "outline"}
          size="sm"
          onClick={() => onTypeSelect(null)}
          className="flex items-center gap-2"
        >
          Tous
          {eventCounts && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {Object.values(eventCounts).reduce((sum, count) => sum + count, 0)}
            </Badge>
          )}
        </Button>

        {/* Type-specific buttons */}
        {eventTypeOptions.map(option => (
          <Button
            key={option.value}
            variant={selectedType === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(option.value as EventType)}
            className={cn(
              "flex items-center gap-2",
              selectedType !== option.value && option.color
            )}
          >
            <div 
              className={cn(
                "w-3 h-3 rounded-full",
                option.color.split(' ')[0]
              )}
            />
            {option.label}
            {eventCounts && eventCounts[option.value as EventType] > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {eventCounts[option.value as EventType]}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}