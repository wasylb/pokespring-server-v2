import express from 'express';

const app = express();
app.get('/', (req: object, res: object) => {
    res.send('Hello');
});

app.listen(3000, () => console.log('App running on port 3000'));