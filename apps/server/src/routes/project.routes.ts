import { Router } from 'express';
import {
  saveProject,
  getProject,
  listProjects,
} from '../controllers/project.controller';
import {
  validateSaveProject,
  validateProjectId,
} from '../middleware/validation';

const router: Router = Router();

// Save brand project: POST /save
router.post('/save', validateSaveProject, saveProject);

// Retrieve project list: GET /
router.get('/', listProjects);

// Retrieve project by ID: GET /:id
router.get('/:id', validateProjectId, getProject);

export default router;
