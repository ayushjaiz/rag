import { Router } from 'express';
import { processDocument } from '../controllers/documentController';
import upload from '../middleware/uploadMiddleware';

const router = Router();

router.post('/process', upload.single("file"), processDocument);

export default router;          