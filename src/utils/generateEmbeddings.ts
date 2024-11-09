import { GoogleGenerativeAI } from "@google/generative-ai";

// const geminiApiKey = process.env.GEMINI_API_KEY as string;
const geminiApiKey = "AIzaSyCNUSECXxqiMla_3Qu-XK1SrntyNUNNZIk";

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

const generateEmbeddings = async (text: string) => {
    const result = await model.embedContent(text);
    console.log(result.embedding.values);
}

export default generateEmbeddings;