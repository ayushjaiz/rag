import { Request, Response } from "express";
import { startChatSession, processUserMessage } from "../services/chatService";

export const startChat = async (req: Request, res: Response) => {
    const { assetId } = req.body;
    if (!assetId) {
        res.status(400).json({ error: "Asset ID is required" });
        return;
    }

    const chatThreadId = await startChatSession(assetId);
    res.status(200).json({ chatThreadId });
};

export const sendMessage = async (req: Request, res: Response) => {
    const { chatThreadId, message } = req.body;
    if (!chatThreadId || !message) {
        res.status(400).json({ error: "Chat thread ID and message are required" });
        return;
    }

    const agentResponse = await processUserMessage(chatThreadId, message);
    res.status(200).json({ response: agentResponse });
};
