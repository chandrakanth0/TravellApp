// src/components/Footer.jsx
export default function Footer() {
  const year = new Date().getFullYear();

  // Match the navbar font (optional; safe if Poppins isn't loaded)
  const fontStyle = {
    fontFamily:
      '"Poppins", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
  };

  return (
    <footer className="mt-16 bg-white" style={fontStyle}>
      <div className="mx-auto max-w-[1800px] px-4 py-12">
        {/* Brand + tagline */}
        <div className="mb-10">
          <h3
            className="bg-gradient-to-r from-sky-600 via-fuchsia-600 to-amber-500 bg-clip-text
                       text-transparent text-3xl font-extrabold tracking-tight"
          >
            TravelApp
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Discover places. Plan smarter. Travel happier.
          </p>
        </div>

        {/* Link columns */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">About</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Careers</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Help Center</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Contact</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Status</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Terms</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Privacy</a></li>
              <li><a className="text-slate-600 hover:text-slate-900 hover:underline underline-offset-4" href="#">Cookies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-900">Follow</h4>
            <div className="mt-3 flex items-center gap-3">
              {/* simple SVG icons (no extra deps) */}
              <a href="#" title="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-slate-50">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-700"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3a5 5 0 110 10 5 5 0 010-10zm0 2.2a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zM18 6.8a1 1 0 110 2 1 1 0 010-2z"/></svg>
              </a>
              <a href="#" title="Twitter/X" className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-slate-50">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-700"><path d="M4 4l7.3 9.7L4.7 20H7l5-5.6L16 20h4l-7-9.7L18.8 4H17l-4.6 5.1L9 4H4z"/></svg>
              </a>
              <a href="#" title="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-full border hover:bg-slate-50">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-slate-700"><path d="M23 7.5a4 4 0 00-2.8-2.9C18.4 4 12 4 12 4s-6.4 0-8.2.6A4 4 0 001 7.5 41.5 41.5 0 001 12a41.5 41.5 0 000 4.5 4 4 0 002.8 2.9C5.6 20 12 20 12 20s6.4 0 8.2-.6A4 4 0 0023 16.5 41.5 41.5 0 0023 12a41.5 41.5 0 000-4.5zM10 15.5V8.5l6 3.5-6 3.5z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-slate-200/60 pt-4 text-sm text-slate-600 sm:flex-row">
          <p>© {year} TravelApp. All rights reserved.</p>
          <p>Made with ❤️ for explorers.</p>
        </div>
      </div>
    </footer>
  );
}
