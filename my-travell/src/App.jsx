// src/App.jsx
import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AiWidget from './components/AiWidget.jsx';

import Auth from './Auth';
import TemplateCard from './components/template';
import { places as allPlaces } from './data/places';
import { api } from './api';

import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// safer JSON.parse
function safeParse(raw) {
  try {
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
}

export default function App() {
  // ✅ All hooks declared unconditionally at the top:
  const [authed, setAuthed] = useState(() => Boolean(localStorage.getItem('token')));
  const [query, setQuery] = useState('');

  // one-time cleanup of bad storage values
  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u === 'undefined' || u === 'null') localStorage.removeItem('user');
  }, []);

  // optional: verify token (runs whether authed or not; harmless)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api('/api/me', { token }).catch(() => {
      localStorage.clear();
      setAuthed(false);
    });
  }, []);

  const user = safeParse(localStorage.getItem('user'));

  // Live filter (title/location)
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPlaces;
    return allPlaces.filter(p =>
      [p.title, p.location].some(s => s.toLowerCase().includes(q))
    );
  }, [query]);

  // ✅ Conditionally render UI, but AFTER all hooks have run
  return (
    <>
      {!authed ? (
        <Auth onSuccess={() => setAuthed(true)} />
      ) : (
        <>
          <Navbar
            user={user}
            query={query}
            onQueryChange={setQuery}
            onLogout={() => {
              localStorage.clear();
              setAuthed(false);
            }}
          />

          <main className="mx-auto w-full max-w-[1800px] px-4 py-6">
            <section className="relative z-0 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((p) => (
                <TemplateCard key={p.id} item={p} />
              ))}
            </section>
            {items.length === 0 && (
              <p className="mt-6 text-slate-600">No places match “{query}”.</p>
            )}
          </main>

          <AiWidget />
          <Footer />
        </>
      )}
    </>
  );
}
