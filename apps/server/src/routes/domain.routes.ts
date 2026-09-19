import { Router } from 'express';
import { checkDomainAvailability } from '../controllers/domain.controller';

const router: Router = Router();

// POST /api/domain/check - Check domain & social handles
router.post('/check', checkDomainAvailability);

export default router;
