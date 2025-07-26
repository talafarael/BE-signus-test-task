import { IValidUser } from "../model/valid-user.model";

export interface LoginRequestDto extends Request {
  user: IValidUser
}
