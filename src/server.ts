import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose, { mongo } from 'mongoose';
import * as pokemonController from './controllers/pokemon.controller';

const auth = require('./middlewares/auth');


const app = express();
const dbURI = 'mongodb://localhost/';
const dbName = 'pokespring';
const appPort = 3000;

const userRouter = require('./routers/user.router');
app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

console.clear();
mongoose.connect(dbURI + dbName, { useNewUrlParser: true })
        .then(() => {
            console.log('DB connection established successfully');
        })
        .catch(() => {
            console.log(`Error while connecting database. (${dbURI+dbName})`);
            process.exit();
        });

app.get('/pokemons', auth, pokemonController.getPokemons);

app.use(userRouter);

app.listen(appPort, () => console.log(`App running on port ${appPort}`));