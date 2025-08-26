// src/components/AiWidget.jsx
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AiWidget() {
  const [open, setOpen] = useState(false);
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

  // auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [chat, open]);

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
          history: next.slice(-6), // send short history
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

  return (
    <>
      {/* Floating button */}
      {/* <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-23 right-4 z-50 rounded-full bg-slate-900 px-4 py-3 text-white shadow-lg hover:bg-slate-800"
        title="Ask AI"
      >
        🤖 Ask AI
      </button> */}
      {/* Floating button with rotating gradient border */}


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
    {/* Rotating gradient ring */}
    <span
      className="
        pointer-events-none absolute inset-0
        bg-[conic-gradient(#60a5fa,#ec4899,#a855f7,#60a5fa)]
        animate-[spin_12s_linear_infinite] opacity-90
      "
    />
    {/* Inner panel (creates the 'border' effect) */}
    <span className="absolute inset-[2px] rounded-xl bg-white" />
    {/* Content */}
    <span className="relative z-10 flex items-center gap-2 text-sm font-semibold text-slate-900">
      <span className="text-lg">🤖</span>
      <span>Ask AI</span>
    </span>
  </button>
</div>


      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[420px] max-w-[92vw] overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
            <div className="font-semibold">Itinerary Planner</div>
            <button
              className="text-slate-500 hover:text-slate-900"
              onClick={() => setOpen(false)}
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            ref={scrollerRef}
            className="max-h-80 space-y-3 overflow-y-auto px-4 py-3"
          >
            {chat.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                {m.role === 'user' ? (
                  // USER BUBBLE
                  <div className="inline-block max-w-[85%] rounded-2xl bg-slate-900 px-3 py-2 text-left text-sm text-white">
                    {m.content}
                  </div>
                ) : (
                  // ASSISTANT — MARKDOWN inside a styled wrapper (no className on ReactMarkdown)
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

/**
 * Convert model's inline text like:
 * "**Title** **Day 1** - **Morning ...** - **9:30 ...** ..."
 * into nice markdown with headings + real bullet lines.
 */
function formatItineraryMarkdown(txt = '') {
  let t = String(txt);

  // Title -> blank line -> Day headings
  t = t.replace(/(\*\*[^*]+?\*\*)\s+(?=\*\*Day\s*\d+)/, '$1\n\n');

  // Ensure each "**Day X: ...**" starts on a new line
  t = t.replace(/\s*\*\*Day\s*(\d+[^*]*?)\*\*/g, (_m, rest) => `\n\n**Day ${rest}**`);

  // Turn inline " - " bullets into real list lines
  t = t.replace(/(\S)\s-\s/g, '$1\n- ');

  // Break before bold following a paren like ")- **Next**"
  t = t.replace(/\)\s+\*\*/g, ')\n**');

  // Normalize extra whitespace
  t = t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  // Ensure there's at least a heading
  if (!/^\*\*.+\*\*/.test(t)) t = `**Itinerary**\n\n${t}`;

  return t;
}
