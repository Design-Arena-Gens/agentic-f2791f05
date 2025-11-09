"use client";

import { useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import type { CanvasAssignment, CanvasConfig } from '@/lib/types';
import { formatDateTime } from '@/lib/date';

export function CanvasAssignments() {
  const [cfg] = useLocalStorage<CanvasConfig>('canvas-config', { baseUrl: '', token: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<CanvasAssignment[]>([]);

  const canFetch = useMemo(() => cfg.baseUrl && cfg.token, [cfg]);

  async function fetchAssignments() {
    if (!canFetch) return;
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/canvas/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: cfg.baseUrl, token: cfg.token }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAssignments(data.assignments || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAssignments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.baseUrl, cfg.token]);

  const upcoming = useMemo(() => {
    const now = new Date();
    return assignments
      .filter(a => a.due_at && new Date(a.due_at).getTime() >= now.getTime())
      .sort((a, b) => new Date(a.due_at || 0).getTime() - new Date(b.due_at || 0).getTime())
      .slice(0, 20);
  }, [assignments]);

  return (
    <div>
      <div className="row" style={{ marginBottom: 8 }}>
        <button className="button" onClick={fetchAssignments} disabled={!canFetch || loading}>{loading ? 'Loading?' : 'Refresh'}</button>
        {!canFetch && <span className="muted">Set Canvas settings to enable fetching.</span>}
      </div>
      {error && <div className="item" style={{ borderColor: '#7f1d1d' }}>{error}</div>}
      <div className="list">
        {upcoming.length === 0 && <div className="empty">No upcoming assignments found.</div>}
        {upcoming.map(a => (
          <a key={a.id} className="item" href={a.html_url} target="_blank" rel="noreferrer">
            <div className="grow">
              <div><strong>{a.name}</strong></div>
              <div className="muted">Due {formatDateTime(a.due_at)}</div>
            </div>
            <span className="badge">Course #{a.course_id}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
