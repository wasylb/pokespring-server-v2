import { Request, Response, request } from 'express';
import { User, UserDocument} from '../schemas/UserSchema';
import { IUser } from '../interfaces/IUser';
import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth.config';

export let getUsers = (req: Request, res: Response) => {
    User.find({}, (err, user) => {
        if (err) {
            res.send(err);
        }
        res.json(user);
    });
};

export let getUser = (req: Request, res: Response) => {
    User.findById(req.params.id, (err, user: any) => {
        if (err) {
            res.status(404).json({
                status: "Failure",
                data: { errorMessage: 'User with given ID doesn\'t exist' }
            });
        }
        const userReturned = {
            id: user?._id,
            login: user?.login,
            email: user?.email,
            visibleName: user?.visibleName,
            token: user?.token
        }
        res.json(userReturned);
    });
};

export let register = (req: Request, res: Response) => {
    const user: IUser = req.body as IUser;

    User.find({ login: user.login })
        .then(results => {
            if (results.length === 0) {
                console.log(user);
                user.password = bcrypt.hashSync(user.password, authConfig.hashRounds);
                const newUser = User.create(user);

                newUser
                    .then(user => {
                        res.status(201).json({
                            status: "Success",
                            data: { user: (user as unknown as UserDocument).login }
                        });
                    })
                    .catch(error => {
                        res.status(400).json({
                            status: "Failure",
                            data: { errorMessage: error }
                        });
                    });
            } else {
                res.status(409).json({
                    status: "Failure",
                    data: { errorMessage: "Resource already exists" }
                });
            }
        })
        .catch(error => {
            res.status(400).json({
                status: "Failure",
                data: { errorMessage: "Something went wrong" }
            });
        });
}

export let login = async (req: Request, res: Response) => {
    try {
        const { login, password } = req.body;
        const userFound = await User.schema.statics.findByCredentials(login, password);
        console.log(req.body);
        if (userFound) {
            const user = {
                id: userFound._id,
                login: userFound.login,
                email: userFound.email,
                visibleName: userFound.visibleName,
                token: userFound.token
            }
            if (!user.token) {
                const token = await userFound.generateAuthToken();
                res.send({ user, token });
            }
            const token = user.token;
            res.send({ user, token});
            
        }
        else {
            return res.status(401).json({
                errorMessage: 'Login failed. Check credentials provided'
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export let isTokenValid = async (req: Request, res: Response) => {
    try {
        const { id, token } = req.body;
        const user = (await User.findById(id)) as UserDocument;

        if (user) {
            const tokenFound = user.token === token;
            if (tokenFound) {
                res.send({status: "Success",
                          data: {}});
            } else {
                res.status(401).json({
                    errorMessage: 'Token is not valid'
                });
            }
        } else {
            res.status(401).json({
                errorMessage: 'User with provided ID does not exist'
            });
        }
    } catch(error) {
        res.status(400).send(error);
    }
}