import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import redisConfig from '../config/redis.config';

// Mock ioredis
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    disconnect: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    ttl: jest.fn(),
    expire: jest.fn(),
    keys: jest.fn(),
    flushall: jest.fn(),
    ping: jest.fn(),
  }));
});

describe('RedisService', () => {
  let service: RedisService;
  let redisInstance: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(redisConfig),
      ],
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redisInstance = service as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should extend Redis and implement OnModuleDestroy', () => {
      expect(service).toBeInstanceOf(RedisService);
      expect(service.onModuleDestroy).toBeDefined();
    });

    it('should setup event listeners on construction', () => {
      expect(redisInstance.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(redisInstance.on).toHaveBeenCalledWith('ready', expect.any(Function));
      expect(redisInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(redisInstance.on).toHaveBeenCalledWith('close', expect.any(Function));
      expect(redisInstance.on).toHaveBeenCalledWith('reconnecting', expect.any(Function));
      expect(redisInstance.on).toHaveBeenCalledWith('end', expect.any(Function));
    });
  });

  describe('setValue', () => {
    it('should set string value without TTL', async () => {
      redisInstance.set.mockResolvedValue('OK');

      const result = await service.setValue('test-key', 'test-value');

      expect(redisInstance.set).toHaveBeenCalledWith('test-key', 'test-value');
      expect(result).toBe('OK');
    });

    it('should set string value with TTL', async () => {
      redisInstance.setex.mockResolvedValue('OK');

      const result = await service.setValue('test-key', 'test-value', 60);

      expect(redisInstance.setex).toHaveBeenCalledWith('test-key', 60, 'test-value');
      expect(result).toBe('OK');
    });

    it('should stringify object values', async () => {
      redisInstance.set.mockResolvedValue('OK');
      const objectValue = { id: 1, name: 'test' };

      await service.setValue('test-key', objectValue);

      expect(redisInstance.set).toHaveBeenCalledWith('test-key', JSON.stringify(objectValue));
    });

    it('should stringify object values with TTL', async () => {
      redisInstance.setex.mockResolvedValue('OK');
      const objectValue = { id: 1, name: 'test' };

      await service.setValue('test-key', objectValue, 120);

      expect(redisInstance.setex).toHaveBeenCalledWith('test-key', 120, JSON.stringify(objectValue));
    });
  });

  describe('getValue', () => {
    it('should return null when key does not exist', async () => {
      redisInstance.get.mockResolvedValue(null);

      const result = await service.getValue('non-existent-key');

      expect(result).toBeNull();
    });

    it('should return string value as is', async () => {
      redisInstance.get.mockResolvedValue('test-value');

      const result = await service.getValue('test-key');

      expect(result).toBe('test-value');
    });

    it('should parse JSON object values', async () => {
      const objectValue = { id: 1, name: 'test' };
      redisInstance.get.mockResolvedValue(JSON.stringify(objectValue));

      const result = await service.getValue('test-key');

      expect(result).toEqual(objectValue);
    });

    it('should return string value when JSON parsing fails', async () => {
      redisInstance.get.mockResolvedValue('invalid-json{');

      const result = await service.getValue('test-key');

      expect(result).toBe('invalid-json{');
    });
  });

  describe('deleteKey', () => {
    it('should delete existing key and return 1', async () => {
      redisInstance.del.mockResolvedValue(1);

      const result = await service.deleteKey('test-key');

      expect(redisInstance.del).toHaveBeenCalledWith('test-key');
      expect(result).toBe(1);
    });

    it('should return 0 when key does not exist', async () => {
      redisInstance.del.mockResolvedValue(0);

      const result = await service.deleteKey('non-existent-key');

      expect(result).toBe(0);
    });
  });

});
