import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/hooks/useProfile';

interface ShotgunEvent {
  name: string;
  startTime: string;
  endTime: string;
  coverThumbnailUrl: string | null;
  url: string;
  slug: string;
}

interface TicketsTabProps {
  profile: Profile;
  stubEvents?: ShotgunEvent[];
}

export function TicketsTab({ profile, stubEvents }: TicketsTabProps) {
  const [events, setEvents] = useState<ShotgunEvent[]>(stubEvents || []);
  const [loading, setLoading] = useState(!stubEvents);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ShotgunEvent | null>(null);

  useEffect(() => {
    if (stubEvents) return;

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);

      const { data, error: fnError } = await supabase.functions.invoke(
        'shotgun-events'
      );

      if (fnError) {
        setError('Failed to load events');
        setLoading(false);
        return;
      }

      setEvents(data || []);
      setLoading(false);
    };

    fetchEvents();
  }, [profile.tag_ids, stubEvents]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold mb-2">No Events Available</h3>
            <p className="text-muted-foreground">
              There are no events matching your profile right now. Check back
              later!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedEvent) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedEvent(null)}
          className="mb-2"
        >
          &larr; Back to events
        </Button>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{selectedEvent.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDate(selectedEvent.startTime)}
            </p>
          </CardHeader>
          <CardContent>
            <iframe
              src={`https://shotgun.live/events/${selectedEvent.slug}?embedded=1`}
              className="w-full border-0 rounded-md"
              style={{ height: '600px' }}
              allow="payment"
              title={selectedEvent.name}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {events.map((event) => (
        <Card
          key={event.slug}
          className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
          onClick={() => setSelectedEvent(event)}
        >
          {event.coverThumbnailUrl && (
            <img
              src={event.coverThumbnailUrl}
              alt={event.name}
              className="w-full h-48 object-cover"
            />
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{event.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formatDate(event.startTime)}
            </p>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Get Ticket</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
