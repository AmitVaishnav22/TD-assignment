import {Router} from 'express';
import {getProgress} from '../controllers/tracking.controller.js'

const router = Router();

router.get('/:videoId', getProgress);


export default router;