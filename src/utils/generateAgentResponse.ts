import { retrieveRelevantChunks } from "../configure/vectordb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { EventEmitter } from 'events';

// Updated generateAgentResponse function to handle streaming
export async function generateAgentResponse(assetId: string, query: string, responseStream: EventEmitter) {
    const relevantTexts = await retrieveRelevantChunks(query, assetId) as string[];

    if (relevantTexts.length === 0) {
        responseStream.emit('data', "I could not find any relevant information for your query. Could you please rephrase or provide more context?");
        responseStream.emit('end');
        return;
    }

    await generateAnswer(query, relevantTexts, responseStream);
}

// Updated generateAnswer function for streaming response
async function generateAnswer(query: string, retrievedChunks: string[], responseStream: EventEmitter) {
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-pro",
        apiKey: process.env.GOOGLE_API_KEY!,
        temperature: 0.7,
        streaming: true, // Ensure the model supports streaming
    });

    const context = retrievedChunks.join('\n\n---\n\n');
    const systemMessage = `You are an AI that answers questions strictly based on the provided context. 
If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;
    const humanMessage = `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer:`;

    try {
        const stream = await llm.stream([
            ["system", systemMessage],
            ["human", humanMessage],
        ]);

        // Stream each chunk to responseStream and the client
        for await (const chunk of stream) {
            responseStream.emit('data', chunk);
        }
        responseStream.emit('end');
    } catch (error) {
        console.error('Error generating response:', error);
        responseStream.emit('error', "There was an issue generating the response. Please try again later.");
    }
}