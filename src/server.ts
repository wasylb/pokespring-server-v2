import express from 'express';
import bodyParser from 'body-parser';
import mongoose, { mongo } from 'mongoose';

import * as pokemonController from './controllers/pokemon';
import * as userController from './controllers/user';



const app = express();
const dbURI = 'mongodb://localhost/';
const dbName = 'pokespring';
const appPort = 3000;

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

app.get('/pokemons', pokemonController.getPokemons);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUser);
app.post('/users', userController.createUser);






app.listen(appPort, () => console.log(`App running on port ${appPort}`));