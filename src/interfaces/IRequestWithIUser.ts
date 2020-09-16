import { IUser } from "./IUser";

export interface IRequestWithIUser extends Request {
    user: IUser;
}