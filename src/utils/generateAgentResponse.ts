import { retrieveRelevantChunks } from "../configure/vectordb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function generateAgentResponse(assetId: string, query: string) {
    const relevantTexts = await retrieveRelevantChunks(query, assetId) as string[];

    const agentAnswer = await generateAnswer(query, relevantTexts);
    return agentAnswer;
}

async function generateAnswer(query: string, retrievedChunks: string[]) {
    const llm = new ChatGoogleGenerativeAI({
        model: "text-bison-001",
        apiKey: process.env.GOOGLE_API_KEY!,
        temperature: 0.7, // Customize other parameters like temperature, max tokens, etc.
    });

    // Join retrieved chunks into a single context string
    const context = retrievedChunks.join(' ');

    // Construct the prompt with specific instructions
    const systemMessage = `You are an AI that answers questions strictly based on the provided context. 
    If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;

    const humanMessage = `Context: ${context}\n\nQuestion: ${query}`;

    // Invoke the model with system and user prompts
    const aiResponse = await llm.invoke([
        ["system", systemMessage],
        ["human", humanMessage],
    ]);

    // Extract the answer from the model's response
    const answer = aiResponse.content;
    return answer;
}
