
// import { PineconeClient } from "pinecone-client";
// import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import { TaskType } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import { Chat } from "../models/chat";

// const pinecone = new PineconeClient(process.env.PINECONE_API_KEY!);
// const embedder = new GoogleGenerativeAIEmbeddings({
//     model: "text-embedding-004",
//     taskType: TaskType.RETRIEVAL_DOCUMENT,
//     apiKey: process.env.GOOGLE_API_KEY!
// });

export const startChatSession = async (assetId: string) => {
    const chatThreadId = uuidv4();
    await Chat.create({
        chatThreadId,
        assetId,
        messages: []
    });
    return chatThreadId;
};

// export const processUserMessage = async (chatThreadId: string, message: string) => {
//     const timeString = new Date().toISOString();

//     // Append user message to the chat in MongoDB
//     await Chat.findOneAndUpdate(
//         { chatThreadId },
//         { $push: { messages: { timeString, by: "user", message } } },
//         { new: true }
//     );

//     const userEmbedding = await embedder.embedQuery(message);
//     const results = await pinecone.query({
//         namespace: chatThreadId,
//         queryVector: userEmbedding,
//         topK: 5
//     });

//     const agentResponse = generateAgentResponse(results.matches, message);

//     // Append agent's response to the chat in MongoDB
//     await Chat.findOneAndUpdate(
//         { chatThreadId },
//         { $push: { messages: { timeString: new Date().toISOString(), by: "agent", message: agentResponse } } },
//         { new: true }
//     );

//     return agentResponse;
// };

// function generateAgentResponse(matches: any[], userMessage: string) {
//     const relevantTexts = matches.map(match => match.metadata.text).join("\n");
//     return `Based on the document: "${relevantTexts}". Answering: ${userMessage}`;
// }
