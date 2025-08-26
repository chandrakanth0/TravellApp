// src/Auth.jsx
import { useState, useEffect } from 'react';

export default function Auth({ onSuccess }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  // Load Poppins to match the app branding
  useEffect(() => {
    const id = 'font-poppins';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const path = mode === 'signup' ? '/api/register' : '/api/login';
      const body =
        mode === 'signup'
          ? form
          : { email: form.email, password: form.password };

      const res = await fetch('http://localhost:4000' + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Auth failed');

      // Safe user object to avoid JSON.parse crashes later
      const userObj =
        data.user && typeof data.user === 'object'
          ? data.user
          : {
              name: form.name || (form.email?.split('@')[0] || 'User'),
              email: form.email,
            };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObj));
      onSuccess(userObj, data.token);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const fontStyle = {
    fontFamily:
      '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans"',
  };

  return (
    <div className="min-h-screen min-w-screen bg-slate-100">
      <div
        className="mx-auto flex min-h-screen items-center justify-center px-4 py-8"
        style={fontStyle}
      >
        {/* Auth Card */}
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-white shadow-xl md:grid-cols-2">
          {/* Left: Brand / About */}
          <div className="relative hidden p-10 md:block">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-fuchsia-50 to-amber-50" />
            <div className="relative">
              <h1 className="bg-gradient-to-r from-sky-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent text-4xl font-extrabold tracking-tight">
                TravelApp
              </h1>
              <p className="mt-3 text-slate-700">
                Discover places. Plan smarter. Travel happier.
              </p>

              <div className="mt-8 grid gap-4 text-slate-700">
                <Feature
                  title="Curated Destinations"
                  text="Explore popular spots with photos, ratings, and visitor stats."
                />
                <Feature
                  title="Smart Itineraries"
                  text="Use our AI planner to build concise, time-boxed schedules."
                />
                <Feature
                  title="Lightweight Auth"
                  text="Simple login/sign-up. Your session is stored locally."
                />
              </div>

              <div className="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-[conic-gradient(#60a5fa,#ec4899,#a855f7,#60a5fa)] opacity-20 blur-2xl" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="relative p-6 sm:p-8 md:p-10">
            {/* Mobile brand */}
            <div className="mb-6 md:hidden">
              <h1 className="bg-gradient-to-r from-sky-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight">
                TravelApp
              </h1>
              <p className="mt-2 text-sm text-slate-700">
                Sign in to continue exploring destinations.
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                {mode === 'signup'
                  ? 'Join TravelApp and start planning trips in minutes.'
                  : 'Login to access your saved picks and itineraries.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              {mode === 'signup' && (
                <Field
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  autoFocus
                  autoComplete="name"
                />
              )}

              <Field
                label="Email"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                autoFocus={mode !== 'signup'}
                autoComplete="email"
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="flex items-stretch overflow-hidden rounded-xl border bg-white focus-within:ring-2 focus-within:ring-slate-300">
                  <input
                    className="min-h-[44px] w-full px-3 py-2 outline-none"
                    placeholder="Minimum 6 characters"
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={onChange}
                    minLength={6}
                    required
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="px-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    title={showPwd ? 'Hide password' : 'Show password'}
                  >
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {err && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {err}
                </p>
              )}

              {/* Primary button: black text on light button (as requested) */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 inline-flex h-11 items-center justify-center rounded-xl
                           bg-white px-4 text-[15px] font-semibold text-black
                           border border-slate-300 hover:bg-slate-100
                           disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? mode === 'signup'
                    ? 'Creating…'
                    : 'Logging in…'
                  : mode === 'signup'
                  ? 'Create account'
                  : 'Login'}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-700">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button
                    className="font-semibold !text-black hover:!text-black focus:!text-black underline underline-offset-4"
                    onClick={() => setMode('login')}
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  New here?{' '}
                  <button
                    className="font-semibold !text-black hover:!text-black focus:!text-black underline underline-offset-4"
                    onClick={() => setMode('signup')}
                  >
                    Create an account
                  </button>
                </>
              )}
            </p>

            <p className="mt-6 text-xs text-slate-500">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoFocus = false,
  autoComplete,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-800" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required
        className="min-h-[44px] w-full rounded-xl border bg-white px-3 py-2 outline-none
                   focus:ring-2 focus:ring-slate-300"
      />
    </div>
  );
}

function Feature({ title, text }) {
  return (
    <div className="rounded-2xl border bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-1 bg-gradient-to-r from-sky-600 via-fuchsia-600 to-amber-500 bg-clip-text text-transparent text-base font-extrabold">
        {title}
      </div>
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}
