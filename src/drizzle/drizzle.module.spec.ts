import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { DrizzleModule } from './drizzle.module';
import { DrizzleAsyncProvider } from './drizzle.provider';
import dbConfig from '../config/db.config';

describe('DrizzleModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(dbConfig), DrizzleModule],
    }).compile();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should work with ConfigModule', async () => {
    const testModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [dbConfig],
        }),
        DrizzleModule,
      ],
    }).compile();

    expect(testModule).toBeDefined();

    await testModule.close();
  });
});

