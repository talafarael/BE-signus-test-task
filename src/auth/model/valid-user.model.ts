import { IUser } from "src/users/model/users.model";

export type IValidUser = Omit<IUser, "password">;
