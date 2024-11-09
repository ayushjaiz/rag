import { retrieveRelevantChunks } from "../configure/vectordb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export async function generateAgentResponse(assetId: string, query: string) {
    const relevantTexts = await retrieveRelevantChunks(query, assetId) as string[];

    // Make sure you have enough relevant texts (if empty, prompt the user for better data)
    if (relevantTexts.length === 0) {
        return "I could not find any relevant information for your query. Could you please rephrase or provide more context?";
    }

    const agentAnswer = await generateAnswer(query, relevantTexts);
    return agentAnswer;
}

async function generateAnswer(query: string, retrievedChunks: string[]) {
    const llm = new ChatGoogleGenerativeAI({
        model: "gemini-pro", // Ensure this model is correct
        apiKey: process.env.GOOGLE_API_KEY!,
        temperature: 0.7,
    });

    // Join retrieved chunks into a single context string with better formatting
    const context = retrievedChunks.join('\n\n---\n\n');  // This adds separation between chunks for clarity

    console.log('Generated Context:', context); // Log the context to see what you are passing to the model

    // Construct the prompt with specific instructions
    const systemMessage = `You are an AI that answers questions strictly based on the provided context. 
If the context doesn't contain enough information, respond with "I do not have enough info to answer this question."`;

    const humanMessage = `Context:\n${context}\n\nQuestion: ${query}\n\nAnswer:`;

    // Invoke the model with system and user prompts
    try {
        const aiResponse = await llm.invoke([
            ["system", systemMessage],
            ["human", humanMessage],
        ]);

        console.log('message generated...')

        const answer = aiResponse.content;
        return answer;
    } catch (error) {
        console.error('Error generating response:', error);
        return "There was an issue generating the response. Please try again later.";
    }
}
