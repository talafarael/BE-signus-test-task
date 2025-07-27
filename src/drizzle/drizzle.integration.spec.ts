import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle.module';
import { DrizzleAsyncProvider } from './drizzle.provider';
import * as schema from './schema';
import dbConfig from '../config/db.config';

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue({}),
    end: jest.fn().mockResolvedValue({}),
    query: jest.fn().mockResolvedValue({ rows: [] }),
  })),
}));

jest.mock('drizzle-orm/node-postgres', () => ({
  drizzle: jest.fn().mockReturnValue({
    query: {
      users: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
    insert: jest.fn().mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn(),
      }),
    }),
    select: jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn(),
      }),
    }),
  }),
}));

describe('Drizzle Integration Tests', () => {
  let module: TestingModule;
  let drizzleDb: any;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [dbConfig],
        }),
        DrizzleModule,
      ],
    }).compile();

    drizzleDb = module.get(DrizzleAsyncProvider);
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should provide database functionality', () => {
    expect(drizzleDb).toBeDefined();
    expect(drizzleDb.query).toBeDefined();
    expect(drizzleDb.insert).toBeDefined();
    expect(drizzleDb.select).toBeDefined();
  });

  it('should work with schema', () => {
    expect(schema.users).toBeDefined();
    expect(drizzleDb.query.users).toBeDefined();
  });

  it('should support CRUD operations', async () => {
    const insertOp = drizzleDb.insert(schema.users);
    expect(insertOp.values).toBeDefined();

    const selectOp = drizzleDb.select().from(schema.users);
    expect(selectOp.where).toBeDefined();
  });

  it('should be singleton instance', () => {
    const instance1 = module.get(DrizzleAsyncProvider);
    const instance2 = module.get(DrizzleAsyncProvider);

    expect(instance1).toBe(instance2);
  });
}); 
