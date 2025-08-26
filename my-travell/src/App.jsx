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

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(localStorage.getItem('token')));
  const [query, setQuery] = useState('');

  if (!authed) return <Auth onSuccess={() => setAuthed(true)} />;

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const logout = () => { localStorage.clear(); location.reload(); };

  // (optional) verify token on load; if invalid -> back to login
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api('/api/me', { token }).catch(() => { localStorage.clear(); location.reload(); });
  }, []);

  // Live filter (title/location)
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allPlaces;
    return allPlaces.filter(p =>
      [p.title, p.location].some(s => s.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <>
      <Navbar
        user={user}
        query={query}
        onQueryChange={setQuery}
        onLogout={logout}
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
  );
}
