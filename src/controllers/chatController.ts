import { Request, Response } from "express";
import { startChatSession, processUserMessage, retrieveChat } from "../services/chatService";

export const startChat = async (req: Request, res: Response) => {
    const { assetId } = req.body;

    if (!assetId) {
        res.status(400).json({ error: "Asset ID is required" });
        return;
    }

    try {
        const chatThreadId = await startChatSession(assetId);
        res.status(200).json({ chatThreadId });
    } catch (error) {
        console.error("Error starting chat session:", error);
        res.status(500).json({ error: "Failed to start chat session" });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    const { chatThreadId, message } = req.body;

    if (!chatThreadId || !message) {
        res.status(400).json({ error: "Chat thread ID and message are required" });
        return;
    }

    try {
        const agentResponse = await processUserMessage(chatThreadId, message);
        res.status(200).json({ response: agentResponse });
    } catch (error) {
        console.error("Error processing user message:", error);
        res.status(500).json({ error: "Failed to process user message" });
    }
};

export const chatHistory = async (req: Request, res: Response) => {
    const { chatThreadId } = req.body;

    if (!chatThreadId) {
        res.status(400).json({ error: "Chat thread ID is required" });
        return;
    }

    try {
        const chatHistory = await retrieveChat(chatThreadId);
        res.status(200).json({ chatHistory });
    } catch (error) {
        console.error("Error retrieving chat history:", error);
        res.status(500).json({ error: "Failed to retrieve chat history" });
    }
};
