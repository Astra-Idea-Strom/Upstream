import { Router } from 'express';
import { generateBrand, generateLogos, chatAgent } from '../controllers/brand.controller';
import { saveProject } from '../controllers/project.controller';
import { validateSaveProject } from '../middleware/validation';

const router: Router = Router();

// POST /api/brand/chat - Agent chat powered by Groq (GPT OSS 120B)
router.post('/chat', chatAgent);

// POST /api/brand/generate - Generate brand names & identities via Groq
router.post('/generate', generateBrand);

// POST /api/brand/logos - Generate logo concepts via Gemini or Flux
router.post('/logos', generateLogos);

// POST /api/brand/save - Save project state to database
router.post('/save', validateSaveProject, saveProject);

export default router;
