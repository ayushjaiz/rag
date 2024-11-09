import { Request, Response } from "express";
import { deleteFile, extractContent } from "../utils/fileProcessor";
import path from "path";

import { embedTextChunks } from "../utils/embedTextChunks";
import { checkIndexExists, createIndex, describeIndexStats, storeEmbeddings } from "../configure/vectordb";
import { chunkTexts } from "../utils/chunkTexts";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

export const processDocument = async (req: Request, res: Response) => {
    let filePath;
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        console.log('file is there')

        // Generate a unique asset ID for the chat
        const assetId = uuidv4();

        filePath = req.file.path;
        const fileExt = path.extname(req.file.originalname).toLowerCase();

        // Read content from file
        const contentText = await extractContent(filePath, fileExt);

        // divide content into chunks
        const textChunks = chunkTexts(contentText);

        // generate embeddings of chunk
        const embeddings = await embedTextChunks(textChunks);

        // creating index
        const indexExists = await checkIndexExists();
        console.log('Index exists', indexExists)
        if (!indexExists) {
            await createIndex();
        } else {
            const indexStats = await describeIndexStats()
            console.log('Index stats', indexStats)
        }

        // store embeddings in vector db
        await storeEmbeddings(embeddings, assetId);


        res.status(200).json({ success: "success" });

        // Respond with asset ID
        res.status(200).json({ assetId, message: "Document processed succesfully" });
    } catch (error) {
        console.error("Error processing document:", error);
        res.status(500).json({ error: "Failed to process document" });
    } finally {
        await deleteFile(filePath as string);
    }
};

