import { Controller, Post, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { IValidUser } from './model/valid-user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Registers a new user with username and password. Returns a Bearer access token upon success.',
  })
  @ApiBody({
    type: RegistrationDto,
    description: 'User registration data: username and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'User registered successfully. Returns an access token.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this username already exists.',
  })
  @Post('registration')
  async registration(@Body() data: RegistrationDto) {
    try {
      return this.authService.registration(data);
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }


  @ApiBearerAuth('access_token')
  @ApiOperation({
    summary: 'Login to the system',
    description: 'Authenticates a user with username and password and returns a Bearer access token.',
  })
  @ApiBody({
    type: LoginRequestDto,
    description: 'User credentials: username and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful login. Returns an access token.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized.',
  })
  @Post('login')
  async login(@Request() req: { user: IValidUser }) {
    return this.authService.login(req.user)
  }
}
