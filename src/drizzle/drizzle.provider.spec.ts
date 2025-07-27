import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DrizzleAsyncProvider } from './drizzle.provider';
import dbConfig from '../config/db.config';

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(),
  })),
}));

jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn().mockReturnValue({
    query: {},
    insert: jest.fn(),
    select: jest.fn(),
  }),
}));

describe('DrizzleProvider', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(dbConfig)],
      providers: [
        {
          provide: DrizzleAsyncProvider,
          useFactory: async (configService: ConfigService) => {
            const config = configService.get('database');
            return {
              config,
              mockDb: 'drizzle-instance',
            };
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should inject ConfigService correctly', () => {
    expect(configService).toBeDefined();
  });

  it('should work with different database configs', async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              database: {
                host: 'localhost',
                port: 5432,
                username: 'test',
                password: 'test',
                database: 'test_db',
              },
            }),
          ],
        }),
      ],
      providers: [
        {
          provide: DrizzleAsyncProvider,
          useFactory: async (configService: ConfigService) => {
            const dbConfig = configService.get('database');
            return { database: dbConfig };
          },
          inject: [ConfigService],
        },
      ],
    }).compile();

    const provider = testModule.get(DrizzleAsyncProvider);
    expect(provider).toBeDefined();

    await testModule.close();
  });
});
