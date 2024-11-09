import { Pinecone } from '@pinecone-database/pinecone';
import { EmbeddingsData, embedTextChunks } from '../utils/embedTextChunks';

const DB_INDEX = 'rag-langchain-nodejs';
const EMBEDDING_DIMENSION = 768; // Match the embedding model dimension

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

/**
 * Stores an array of embeddings in Pinecone under a specified namespace.
 * @param embeddings Array of embedding objects containing embeddings and chunks
 * @param namespace Unique identifier for the storage namespace
 */
async function storeEmbeddings(embeddings: EmbeddingsData[], namespace: string) {
    try {
        console.log('Storing embeddings in vector database...');

        const index = pc.index(DB_INDEX);
        const vectors = embeddings.map((embedding, i) => ({
            id: `chunk-${i}`,
            values: embedding.embedding,
            metadata: { chunk: embedding.chunk },
        }));

        await index.namespace(namespace).upsert(vectors);
        console.log('Embeddings successfully stored.');
    } catch (error) {
        console.error('Error storing embeddings:', error);
        throw new Error('Failed to store embeddings.');
    }
}

/**
 * Creates a Pinecone index if it does not already exist.
 */
const createIndex = async () => {
    try {
        const indexExists = await checkIndexExists();
        if (indexExists) {
            console.log("Index already exists:", DB_INDEX);
            return;
        }

        await pc.createIndex({
            name: DB_INDEX,
            dimension: EMBEDDING_DIMENSION,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1",
                },
            },
        });
        console.log("Index created:", DB_INDEX);
    } catch (error) {
        console.error('Error creating index:', error);
        throw new Error('Failed to create index.');
    }
};

/**
 * Checks if the specified Pinecone index exists.
 * @returns True if the index exists, false otherwise
 */
async function checkIndexExists(): Promise<boolean> {
    try {
        const response = await pc.listIndexes();
        const indexes = response.indexes || [];
        return indexes.some((item) => item.name === DB_INDEX);
    } catch (error) {
        console.error('Error checking index existence:', error);
        throw new Error('Failed to check index existence.');
    }
}

/**
 * Retrieves Pinecone index statistics.
 * @returns Statistics of the specified index
 */
const describeIndexStats = async () => {
    try {
        const index = pc.index(DB_INDEX);
        return await index.describeIndexStats();
    } catch (error) {
        console.error('Error describing index stats:', error);
        throw new Error('Failed to retrieve index stats.');
    }
};

/**
 * Retrieves relevant document chunks from Pinecone based on a query.
 * @param query The query string to embed and search with
 * @param namespace Namespace under which to search
 * @returns Array of relevant chunks
 */
async function retrieveRelevantChunks(query: string, namespace: string) {
    try {
        const [embeddingData] = await embedTextChunks([query]);
        const index = pc.index(DB_INDEX);
        
        const results = await index.namespace(namespace).query({
            vector: embeddingData.embedding,
            topK: 3,
            includeValues: true,
            includeMetadata: true,
        });

        return results.matches.map((match) => match.metadata?.chunk);
    } catch (error) {
        console.error('Error retrieving relevant chunks:', error);
        throw new Error('Failed to retrieve relevant chunks.');
    }
}

export {
    storeEmbeddings,
    createIndex,
    describeIndexStats,
    retrieveRelevantChunks,
    checkIndexExists
};
