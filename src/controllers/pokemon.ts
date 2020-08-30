import mongoose from 'mongoose';
import {Request, Response} from 'express';
import {PokemonModel} from '../schemas/PokemonSchema';

export let getPokemons = (req: Request, res: Response) => {
    PokemonModel.find({}, (err, pokemon) => {
        if (err) {
            res.send(err);
        }
        res.json(pokemon);
    });
};
