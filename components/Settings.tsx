"use client";

import { useLocalStorage } from '@/lib/useLocalStorage';
import type { CanvasConfig } from '@/lib/types';
import { useState } from 'react';

export function Settings() {
  const [cfg, setCfg] = useLocalStorage<CanvasConfig>('canvas-config', { baseUrl: '', token: '' });
  const [open, setOpen] = useState(false);
  const [baseUrl, setBaseUrl] = useState(cfg.baseUrl);
  const [token, setToken] = useState(cfg.token);

  function save() {
    setCfg({ baseUrl: baseUrl.trim().replace(/\/$/, ''), token: token.trim() });
    setOpen(false);
  }

  return (
    <div>
      <button className="button accent" onClick={() => setOpen(true)}>Settings</button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center' }}>
          <div className="card" style={{ width: 520 }}>
            <h3>Canvas Settings</h3>
            <p className="muted">Provide your Canvas base URL and a Personal Access Token.</p>
            <div className="list">
              <div>
                <label>Base URL</label>
                <input className="input" placeholder="https://your-institution.instructure.com" value={baseUrl} onChange={e => setBaseUrl(e.target.value)} />
              </div>
              <div>
                <label>Access Token</label>
                <input className="input" type="password" placeholder="Paste token" value={token} onChange={e => setToken(e.target.value)} />
              </div>
              <div className="row" style={{ justifyContent: 'flex-end', gap: 8 }}>
                <button className="button" onClick={() => setOpen(false)}>Cancel</button>
                <button className="button primary" onClick={save}>Save</button>
              </div>
              <hr className="sep" />
              <div className="muted" style={{ fontSize: 12 }}>
                Your settings are stored locally in your browser. The token is only sent to this app's server to fetch data from Canvas.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
