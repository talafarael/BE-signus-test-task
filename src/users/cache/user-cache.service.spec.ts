import { Test, TestingModule } from '@nestjs/testing';
import { UserCacheService } from './user-cache.service';
import { RedisService } from '../../redis/redis.service';
import { IUser } from '../model/users.model';

const mockRedisService = {
  setValue: jest.fn(),
  getValue: jest.fn(),
  deleteKey: jest.fn(),
};

describe('UserCacheService', () => {
  let service: UserCacheService;
  let redisService: jest.Mocked<RedisService>;

  const mockUser: IUser = {
    id: 1,
    username: 'testuser',
    fullName: 'Test User',
    password: 'hashedpassword',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCacheService,
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UserCacheService>(UserCacheService);
    redisService = module.get(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByUsername', () => {
    it('should get user from cache', async () => {
      redisService.getValue.mockResolvedValue(mockUser);

      const result = await service.getUserByUsername('testuser');

      expect(redisService.getValue).toHaveBeenCalledWith('user:username:testuser');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      redisService.getValue.mockResolvedValue(null);

      const result = await service.getUserByUsername('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('setUserByUsername', () => {
    it('should cache user with TTL', async () => {
      redisService.setValue.mockResolvedValue('OK');

      await service.setUserByUsername('testuser', mockUser);

      expect(redisService.setValue).toHaveBeenCalledWith(
        'user:username:testuser',
        mockUser,
        300
      );
    });
  });

  describe('cacheUser', () => {
    it('should cache user by username', async () => {
      redisService.setValue.mockResolvedValue('OK');

      await service.cacheUser(mockUser);

      expect(redisService.setValue).toHaveBeenCalledWith(
        'user:username:testuser',
        mockUser,
        300
      );
    });
  });
}); 
