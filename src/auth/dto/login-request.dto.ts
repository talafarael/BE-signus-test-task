import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class LoginRequestDto extends Request {
  @ApiProperty({ example: "username" })
  @IsString()
  username: string
  @ApiProperty({ example: "password" })
  @IsString()
  password: string
}
