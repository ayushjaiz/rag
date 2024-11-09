import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { startChatSession } from "../services/chatService";


export const startChat = async (req: Request, res: Response) => {
    const { assetId } = req.body;
    if (!assetId) {
        res.status(400).json({ error: "Asset ID is required" });
        return;
    }

    const chatThreadId = await startChatSession(assetId);
    res.status(200).json({ chatThreadId });
};

// export const sendMessage = async (req: Request, res: Response) => {
//     const { chatThreadId, message } = req.body;
//     if (!chatThreadId || !message) {
//         return res.status(400).json({ error: "Chat thread ID and message are required" });
//     }

//     const agentResponse = await processUserMessage(chatThreadId, message);
//     res.status(200).json({ response: agentResponse });
// };
