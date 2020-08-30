import {Schema, Document, Model, model} from 'mongoose';
import {IPokemon} from '../interfaces/IPokemon';

type PokemonDocument = IPokemon & Document;

const PokemonSchema = new Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    avatarUrl: {
        type: String
    },
    hp: {
        type: Number
    },
    attack: {
        type: Number
    },
    defense: {
        type: Number
    },
    speed: {
        type: Number
    }
});
export const PokemonModel: Model<PokemonDocument> = model<PokemonDocument>('pokemons', PokemonSchema);