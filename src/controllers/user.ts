import mongoose from 'mongoose';
import {Request, Response} from 'express';
import {UserModel} from '../schemas/UserSchema';
import {IUser} from '../interfaces/IUser';
import BodyParser from 'body-parser';
import {Crypt} from '../utils/Crypt';

export let getUsers = (req: Request, res: Response) => {
    UserModel.find({}, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
};

export let createUser = (req: Request, res: Response) => {
    const crypt: Crypt = new Crypt(10);
    console.log(req.body);
    const user: IUser = JSON.parse(JSON.stringify(req.body));
    

    // IMPLEMENT CHECK IF USER ALREADY EXISTS
    UserModel.find({login: user.login})
             .then(results => {
                 if (results.length === 0) {
                     user.password = crypt.hash(user.password);
                     const newUser = UserModel.create(user);

                     newUser
                     .then(user => {
                     res.status(201).json({
                         status: "Success",
                         data: {user: user.login}
                     });
                     })
                     .catch(error => {
                         res.status(400).json({
                             status: "Failure",
                             data: {errorMessage: error}
                         });
                     });
                 } else {
                     res.status(409).json({
                         status: "Failure",
                         data: {errorMessage: "Resource already exists"}
                     });
                 }
             })
             .catch(error => {
                 res.status(400).json({
                     status: "Failure",
                     data: {errorMessage: "Something went wrong"}
                 });
             });
}