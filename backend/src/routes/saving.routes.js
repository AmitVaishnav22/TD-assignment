import {Router} from 'express';
import { saveProgress } from '../controllers/saving.controller.js';

const router = Router();

router.post('/save', saveProgress);

export default router;