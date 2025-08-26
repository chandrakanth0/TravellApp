// src/components/Navbar.jsx
import { useEffect, useRef, useState } from 'react';

export default function Navbar({ user, query, onQueryChange, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Load Poppins font once
  useEffect(() => {
    const id = 'font-poppins';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Poppins:wght@700;800;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  // Close profile on outside click / Esc
  useEffect(() => {
    function onDocClick(e) {
      if (!profileOpen) return;
      const m = profileMenuRef.current, b = profileBtnRef.current;
      if (m && !m.contains(e.target) && b && !b.contains(e.target)) setProfileOpen(false);
    }
    function onEsc(e) { if (e.key === 'Escape') setProfileOpen(false); }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [profileOpen]);

  const fontStyle = {
    fontFamily:
      '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur" style={fontStyle}>
      {/* full width, flush-left */}
      <div className="w-full px-3 sm:px-4 h-20">
        {/* ONE ROW, no wrap, no horizontal scroll */}
        <div className="flex h-full flex-nowrap items-center gap-6 overflow-visible">
          {/* Brand + links (start at left edge) */}
          <div className="flex flex-nowrap items-center gap-6 whitespace-nowrap">
            <a
              href="#"
              className="bg-gradient-to-r from-sky-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent
                         text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight"
            >
              TravelApp
            </a>

            {/* Links ~half previous size (were lg:text-4xl) */}
            <a href="#" className="text-base md:text-lg lg:text-2xl font-bold text-slate-900 hover:opacity-80">
              Home
            </a>
            <a href="#" className="text-base md:text-lg lg:text-2xl font-bold text-slate-900 hover:opacity-80">
              About
            </a>
            <a href="#" className="text-base md:text-lg lg:text-2xl font-bold text-slate-900 hover:opacity-80">
              Pricing
            </a>
            <a href="#" className="text-base md:text-lg lg:text-2xl font-bold text-slate-900 hover:opacity-80">
              Contact
            </a>
          </div>

          {/* push right side */}
          <div className="ml-auto" />

          {/* Search (w-96 as before) */}
          <div className="hidden lg:flex w-96 items-center overflow-hidden rounded-xl border bg-white shadow-sm">
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search places…"
              className="w-full px-3 py-2 text-sm outline-none"
              aria-label="Search places"
            />
            <button
              className="h-full bg-slate-900 px-3 py-2 text-white hover:bg-slate-800"
              title="Search"
              aria-label="Search"
              onClick={() => {}}
            >
              🔍
            </button>
          </div>

          {/* Profile */}
          <div className="relative shrink-0">
            <button
              ref={profileBtnRef}
              onClick={() => setProfileOpen(v => !v)}
              className="flex h-12 w-12 items-center justify-center rounded-full
                         bg-gradient-to-br from-slate-900 to-slate-700 text-white text-base font-semibold
                         ring-2 ring-white/80 shadow"
              title="Profile"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {initials(user?.name)}
            </button>

            {profileOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl border bg-white p-4 shadow-xl ring-1 ring-black/5 z-50"
                role="menu"
              >
                <div className="mb-3">
                  <div className="text-base font-semibold">{user?.name}</div>
                  <div className="text-sm text-slate-600">{user?.email}</div>
                </div>
                <div className="grid gap-2">
                  <button
                    className="rounded-lg border px-3 py-2 text-left hover:bg-slate-50"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                  >
                    View profile
                  </button>
                  <button
                    className="rounded-lg border px-3 py-2 text-left hover:bg-slate-50"
                    role="menuitem"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || '?';
}
