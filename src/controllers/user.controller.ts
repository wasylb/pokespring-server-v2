import { Request, Response, request } from 'express';
import { User, UserDocument } from '../schemas/UserSchema';
import { IUser } from '../interfaces/IUser';
import bcrypt from 'bcrypt';
import { authConfig } from '../config/auth.config';

export let getUsers = (req: Request, res: Response) => {
    User.find({}, (err, user) => {
        if (err) {
            res.send({
                status: "Failure",
                message: "Users not found",
                data: { err }
            });
        }
        res.json({
            status: "Success",
            message: "Users retrieved",
            data: { user }
        });
    });
};

export let getUser = (req: Request, res: Response) => {
    User.findById(req.params.id, (err, user: any) => {
        if (err) {
            res.status(404).json({
                status: "Failure",
                message: "User with given ID doesn\'t exist",
                data: { err }
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
                            message: "User has been registered",
                            data: { user: (user as unknown as UserDocument).login }
                        });
                    })
                    .catch(error => {
                        res.status(400).json({
                            status: "Failure",
                            message: "Something went wrong",
                            data: { error }
                        });
                    });
            } else {
                res.status(409).json({
                    status: "Failure",
                    message: "User with provided credentials already exists",
                    data: {}
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
        let userFound;
        try {
             userFound = await User.schema.statics.findByCredentials(login, password);
        } catch(err) {
            res.status(401).send({
                status: "Failure",
                message: "User and/or password are invalid",
                data: {err}
            });
        }
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
                user.token = token;
            }
            const token = user.token;
            res.send({
                status: "Success",
                message: "User has been logged in successfully",
                data: {
                    user,
                    token
                }
            });

        }
        else {
            return res.status(401).json({
                status: "Failure",
                message: "User and/or password are invalid",
                data: {}
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "Failure",
            message: "Something went wrong",
            data: {}
        });
    }
}

export let isTokenValid = async (req: Request, res: Response) => {
    try {
        const { id, token } = req.body;
        const user = (await User.findById(id)) as UserDocument;

        if (user) {
            const tokenFound = user.token === token;
            if (tokenFound) {
                res.send({
                    status: "Success",
                    message: "Token has been validated",
                    data: {}
                });
            } else {
                res.status(401).json({
                    status: "Failure",
                    message: 'Token is invalid',
                    data: {}
                });
            }
        } else {
            res.status(401).json({
                status: "Failure",
                message: 'User with provided ID does not exist',
                data: {}
            });
        }
    } catch (error) {
        res.status(400).send({
            status: "Failure",
            message: "Something went wrong",
            data: {}
        });
    }
}

export let logout = async (req: Request, res: Response) => {
    const userId = req.body.id;
    const user = (await User.findById(userId)) as UserDocument;
    if (user) {
        user.token = '';
        user.save();
        res.status(200).send({
            status: "Success",
            message: "User has been signed out",
            data: {}
        });
        return;
    }
    res.status(404).json({
        status: "Failure",
        message: 'User with provided ID does not exist',
        data: {}
    });
}