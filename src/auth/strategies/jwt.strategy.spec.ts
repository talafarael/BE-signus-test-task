import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.jwt_secret') {
        return 'test-secret-key';
      }
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should return user data from jwt payload', async () => {
    const payload = {
      sub: '1',
      username: 'testuser',
    };

    const result = await strategy.validate(payload);

    expect(result).toEqual({
      userId: '1',
      username: 'testuser',
    });
  });

  it('should work with different users', async () => {
    const payload = {
      sub: '999',
      username: 'anotheruser',
    };

    const result = await strategy.validate(payload);

    expect(result.userId).toBe('999');
    expect(result.username).toBe('anotheruser');
  });

  it('should use config service to get jwt secret', () => {
    expect(configService.get).toHaveBeenCalledWith('jwt.jwt_secret');
  });
}); 
