import express from 'express';
import cors from 'cors';
import documentRoutes from './routes/documentRoutes';


const app = express();
app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/documents', documentRoutes);


export default app; 