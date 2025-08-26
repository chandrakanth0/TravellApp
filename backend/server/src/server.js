const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();

// ---- SIMPLE CONFIG ----
const PORT = 4000;
const CLIENT_ORIGIN = 'http://localhost:5174'; // Vite default
const JWT_SECRET = 'dev_secret_change_me';     // for demo only
const DATA_FILE = path.join(__dirname, 'users.json');

// ---- FILE HELPERS ----
async function ensureFile() {
  try { await fs.access(DATA_FILE); }
  catch { await fs.writeFile(DATA_FILE, '[]', 'utf8'); }
}
async function readUsers() {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(raw || '[]');
}
async function writeUsers(users) {
  await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), 'utf8');
}
const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt });
const tokenFor = (u) => jwt.sign({ sub: u.id, email: u.email }, JWT_SECRET, { expiresIn: '7d' });

// ---- MIDDLEWARE ----
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// Auth guard
function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const [, token] = auth.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid/expired token' });
  }
}

// ---- ROUTES ----
app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (password.length < 6) return res.status(400).json({ error: 'password must be ≥ 6 characters' });

  const users = await readUsers();
  const e = String(email).trim().toLowerCase();
  if (users.some(u => u.email === e)) return res.status(409).json({ error: 'email already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: 'usr_' + Date.now().toString(36),
    name: name.trim(),
    email: e,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  users.push(user);
  await writeUsers(users);

  const token = tokenFor(user);
  res.status(201).json({ token, user: safeUser(user) });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email, password required' });

  const users = await readUsers();
  const user = users.find(u => u.email === String(email).trim().toLowerCase());
  if (!user) return res.status(401).json({ error: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = tokenFor(user);
  res.json({ token, user: safeUser(user) });
});

app.get('/api/me', requireAuth, async (req, res) => {
  const users = await readUsers();
  const user = users.find(u => u.id === req.userId);
  if (!user) return res.status(404).json({ error: 'user not found' });
  res.json({ user: safeUser(user) });
});

const axios = require('axios');

// optional: use your existing requireAuth to restrict access
// function requireAuth(req,res,next){ ... }  // (you already have this above)

// Compose a simple travel-itinerary system prompt
const SYSTEM_PROMPT = `
You are a friendly travel itinerary planner. 
Given a user's prompt, suggest a practical plan with times for travel, meals, and activities.
Use concise bullet points and include a short summary. Keep responses under ~300 words unless asked for more.
`;

// ---- AI (Hugging Face Router, static token & model) ----
// drop this in the same file where `app` is defined (e.g., server.js)

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt = '', history = [] } = req.body || {};
    if (!prompt.trim()) return res.status(400).json({ error: 'Missing prompt' });

    // STATIC creds/model (as requested) — paste your real token here:
    const HF_TOKEN = process.env.HF_API_TOKEN; // <- put your token
    const MODEL = process.env.HF_MODEL;

    // Build OpenAI-style messages for the Router
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: prompt },
    ];

    const resp = await fetch('https://router.huggingface.co/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 400,
      }),
    });

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content?.trim()
      || 'Sorry, I could not generate a response.';

    res.json({ reply: text });
  } catch (err) {
    console.error('AI error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'AI request failed' });
  }
});


// ---- START ----
app.listen(PORT, () => console.log(`API running http://localhost:${PORT}`));
