import { Router } from 'express';
import {
  getArchetypes,
  getExemplars,
  previewPrompt,
  getSampleImage,
  generateSuite,
  getStyles,
} from '../controllers/logo.controller';

const router: Router = Router();

// GET /api/logos/archetypes - List 7 archetype cards
router.get('/archetypes', getArchetypes);

// GET /api/logos/archetypes/:archetype/exemplars - List exemplars for an archetype
router.get('/archetypes/:archetype/exemplars', getExemplars);

// POST /api/logos/preview-prompt - Preview stitched prompt
router.post('/preview-prompt', previewPrompt);

// GET /api/logos/styles - UI style vocabulary → archetype mapping
router.get('/styles', getStyles);

// POST /api/logos/suite - One real FLUX.2 mark per UI style, in one call
router.post('/suite', generateSuite);

// GET /api/logos/sample-image/:archetype/:fileName - Serve reference logo image
router.get('/sample-image/:archetype/:fileName', getSampleImage);

export default router;
