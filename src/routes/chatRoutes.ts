import { Router } from 'express';
import { chatHistory, sendMessage, startChat } from '../controllers/chatController';

const router = Router();

router.post("/start", startChat);
router.post("/message", sendMessage);
router.post("/history", chatHistory);

export default router;          