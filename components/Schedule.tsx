"use client";

import { useLocalStorage } from '@/lib/useLocalStorage';
import type { ScheduleEvent } from '@/lib/types';
import { useMemo, useState } from 'react';

export function Schedule() {
  const [events, setEvents] = useLocalStorage<ScheduleEvent[]>(
    'schedule-events',
    []
  );
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');

  const todayEvents = useMemo(() => {
    const today = new Date();
    const d = today.toISOString().split('T')[0];
    return events.filter(e => (e.startTime || '').startsWith(d));
  }, [events]);

  function addEvent() {
    if (!title || !startTime) return;
    const id = crypto.randomUUID();
    setEvents([
      ...events,
      { id, title, startTime, endTime: endTime || undefined, location: location || undefined },
    ]);
    setTitle(''); setStartTime(''); setEndTime(''); setLocation('');
  }

  function remove(id: string) {
    setEvents(events.filter(e => e.id !== id));
  }

  return (
    <div>
      <div className="columns">
        <input className="input" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="input" type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} />
      </div>
      <div className="columns" style={{ marginTop: 8 }}>
        <input className="input" type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} />
        <input className="input" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="button primary" onClick={addEvent}>Add Event</button>
      </div>
      <div className="list">
        {todayEvents.length === 0 && <div className="empty">No events for today.</div>}
        {todayEvents.map((e) => (
          <div key={e.id} className="item">
            <div className="grow">
              <div><strong>{e.title}</strong> {e.location && <span className="tag">{e.location}</span>}</div>
              <div className="muted">
                {new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {e.endTime && ` - ${new Date(e.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </div>
            </div>
            <button className="button danger" onClick={() => remove(e.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
