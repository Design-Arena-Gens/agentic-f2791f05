"use client";

import { useLocalStorage } from '@/lib/useLocalStorage';
import type { Goal } from '@/lib/types';
import { useState } from 'react';

export function Goals() {
  const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
  const [title, setTitle] = useState('');

  function add() {
    if (!title) return;
    setGoals([...goals, { id: crypto.randomUUID(), title, done: false }]);
    setTitle('');
  }

  function toggle(id: string) {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  }

  function remove(id: string) {
    setGoals(goals.filter(g => g.id !== id));
  }

  return (
    <div>
      <div className="row">
        <input className="input grow" placeholder="Add a goal" value={title} onChange={e => setTitle(e.target.value)} />
        <button className="button primary" onClick={add}>Add</button>
      </div>
      <div className="list">
        {goals.length === 0 && <div className="empty">No goals yet.</div>}
        {goals.map(g => (
          <div key={g.id} className="item">
            <label className="row grow" style={{ gap: 12 }}>
              <input type="checkbox" checked={g.done} onChange={() => toggle(g.id)} />
              <span style={{ textDecoration: g.done ? 'line-through' : 'none' }}>{g.title}</span>
            </label>
            <button className="button danger" onClick={() => remove(g.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
