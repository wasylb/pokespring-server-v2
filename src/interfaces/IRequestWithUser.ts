import {IUser} from './IUser';
import {Request} from 'express';
import {Document} from 'mongoose';

export interface IRequestWithUser extends Request {
    user: Document;
}