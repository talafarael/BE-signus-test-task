import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema';
import { UserCacheService } from './cache/user-cache.service';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';

const userCacheMock = {
  getUserByUsername: jest.fn(),
  cacheUser: jest.fn(),
};

const dbMock = {
  query: {
    users: {
      findFirst: jest.fn(),
    },
  },
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn(),
};

describe('UsersService', () => {
  let service: UsersService;
  let db: NodePgDatabase<typeof schema>;
  let userCache: UserCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserCacheService,
          useValue: userCacheMock,
        },
        {
          provide: DrizzleAsyncProvider,
          useValue: dbMock,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    db = module.get<NodePgDatabase<typeof schema>>(DrizzleAsyncProvider);
    userCache = module.get<UserCacheService>(UserCacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      password: 'hashedpassword',
    };

    it('should return user from cache', async () => {
      userCacheMock.getUserByUsername.mockResolvedValue(mockUser);

      const result = await service.findOne('testuser');

      expect(userCacheMock.getUserByUsername).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockUser);
      expect(dbMock.query.users.findFirst).not.toHaveBeenCalled();
    });

    it('should get user from database and cache it', async () => {
      userCacheMock.getUserByUsername.mockResolvedValue(null);
      dbMock.query.users.findFirst.mockResolvedValue(mockUser);

      const result = await service.findOne('testuser');

      expect(dbMock.query.users.findFirst).toHaveBeenCalled();
      expect(userCacheMock.cacheUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should return undefined when user not found', async () => {
      userCacheMock.getUserByUsername.mockResolvedValue(null);
      dbMock.query.users.findFirst.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeUndefined();
    });
  });

  describe('getMe', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      fullName: 'Test User',
      password: 'hashedpassword',
    };

    it('should return user when found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser);

      const result = await service.getMe('testuser');

      expect(service.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(mockUser);
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(undefined);

      await expect(service.getMe('nonexistent')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('create', () => {
    const mockUserData = {
      username: 'newuser',
      fullName: 'New User',
      password: 'hashedpassword',
    };

    const mockCreatedUser = {
      id: 1,
      ...mockUserData,
    };

    beforeEach(() => {
      dbMock.insert.mockReturnThis();
      dbMock.values.mockReturnThis();
      dbMock.returning.mockResolvedValue([mockCreatedUser]);
    });

    it('should create a new user successfully', async () => {
      const result = await service.create(mockUserData);

      expect(dbMock.insert).toHaveBeenCalledWith(schema.users);
      expect(dbMock.values).toHaveBeenCalledWith(mockUserData);
      expect(dbMock.returning).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedUser);
    });

    it('should create user with different data', async () => {
      const differentUserData = {
        username: 'anotheruser',
        fullName: 'Another User',
        password: 'anotherhash',
      };

      const differentCreatedUser = {
        id: 2,
        ...differentUserData,
      };

      dbMock.returning.mockResolvedValue([differentCreatedUser]);

      const result = await service.create(differentUserData);

      expect(dbMock.insert).toHaveBeenCalledWith(schema.users);
      expect(dbMock.values).toHaveBeenCalledWith(differentUserData);
      expect(result).toEqual(differentCreatedUser);
    });

    it('should throw error when database insert fails', async () => {
      const dbError = new Error('Database connection failed');
      dbMock.returning.mockRejectedValue(dbError);

      await expect(service.create(mockUserData)).rejects.toThrow(
        'Failed to create user',
      );
    });

    it('should throw error when insert returns unexpected data', async () => {
      dbMock.returning.mockResolvedValue([]);

      await expect(service.create).rejects.toThrow(
        'Failed to create user',
      );
    });

    it('should handle null response from database', async () => {
      dbMock.returning.mockResolvedValue(null);

      await expect(service.create(mockUserData)).rejects.toThrow(
        'Failed to create user',
      );
    });

    it('should not call cache during user creation', async () => {
      await service.create(mockUserData);

      expect(userCacheMock.getUserByUsername).not.toHaveBeenCalled();
      expect(userCacheMock.cacheUser).not.toHaveBeenCalled();
    });
  });
});
