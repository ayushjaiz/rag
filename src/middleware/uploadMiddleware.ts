import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the uploads directory path
const uploadsDir = 'uploads';

// Check if the uploads directory exists; if not, create it
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer to use disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
