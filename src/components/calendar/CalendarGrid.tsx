import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEvent, EventTypeOption } from '@/types/user';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin, AlertTriangle, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeSlotManager } from './TimeSlotManager';
import { ConflictDetector, useConflictDetection } from './ConflictDetector';

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
  onCreateEvent?: (startTime: string, endTime: string, date: Date) => void;
  onResolveConflict?: (event1: CalendarEvent, event2: CalendarEvent) => void;
  className?: string;
}

const eventTypeColors: Record<string, string> = {
  'rendez-vous': 'bg-info/20 text-info border-info/30',
  'reunion': 'bg-primary/20 text-primary border-primary/30',
  'conference': 'bg-accent/20 text-accent-foreground border-accent/30',
  'evenement-public': 'bg-success/20 text-success border-success/30',
  'autre': 'bg-muted text-muted-foreground border-border'
};

export function CalendarGrid({ 
  events, 
  selectedDate, 
  onDateSelect, 
  onEventClick,
  onCreateEvent,
  onResolveConflict,
  className 
}: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>('calendar');
  
  // Détection des conflits
  const { hasConflicts, conflictCount } = useConflictDetection(events);

  const getDayEvents = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startDateTime), date));
  };

  const renderDayContent = (date: Date) => {
    const dayEvents = getDayEvents(date);
    
    return (
      <div className="w-full h-full flex flex-col">
        <span className="text-sm">{date.getDate()}</span>
        {dayEvents.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {dayEvents.slice(0, 2).map(event => (
              <div
                key={event.id}
                className={cn(
                  "w-2 h-2 rounded-full",
                  eventTypeColors[event.eventType]?.split(' ')[0] || 'bg-muted'
                )}
              />
            ))}
            {dayEvents.length > 2 && (
              <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>
            )}
          </div>
        )}
      </div>
    );
  };

  const selectedDayEvents = selectedDate ? getDayEvents(selectedDate) : [];

  const handleTimeSlotSelect = (startTime: string, endTime: string) => {
    if (selectedDate && onCreateEvent) {
      onCreateEvent(startTime, endTime, selectedDate);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Détecteur de conflits global */}
      {hasConflicts && (
        <ConflictDetector 
          events={events} 
          onResolveConflict={onResolveConflict}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>Calendrier</span>
                {hasConflicts && (
                  <Badge variant="destructive" className="text-xs flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {conflictCount} conflit{conflictCount > 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                    className="rounded-r-none"
                  >
                    Calendrier
                  </Button>
                  <Button
                    variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('timeline')}
                    className="rounded-l-none"
                  >
                    Planning
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium min-w-[120px] text-center">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'calendar' ? (
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateSelect}
                month={currentDate}
                onMonthChange={setCurrentDate}
                locale={fr}
                className="w-full"
                classNames={{
                  day: "h-12 w-12 text-center text-sm relative",
                  day_selected: "bg-primary text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                }}
              />
            ) : (
              selectedDate && (
                <TimeSlotManager
                  selectedDate={selectedDate}
                  events={selectedDayEvents}
                  onTimeSlotSelect={handleTimeSlotSelect}
                  onEventClick={onEventClick || (() => {})}
                />
              )
            )}
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>
                {selectedDate 
                  ? format(selectedDate, 'dd MMMM yyyy', { locale: fr })
                  : 'Sélectionnez une date'
                }
              </span>
              {selectedDate && onCreateEvent && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTimeSlotSelect('09:00', '10:00')}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" />
                  Nouveau
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map((event, index) => {
                  // Vérifier si cet événement a des conflits
                  const hasConflict = selectedDayEvents.some((otherEvent, otherIndex) => {
                    if (index === otherIndex) return false;
                    const start1 = new Date(event.startDateTime);
                    const end1 = new Date(event.endDateTime);
                    const start2 = new Date(otherEvent.startDateTime);
                    const end2 = new Date(otherEvent.endDateTime);
                    return start1 < end2 && start2 < end1;
                  });

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "p-3 border rounded-lg cursor-pointer transition-all duration-200",
                        "hover:bg-muted/50 hover:shadow-sm",
                        hasConflict 
                          ? "border-destructive/50 bg-destructive/5" 
                          : "border-border"
                      )}
                      onClick={() => onEventClick?.(event)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          {event.title}
                          {hasConflict && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </h4>
                        <div className="flex gap-1">
                          <Badge 
                            variant="outline" 
                            className={cn("text-xs", eventTypeColors[event.eventType])}
                          >
                            {event.eventType.replace('-', ' ')}
                          </Badge>
                          <Badge 
                            variant={event.status === 'confirmed' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {event.status === 'confirmed' ? 'Confirmé' : 'Programmé'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className="font-medium">
                            {format(new Date(event.startDateTime), 'HH:mm')} - 
                            {format(new Date(event.endDateTime), 'HH:mm')}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                {selectedDate ? 'Aucun événement' : 'Cliquez sur une date pour voir les événements'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}