"use client";

import { useLocalStorage } from '@/lib/useLocalStorage';
import type { Reminder } from '@/lib/types';
import { useEffect, useState } from 'react';
import { formatDateTime } from '@/lib/date';

export function Reminders() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>('reminders', []);
  const [title, setTitle] = useState('');
  const [dueAt, setDueAt] = useState('');

  function add() {
    if (!title) return;
    setReminders([...reminders, { id: crypto.randomUUID(), title, dueAt: dueAt || undefined, done: false }]);
    setTitle(''); setDueAt('');
  }

  function toggle(id: string) {
    setReminders(reminders.map(r => r.id === id ? { ...r, done: !r.done } : r));
  }

  function remove(id: string) {
    setReminders(reminders.filter(r => r.id !== id));
  }

  useEffect(() => {
    const i = setInterval(() => {
      const now = new Date();
      reminders.forEach(r => {
        if (!r.done && r.dueAt) {
          const due = new Date(r.dueAt);
          if (due <= now && Notification && Notification.permission === 'granted') {
            new Notification('Reminder', { body: r.title });
          }
        }
      });
    }, 60000);
    return () => clearInterval(i);
  }, [reminders]);

  return (
    <div>
      <div className="columns">
        <input className="input" placeholder="Reminder" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="input" type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} />
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="button primary" onClick={() => {
          if (typeof Notification !== 'undefined' && Notification.permission === 'default') Notification.requestPermission();
          add();
        }}>Add</button>
      </div>
      <div className="list">
        {reminders.length === 0 && <div className="empty">No reminders.</div>}
        {reminders.map(r => (
          <div key={r.id} className="item">
            <label className="row grow" style={{ gap: 12 }}>
              <input type="checkbox" checked={r.done} onChange={() => toggle(r.id)} />
              <div>
                <div style={{ textDecoration: r.done ? 'line-through' : 'none' }}>{r.title}</div>
                <div className="muted">{formatDateTime(r.dueAt)}</div>
              </div>
            </label>
            <button className="button danger" onClick={() => remove(r.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
