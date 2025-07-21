import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarEvent, EventTypeOption } from '@/types/user';
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarGridProps {
  events: CalendarEvent[];
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
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
  className 
}: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

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

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calendrier</span>
              <div className="flex items-center gap-2">
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
          </CardContent>
        </Card>

        {/* Selected Day Events */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate 
                ? format(selectedDate, 'dd MMMM yyyy', { locale: fr })
                : 'Sélectionnez une date'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDayEvents.map(event => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", eventTypeColors[event.eventType])}
                      >
                        {event.eventType.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.startDateTime), 'HH:mm')} - 
                        {format(new Date(event.endDateTime), 'HH:mm')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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