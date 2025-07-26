import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { IsFullName } from "src/common/validators/full-name.validator";

export class RegistrationDto {
  @ApiProperty({ example: "antoni" })
  @IsString()
  username: string
  @ApiProperty({ example: "anton german" })
  @IsString()
  @IsFullName()
  fullName: string
  @ApiProperty({ example: "password" })
  @IsString()
  password: string
}
