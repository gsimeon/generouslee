import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Video, Users } from 'lucide-react';
import { api } from '../../services/api';
import { EventItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

interface EventsPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    async function loadEvents() {
      const data = await api.getEvents();
      setEvents(data);
    }
    loadEvents();
  }, []);

  const handleRegister = (ev: EventItem) => {
    setSelectedEvent(ev);
    setIsRegistered(false);
  };

  const confirmRegistration = () => {
    if (selectedEvent) {
      setRegisteredEvents(prev => [...prev, selectedEvent.id]);
      setIsRegistered(true);
      setTimeout(() => {
        setSelectedEvent(null);
        setIsRegistered(false);
      }, 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-8 md:p-12 space-y-4">
        <Badge variant="sage" size="md">Live Community Circles & Workshops</Badge>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#211C15] font-normal leading-tight">
          Upcoming Live Gatherings
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl leading-relaxed">
          Join Latisha Langley and faith-driven wellness mentors for live, interactive Q&A sessions, purpose workshops, and honest sisterhood check-ins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {events.map(ev => {
          const registered = registeredEvents.includes(ev.id);
          return (
            <Card key={ev.id} className="p-8 flex flex-col justify-between space-y-6 border-[#E7DFD4]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="terracotta" size="sm">{ev.price}</Badge>
                  <span className="text-xs text-[#A8957C] flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Virtual Livestream
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-[#211C15] font-normal">
                  {ev.title}
                </h3>

                <p className="text-sm text-[#594D3C] leading-relaxed">
                  {ev.description}
                </p>

                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#E7DFD4] space-y-2 text-xs text-[#594D3C]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#B95B3D]" />
                    <span><strong>Date & Time:</strong> {ev.date} &bull; {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#5D7052]" />
                    <span><strong>Lead Facilitator:</strong> {ev.speaker}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F3EFE9] flex items-center justify-between">
                <span className="text-xs text-[#7E6D56]">
                  {ev.attendeeCount.toLocaleString()} attendees registered
                </span>

                <Button
                  variant={registered ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={() => handleRegister(ev)}
                >
                  {registered ? 'Registered &bull; Link Sent' : 'Reserve Spot'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={Boolean(selectedEvent)}
        onClose={() => setSelectedEvent(null)}
        title={isRegistered ? 'Spot Confirmed!' : `RSVP for ${selectedEvent?.title}`}
        subtitle={
          isRegistered
            ? 'We have sent your calendar invitation and private Zoom access link.'
            : 'Reserve your virtual seat. Interactive participation or quiet listening are both welcomed.'
        }
        maxWidth="md"
      >
        {isRegistered ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#594D3C]">
              We look forward to holding space with you. Replays are sent 2 hours after the live broadcast.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-[#594D3C]">
              Confirm your reservation for <strong>{selectedEvent?.date} ({selectedEvent?.time})</strong> with facilitator <strong>{selectedEvent?.speaker}</strong>.
            </p>
            <div className="pt-2 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setSelectedEvent(null)}>Cancel</Button>
              <Button variant="primary" size="md" onClick={confirmRegistration}>
                Confirm Free RSVP &rarr;
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
