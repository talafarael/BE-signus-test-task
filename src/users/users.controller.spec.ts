import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const mockUsersService = {
  getMe: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      password: 'hashedpassword',
    };

    const mockRequest = {
      user: { username: 'testuser' },
    };

    it('should return user profile without password', async () => {
      usersService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest as any);

      expect(usersService.getMe).toHaveBeenCalledWith('testuser');
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        fullName: 'Test User',
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should return UserResponseDto structure', async () => {
      usersService.getMe.mockResolvedValue(mockUser);

      const result = await controller.getProfile(mockRequest as any);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('username');
      expect(result).toHaveProperty('fullName');
      expect(typeof result.id).toBe('number');
      expect(typeof result.username).toBe('string');
      expect(typeof result.fullName).toBe('string');
    });

    it('should handle service errors', async () => {
      usersService.getMe.mockRejectedValue(new Error('User not found'));

      await expect(controller.getProfile(mockRequest as any)).rejects.toThrow(
        'User not found',
      );
    });
  });
});
