import { Router } from 'express';
import { startChat } from '../controllers/chatController';

const router = Router();


router.post("/start", startChat);
// router.post("/message", sendMessage);

export default router;          