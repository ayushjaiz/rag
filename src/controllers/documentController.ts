import { Request, Response } from "express";
import { deleteFile, extractContent } from "../utils/fileProcessor";
import path from "path";
import { embedTextChunks } from "../utils/embedTextChunks";
import { createIndex, storeEmbeddings } from "../configure/vectordb";
import { chunkTexts } from "../utils/chunkTexts";
import { v4 as uuidv4 } from "uuid";

export const processDocument = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const assetId = uuidv4();
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    try {
        console.log("File detected. Processing...");

        // Read content from the file and extract text based on file extension
        const contentText = await extractContent(filePath, fileExt);

        // Split content into manageable chunks
        const textChunks = chunkTexts(contentText);

        // Generate embeddings for each text chunk
        const embeddings = await embedTextChunks(textChunks);

        // Create index if not already created, then store embeddings
        await createIndex();
        await storeEmbeddings(embeddings, assetId);

        console.log("Document processed successfully.");
        return res.status(200).json({ assetId, message: "Document processed successfully" });
    } catch (error) {
        console.error("Error processing document:", error);
        return res.status(500).json({ error: "Failed to process document" });
    } finally {
        try {
            await deleteFile(filePath);
            console.log("Temporary file deleted.");
        } catch (cleanupError) {
            console.error("Error deleting file:", cleanupError);
        }
    }
};
