// src/components/AiWidget.jsx
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiWidget() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content:
        'Hi! Ask me to plan your trip. Example: "2 days in Mysuru, vegetarian food, budget ₹5k/day".',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, open, expanded]);

  async function send() {
    const prompt = input.trim();
    if (!prompt) return;
    setInput('');
    const next = [...chat, { role: 'user', content: prompt }];
    setChat(next);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          prompt,
          history: next.slice(-6),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI error');

      setChat((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply ?? 'No reply' },
      ]);
    } catch (e) {
      console.error(e);
      setChat((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I could not fetch a response.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const panelClass = `
    fixed z-50 overflow-hidden rounded-2xl border bg-white shadow-2xl flex flex-col
    ${expanded ? 'inset-4 h-[85vh]' : 'bottom-24 right-4 w-[min(92vw,560px)] h-[70vh]'}
  `;

  return (
    <>
      {/* Floating Ask AI button (UI-friendly gradient border) */}
      <div className="fixed bottom-28 right-5 z-50">
        <button
          onClick={() => setOpen(v => !v)}
          title="Ask AI"
          aria-label="Ask AI"
          className="
            group relative inline-flex h-12 w-[10rem] items-center justify-center
            overflow-hidden rounded-2xl
            shadow-[0_10px_20px_rgba(2,6,23,.12)] transition-transform duration-200
            active:scale-[0.98]
          "
        >
          <span
            className="
              pointer-events-none absolute inset-0
              bg-[conic-gradient(#60a5fa,#ec4899,#a855f7,#60a5fa)]
              animate-[spin_12s_linear_infinite] opacity-90
            "
          />
          <span className="absolute inset-[2px] rounded-xl bg-white" />
          <span className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span className="text-lg">🤖</span>
            <span>Ask AI</span>
          </span>
        </button>
      </div>

      {/* Panel */}
      {open && (
        <div className={panelClass}>
          {/* Header */}
          <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
            <div className="font-semibold">Itinerary Planner</div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-lg border px-2 py-1 text-xs text-slate-700 hover:bg-white"
                onClick={() => setExpanded(v => !v)}
                title={expanded ? 'Shrink' : 'Expand'}
              >
                {expanded ? 'Shrink' : 'Expand'}
              </button>
              <button
                className="text-slate-500 hover:text-slate-900"
                onClick={() => setOpen(false)}
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Messages (fills available height) */}
          <div ref={scrollerRef} className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-3">
            {chat.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                {m.role === 'user' ? (
                  <div className="inline-block max-w-[85%] rounded-2xl bg-slate-900 px-3 py-2 text-left text-sm text-white">
                    {m.content}
                  </div>
                ) : (
                  <div className="inline-block max-w-[95%] rounded-2xl border bg-white px-4 py-3 text-sm shadow-sm">
                    <div className="markdown-body">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {formatItineraryMarkdown(m.content)}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="text-left text-sm text-slate-500">Thinking…</div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-end gap-2 border-t p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={2}
              placeholder='e.g., "Plan 3 days in Coorg with trekking and local food"'
              className="min-h-[44px] w-full resize-none rounded-xl border px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-black-200 hover:bg-slate-800 disabled:opacity-60"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Minimal styles for markdown without Tailwind Typography plugin */}
      <style>{`
        .markdown-body p { margin: 0 0 .5rem 0; }
        .markdown-body strong { color: #0f172a; }
        .markdown-body ul { margin: .25rem 0 .5rem 1.25rem; list-style: disc; }
        .markdown-body ol { margin: .25rem 0 .5rem 1.25rem; list-style: decimal; }
        .markdown-body li { margin: .25rem 0; }
        .markdown-body h1 { font-size: 1.125rem; font-weight: 700; margin: .5rem 0; }
        .markdown-body h2 { font-size: 1rem; font-weight: 600; margin: .5rem 0 .25rem; }
        .markdown-body code { background:#f1f5f9; padding:0 .25rem; border-radius:.25rem; }
      `}</style>
    </>
  );
}

/** Formatting helper */
function formatItineraryMarkdown(txt = '') {
  let t = String(txt);
  t = t.replace(/(\*\*[^*]+?\*\*)\s+(?=\*\*Day\s*\d+)/, '$1\n\n');     // Title -> blank line -> Day
  t = t.replace(/\s*\*\*Day\s*(\d+[^*]*?)\*\*/g, (_m, rest) => `\n\n**Day ${rest}**`);
  t = t.replace(/(\S)\s-\s/g, '$1\n- ');                               // inline bullets => list lines
  t = t.replace(/\)\s+\*\*/g, ')\n**');                                // break before bold after ')'
  t = t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();  // clean whitespace
  if (!/^\*\*.+\*\*/.test(t)) t = `**Itinerary**\n\n${t}`;
  return t;
}
