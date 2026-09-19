import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// Health check
// ---------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------------------------------------------
// POST /api/brand/generate
// Returns 10-15 brand names for a given business description.
// Falls back to heuristic mock if no AI key.
// ---------------------------------------------
app.post('/api/brand/generate', async (req, res) => {
  try {
    const { input, count = 12 } = req.body;

    if (!input || !input.industry) {
      return res.status(400).json({ error: 'input.industry is required' });
    }

    // --- Live AI path (when OPENAI_API_KEY is set) ---
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      // Real AI call would go here
      // For now, fall through to mock
    }

    // --- Offline heuristic mock (default) ---
    const mockNames = generateMockNames(input, count);
    const projectId = `proj_${Date.now()}`;

    return res.json({ projectId, names: mockNames });
  } catch (err) {
    console.error('[/api/brand/generate]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------
// POST /api/brand/logos
// ---------------------------------------------
app.post('/api/brand/logos', async (req, res) => {
  try {
    const { brandName, palette } = req.body;
    if (!brandName) return res.status(400).json({ error: 'brandName is required' });

    const logos = ['minimal', 'wordmark', 'abstract', 'geometric'].map((style, i) => ({
      id: `logo_${style}_${Date.now() + i}`,
      style,
      description: `${style.charAt(0).toUpperCase() + style.slice(1)} mark for ${brandName}`,
    }));

    return res.json({ logos });
  } catch (err) {
    console.error('[/api/brand/logos]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------
// POST /api/domain/check
// ---------------------------------------------
app.post('/api/domain/check', async (req, res) => {
  try {
    const { names } = req.body;
    if (!Array.isArray(names)) return res.status(400).json({ error: 'names must be an array' });

    // Simulate availability check with realistic heuristics
    const results: Record<string, object> = {};
    for (const name of names) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      // Short names more likely .com available; long ones less so
      const comAvail = slug.length >= 7 && Math.random() > 0.4;
      results[name] = {
        com: comAvail,
        io: Math.random() > 0.3,
        co: Math.random() > 0.35,
        handle: {
          twitter: Math.random() > 0.45,
          instagram: Math.random() > 0.4,
        },
      };
    }

    return res.json({ results });
  } catch (err) {
    console.error('[/api/domain/check]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------
// POST /api/brand/save
// ---------------------------------------------
app.post('/api/brand/save', async (req, res) => {
  try {
    const { projectId, name, tagline, palette, logos } = req.body;
    // In production, save to DB. For now, just echo back.
    return res.json({
      ok: true,
      saved: { projectId: projectId || `proj_${Date.now()}`, name, tagline, palette, logos },
    });
  } catch (err) {
    console.error('[/api/brand/save]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------------------------------------------
// GET /api/projects/:id
// ---------------------------------------------
app.get('/api/projects/:id', (req, res) => {
  return res.json({ projectId: req.params.id, note: 'Persistence not yet enabled in this demo.' });
});

// ---------------------------------------------
// Helper: heuristic mock brand name generator
// ---------------------------------------------
function generateMockNames(input: any, count: number) {
  const prefixes = ['Vel', 'Syn', 'Arc', 'Elm', 'Koa', 'Zen', 'Cur', 'Orb', 'Lum', 'Ver', 'Kin', 'Sol'];
  const suffixes = ['ia', 'o', 'ex', 'ify', 'ara', 'ion', 'ux', 'is', 'al', 'us', 'en', 'a'];
  const palette = [
    { name: 'Deep Forest', hex: '#1a472a', role: 'primary' },
    { name: 'Sage Mist', hex: '#a8c5a0', role: 'secondary' },
    { name: 'Warm Canvas', hex: '#f5f0e8', role: 'background' },
    { name: 'Slate Ink', hex: '#2d3748', role: 'text' },
    { name: 'Coral Accent', hex: '#e88c7d', role: 'accent' },
  ];

  return Array.from({ length: Math.min(count, prefixes.length) }, (_, i) => ({
    id: `brand_${i}_${Date.now() + i}`,
    name: prefixes[i] + suffixes[i % suffixes.length],
    tagline: `Where ${input.industry || 'craft'} meets modern clarity`,
    meaning: `A generated name reflecting ${input.targetAudience || 'your audience'}.`,
    pronunciation: '',
    domainAvailability: {
      com: i % 3 !== 0,
      io: i % 2 === 0,
      co: i % 4 !== 0,
      handle: { twitter: i % 2 !== 0, instagram: i % 3 !== 0 },
    },
    visualDirection: {
      palette,
      fonts: { headline: 'Outfit', headlineWeight: '700', body: 'Inter', bodyWeight: '400' },
      styleDescription: 'Clean and minimal with purpose.',
    },
    competitors: [],
    logoStyle: 'minimal',
  }));
}

// ---------------------------------------------
// Start server
// ---------------------------------------------
app.listen(PORT, () => {
  console.log(`[upstream-server] Running on http://localhost:${PORT}`);
});

export default app;
