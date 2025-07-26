import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegistrationDto } from './dto/registration.dto';
import { LoginRequestDto } from './dto/login-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("registration")
  async registration(@Body() data: RegistrationDto) {
    try {
      return this.authService.registration(data)
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: LoginRequestDto) {
    return this.authService.login(req.user)
  }
}
