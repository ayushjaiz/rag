import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';
import chatRoutes from './routes/chatRoutes';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

export default app; 