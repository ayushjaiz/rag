import fs from "fs/promises";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export const extractContent = async (filePath: string, fileExt: string): Promise<string> => {
    console.log('Extracting content...');
    
    let content = "";

    if (fileExt === ".txt") {
        content = await fs.readFile(filePath, "utf-8");
    } else if (fileExt === ".pdf") {
        const buffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(buffer);
        content = pdfData.text;
    } else if (fileExt === ".doc" || fileExt === ".docx") {
        const result = await mammoth.extractRawText({ path: filePath });
        content = result.value;
    } else {
        throw new Error("Unsupported file type");
    }

    return content;
};

export const deleteFile = async (filePath: string) => {
    await fs.unlink(filePath);
};
