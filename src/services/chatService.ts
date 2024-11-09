import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/chat";
import { generateAgentResponse } from "../utils/generateAgentResponse";

export const startChatSession = async (assetId: string) => {
    const chatThreadId = uuidv4();
    await Chat.create({
        chatThreadId,
        assetId,
    });
    return chatThreadId;
};

export const processUserMessage = async (chatThreadId: string, message: string) => {
    const timeString = new Date().toISOString();

    // Retrieve chat document to get the assetId
    const chat = await Chat.findOne({ chatThreadId });
    if (!chat) {
        throw new Error("Chat thread not found");
    }

    const { assetId } = chat;

    // Generate agent's response based on assetId and user message
    const agentResponse = await generateAgentResponse(assetId, message);

    // Append both user and agent messages in a single update
    await Chat.findOneAndUpdate(
        { chatThreadId },
        {
            $push: {
                messages: [
                    { timeString, by: "user", message },
                    { timeString: new Date().toISOString(), by: "agent", message: agentResponse }
                ]
            }
        },
        { new: true }
    );

    return agentResponse;
};


export const retrieveChat = async (chatThreadId: string) => {
    return await Chat.findOne({ chatThreadId });
}