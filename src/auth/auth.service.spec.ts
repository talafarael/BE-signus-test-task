import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

const mockUsersService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
        password: 'hashedpassword',
      };

      usersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
      });
    });

    it('should return null when user not found', async () => {
      usersService.findOne.mockResolvedValue(undefined);

      const result = await service.validateUser('nonexistent', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is wrong', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
        password: 'hashedpassword',
      };

      usersService.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('registration', () => {
    it('should create new user', async () => {
      const registrationData = {
        username: 'newuser',
        fullName: 'New User',
        password: 'password123',
      };

      usersService.findOne.mockResolvedValue(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      usersService.create.mockResolvedValue({
        id: 1,
        username: 'newuser',
        fullName: 'New User',
        password: 'hashedpassword',
      });
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.registration(registrationData);

      expect(result).toEqual({
        access_token: 'jwt-token',
      });
    });

    it('should throw error when user exists', async () => {
      const registrationData = {
        username: 'existinguser',
        fullName: 'Existing User',
        password: 'password123',
      };

      usersService.findOne.mockResolvedValue({
        id: 1,
        username: 'existinguser',
        fullName: 'Existing User',
        password: 'somepassword',
      });

      await expect(service.registration(registrationData)).rejects.toThrow(
        new ConflictException('User with this username already exists'),
      );
    });
  });

  describe('login', () => {
    it('should return JWT token', () => {
      const user = {
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
      };

      jwtService.sign.mockReturnValue('login-token');

      const result = service.login(user);

      expect(result).toEqual({
        access_token: 'login-token',
      });
    });
  });
});
