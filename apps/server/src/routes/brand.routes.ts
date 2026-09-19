import { Router } from 'express';
import {
  generateBrand,
  generateLogos,
  chatAgent,
  diagnostics,
  listAssetsHandler,
  saveAssetHandler,
} from '../controllers/brand.controller';
import { saveProject } from '../controllers/project.controller';
import { validateSaveProject } from '../middleware/validation';

const router: Router = Router();

// POST /api/brand/chat - Agent chat: Groq GPT-OSS-120B + server-side tools
router.post('/chat', chatAgent);

// GET /api/brand/diagnostics - Which providers are configured and reachable
router.get('/diagnostics', diagnostics);

// POST /api/brand/generate - Generate brand names & identities via Groq
router.post('/generate', generateBrand);

// POST /api/brand/logos - Generate logo concepts via FLUX.2 [dev] (AICredits)
router.post('/logos', generateLogos);

// POST /api/brand/save - Save project state to database
router.post('/save', validateSaveProject, saveProject);

// ── Asset store (certificates, logos, references, palettes, kits) ──────────
// GET  /api/brand/assets?projectId=...&kind=logo
router.get('/assets', listAssetsHandler);

// POST /api/brand/assets
router.post('/assets', saveAssetHandler);

export default router;
