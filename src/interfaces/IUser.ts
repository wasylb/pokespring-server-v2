import { IUserToken } from "./IUserToken";

export interface IUser {
    id: string;
    login: string;
    password: string;
    visibleName: string;
    email: string;
    token: string;
}