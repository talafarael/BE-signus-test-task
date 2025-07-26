import { ApiProperty } from "@nestjs/swagger"


export class GetMeResponseDto {
  @ApiProperty()
  id: number
  @ApiProperty({ example: "username" })
  username: string
  @ApiProperty({ example: "Anny Lua" })
  fullName: string
}
