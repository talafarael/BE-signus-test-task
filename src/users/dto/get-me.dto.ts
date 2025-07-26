import { IJwtPayoload } from "src/auth/model/jwt.model";

export interface GetMeRequestDto extends Request {
  user: IJwtPayoload
}
