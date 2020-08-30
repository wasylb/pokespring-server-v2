import {Schema, Document, Model, model} from 'mongoose';
import {IUser} from '../interfaces/IUser';

type UserDocument = IUser & Document;

const UserSchema = new Schema({
    id: {
        type: String,
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    visibleName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});
export const UserModel: Model<UserDocument> = model<UserDocument>('users', UserSchema);