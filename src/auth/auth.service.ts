import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { IValidUser } from './model/valid-user.model';
import { JwtService } from '@nestjs/jwt';
import { RegistrationDto } from './dto/registration.dto';
import * as bcrypt from 'bcrypt';
import { IJwt, IJwtPayoload } from './model/jwt.model';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }
  async validateUser(username: string, pass: string): Promise<IValidUser | null> {
    const user = await this.usersService.findOne(username);
    if (user &&
      user.password &&
      (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async registration(reqBody: RegistrationDto): Promise<AuthResponseDto> {
    const { password, ...data } = reqBody;
    const user = await this.usersService.findOne(data.username);

    if (user) {
      throw new ConflictException('User with this username already exists');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await this.usersService.create({
      ...data,
      password: hashedPassword,
    });

    return this.createJwt({ userId: newUser.id, username: newUser.username });

  }
  login(user: IValidUser): AuthResponseDto {
    return this.createJwt({
      userId: user.id,
      username: user.username
    })
  }
  private createJwt(user: IJwtPayoload): AuthResponseDto {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
