import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export interface EmbeddingsData {
    embedding: number[];
    chunk: string;
}

export async function embedTextChunks(textChunks: string[]): Promise<EmbeddingsData[]> {
    console.log('creating embeddings...');

    const embedder = new GoogleGenerativeAIEmbeddings({
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
        apiKey: process.env.GOOGLE_API_KEY,
    });

    const embeddingsDataArr: EmbeddingsData[] = [];

    for (const chunk of textChunks) {
        const embedding: number[] = await embedder.embedQuery(chunk);
        embeddingsDataArr.push({
            embedding,
            chunk,
        });
    }

    return embeddingsDataArr;
}
