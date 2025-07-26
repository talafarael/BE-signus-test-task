import { IsString } from "class-validator";

export class RegistrationDto {
  @IsString()
  username: string
  @IsString()
  fullName: string
  @IsString()
  password: string
}
