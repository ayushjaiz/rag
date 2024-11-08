import app from './app';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const PORT = process.env.APP_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});