import dotenv from 'dotenv'
dotenv.config();

import app from './app';

const PORT = process.env.APP_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});