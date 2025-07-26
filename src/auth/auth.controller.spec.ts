import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConflictException } from '@nestjs/common';

const mockAuthService = {
  registration: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registration', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'jwt-token',
      };

      authService.registration.mockResolvedValue(expectedResponse);

      const result = await controller.registration(userData);

      expect(authService.registration).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw error when user already exists', async () => {
      const userData = {
        username: 'testuser',
        fullName: 'Test User',
        password: 'password123',
      };

      const conflictError = new ConflictException(
        'User with this username already exists',
      );
      authService.registration.mockRejectedValue(conflictError);

      await expect(controller.registration(userData)).rejects.toThrow(
        'User with this username already exists',
      );
    });
  });

  describe('login', () => {
    it('should login user successfully', async () => {
      const loginRequest = {
        user: {
          id: 1,
          username: 'testuser',
          fullName: 'Test User',
        },
      };

      const expectedResponse = {
        access_token: 'jwt-token',
      };

      authService.login.mockReturnValue(expectedResponse);

      const result = await controller.login(loginRequest as any);

      expect(authService.login).toHaveBeenCalledWith(
        loginRequest.user,
      );
      expect(result).toEqual(expectedResponse);
    });
  });
});
