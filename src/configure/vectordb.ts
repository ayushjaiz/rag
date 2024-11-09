import { Pinecone } from '@pinecone-database/pinecone';

import { EmbeddingsData, embedTextChunks } from '../utils/embedTextChunks';

const DB_INDEX = 'rag-langchain-nodejs'

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

/**
 * 
 * @param {*} embeddings Array of embedding & chunk: [{embedding: [], chunk: ''}]
 * @param {*} namespace 
 */
async function storeEmbeddings(embeddings: EmbeddingsData[], namespace: string) {
    console.log('storing emdeddings in vector db...');
    const index = pc.index(DB_INDEX);

    for (let i = 0; i < embeddings.length; i++) {
        await index.namespace(namespace).upsert([{
            id: `chunk-${i}`,
            values: embeddings[i].embedding,
            metadata: { chunk: embeddings[i].chunk }
        }]);
    }

    console.log('Embedddings sucessfully stored..')
}

const createIndex = async () => {
    await pc.createIndex({
        name: DB_INDEX,

        // should match embedding model name 786 for genai
        dimension: 768,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        }
    });
    console.log('Index created', DB_INDEX)
}

async function checkIndexExists() {
    // List all indexes
    const response = await pc.listIndexes();
    const indexes = response.indexes;

    if (!indexes) {
        return true;
    }

    // Check if the desired index is in the list
    return indexes.find(item => item.name === DB_INDEX);
}

const describeIndexStats = async () => {
    const index = pc.index(DB_INDEX);
    const stats = await index.describeIndexStats();
    return stats;
}

// https://docs.pinecone.io/guides/data/query-data
async function retrieveRelevantChunks(query: string, namespace: string) {
    const embeddingDataArr = await embedTextChunks([query]);
    const index = pc.index(DB_INDEX);
    const results = await index.namespace(namespace).query({
        vector: embeddingDataArr[0].embedding,
        topK: 2,
        includeValues: true,
        includeMetadata: true,
    });
    return results.matches.map(match => match.metadata?.chunk);
}

// Storing embeddings in Pinecone
//await storeEmbeddings(embeddings, 'your-namespace');

export {
    storeEmbeddings,
    createIndex,
    describeIndexStats,
    retrieveRelevantChunks,
    checkIndexExists
}
