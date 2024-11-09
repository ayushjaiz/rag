import dotenv from 'dotenv'
dotenv.config();

import app from './app';
import { connectDB } from './configure/mongoose';
// import connectDB from './configure/mongoose';

const PORT = process.env.APP_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});