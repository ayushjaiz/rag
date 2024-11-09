function chunkTexts(text: string, chunkSize = 1000, overlapSize = 200) {
    console.log('Dividing text into chunks...');

    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        const chunk = text.slice(start, end);
        chunks.push(chunk);
        start += chunkSize - overlapSize; // Move forward by chunkSize minus overlap
    }

    return chunks;
}

export {
    chunkTexts
}