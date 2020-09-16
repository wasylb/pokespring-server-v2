const express = require('express');
import {Request, Response} from 'express';
import * as userController from '../controllers/user.controller';

const auth = require('../middlewares/auth');
const userRouter = express.Router();

userRouter.get('/users', auth, userController.getUsers);
userRouter.get('/users/user/:id', auth, userController.getUser);
userRouter.post('/users/register', userController.register);
userRouter.post('/users/login', userController.login);
//router.post('/users/logout', auth, async (req: IRequestWithIUser, res: Response) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return tokens.token != req.token;
//         });
//         await req.user.save();
//         res.send();
//     } catch(error) {
//         res.status(500).send(error);
//     }
// });
/*router.get('/users/me', authenticate, async(req: Request, res: Response) => {
    res.send(req.user);
});*/

module.exports = userRouter;