import jwt from 'jsonwebtoken';
import {authConfig} from '../config/auth.config';
import {Request, Response, request} from 'express';
import {User, UserDocument} from '../schemas/UserSchema';
import { NextFunction } from 'express';
import { IRequestWithUser } from '../interfaces/IRequestWithUser';

const auth = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    let reqToken = req.header('Authorization')?.replace('Bearer ', '') as string;
    if (reqToken) {
        try {
            const data = jwt.verify(reqToken, authConfig.secret);
            const user = await User.findOne({email: (data as any).email, token: reqToken});
            console.log(data.email);
            console.log(user);
            console.log(reqToken)
            if (!user) {
                throw new Error();
            }
            req.user = user;
            next();
        } catch(error) {
            res.status(401).send({
                errorMessage: 'You are not authorized.'
            });
        }
    } else {
        res.status(401).send({
            errorMessage: 'You are not authorized.'
        });
    }
};

module.exports = auth;

