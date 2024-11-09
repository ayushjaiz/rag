import { Request, Response } from "express";
import { startChatSession, retrieveChat } from "../services/chatService";
import { EventEmitter } from 'events';
import { Chat } from "../models/chat";
import { generateAgentResponse } from "../utils/generateAgentResponse";

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

    const responseStream = new EventEmitter();
    let agentResponseContent = ""; // Accumulate the full agent response

    // Send data to the client as chunks arrive
    responseStream.on('data', (chunk) => {
        res.write(`data: ${chunk.content}\n\n`);
        console.log(chunk.content);
        agentResponseContent += chunk.content;
    });

    // End the response when streaming is done
    responseStream.on('end', async () => {
        res.end();

        // console.log(agentResponseContent);
        try {
            await Chat.findOneAndUpdate(
                { chatThreadId },
                {
                    $push: {
                        messages: [
                            { timeString: new Date().toISOString(), role: 'USER', message },
                            { timeString: new Date().toISOString(), role: 'AGENT', message: agentResponseContent }
                        ]
                    }
                },
                { new: true }
            );
            console.log("Messages successfully stored in database.");
        } catch (error) {
            console.error("Error storing messages in database:", error);
        }
    });

    // Handle errors in the streaming process
    responseStream.on('error', (error) => {
        res.write(`data: ${JSON.stringify({ error })}\n\n`);
        res.end();
    });

    try {
        const chat = await Chat.findOne({ chatThreadId });
        if (!chat) throw new Error("Chat thread not found");

        const agentResponse = await generateAgentResponse(chat.assetId, message, responseStream);
        return;
    } catch (error) {
        console.error("Error processing user message:", error);
        responseStream.emit('error', "Failed to process user message.");
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