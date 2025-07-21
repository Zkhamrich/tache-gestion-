import React from 'react';
import { CalendarEvent } from '@/types/user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConflictInfo {
  event1: CalendarEvent;
  event2: CalendarEvent;
  overlapMinutes: number;
  overlapStart: Date;
  overlapEnd: Date;
}

interface ConflictDetectorProps {
  events: CalendarEvent[];
  onResolveConflict?: (event1: CalendarEvent, event2: CalendarEvent) => void;
  className?: string;
}

export function ConflictDetector({ events, onResolveConflict, className }: ConflictDetectorProps) {
  // Détecter tous les conflits
  const detectConflicts = (): ConflictInfo[] => {
    const conflicts: ConflictInfo[] = [];
    
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const event1 = events[i];
        const event2 = events[j];
        
        const start1 = new Date(event1.startDateTime);
        const end1 = new Date(event1.endDateTime);
        const start2 = new Date(event2.startDateTime);
        const end2 = new Date(event2.endDateTime);
        
        // Vérifier si les événements se chevauchent
        const isOverlapping = start1 < end2 && start2 < end1;
        
        if (isOverlapping) {
          const overlapStart = new Date(Math.max(start1.getTime(), start2.getTime()));
          const overlapEnd = new Date(Math.min(end1.getTime(), end2.getTime()));
          const overlapMinutes = Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60));
          
          conflicts.push({
            event1,
            event2,
            overlapMinutes,
            overlapStart,
            overlapEnd
          });
        }
      }
    }
    
    return conflicts;
  };

  const conflicts = detectConflicts();

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {conflicts.length} conflit{conflicts.length > 1 ? 's' : ''} détecté{conflicts.length > 1 ? 's' : ''}
              </span>
              <Badge variant="destructive" className="text-xs">
                Attention requise
              </Badge>
            </div>
            
            <div className="space-y-3">
              {conflicts.map((conflict, index) => (
                <div key={index} className="border border-destructive/20 rounded-lg p-3 bg-background">
                  <div className="space-y-3">
                    {/* Événements en conflit */}
                    <div className="grid gap-2">
                      {[conflict.event1, conflict.event2].map((event, eventIndex) => (
                        <div key={event.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {format(new Date(event.startDateTime), 'dd/MM HH:mm')} - 
                                {format(new Date(event.endDateTime), 'HH:mm')}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {event.eventType.replace('-', ' ')}
                              </Badge>
                            </div>
                            <h4 className="text-sm font-medium truncate">{event.title}</h4>
                            {event.location && (
                              <div className="flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Détails du conflit */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Chevauchement:</span>
                        <Badge variant="destructive" className="text-xs">
                          {conflict.overlapMinutes} minutes
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {format(conflict.overlapStart, 'HH:mm')} - {format(conflict.overlapEnd, 'HH:mm')}
                      </span>
                    </div>

                    {/* Actions de résolution */}
                    {onResolveConflict && (
                      <div className="flex gap-2 pt-2 border-t border-destructive/20">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onResolveConflict(conflict.event1, conflict.event2)}
                          className="flex items-center gap-2 text-xs"
                        >
                          <Edit className="h-3 w-3" />
                          Résoudre le conflit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

// Hook utilitaire pour vérifier les conflits en temps réel
export function useConflictDetection(events: CalendarEvent[]) {
  const hasConflicts = React.useMemo(() => {
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const start1 = new Date(events[i].startDateTime);
        const end1 = new Date(events[i].endDateTime);
        const start2 = new Date(events[j].startDateTime);
        const end2 = new Date(events[j].endDateTime);
        
        if (start1 < end2 && start2 < end1) {
          return true;
        }
      }
    }
    return false;
  }, [events]);

  const getConflictCount = React.useMemo(() => {
    let count = 0;
    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const start1 = new Date(events[i].startDateTime);
        const end1 = new Date(events[i].endDateTime);
        const start2 = new Date(events[j].startDateTime);
        const end2 = new Date(events[j].endDateTime);
        
        if (start1 < end2 && start2 < end1) {
          count++;
        }
      }
    }
    return count;
  }, [events]);

  return { hasConflicts, conflictCount: getConflictCount };
}