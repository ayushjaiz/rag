import { Router } from 'express';
import { sendMessage, startChat } from '../controllers/chatController';

const router = Router();

router.post("/start", startChat);
router.post("/message", sendMessage);
router.post("/history", ()=>{});

export default router;          