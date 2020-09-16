import {Schema, Document, Model, model} from 'mongoose';
import jwt from 'jsonwebtoken';
import {authConfig} from '../config/auth.config';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/IUser';

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
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({
        id: user.id,
        email: user.email
    }, authConfig.secret);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

UserSchema.statics.findByCredentials = async (login: string, password: string) => {
    const user = await User.findOne({login});
    if (user) {
        const isPasswordsEqual = bcrypt.compareSync(password, (user as UserDocument)?.password);
        if (!isPasswordsEqual) {
            return undefined;
        }
        return user;
    }
    else {
        throw new Error('Invalid credentials');
    }
}

export const User = model('User', UserSchema);
export type UserDocument = Document & IUser;
