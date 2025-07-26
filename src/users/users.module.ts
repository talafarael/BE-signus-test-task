import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { RedisModule } from 'src/redis/redis.module';
import { UserCacheService } from './cache/user-cache.service';

@Module({
  imports: [DrizzleModule, RedisModule],
  controllers: [UsersController],
  providers: [UsersService, UserCacheService],
  exports: [UsersService, UserCacheService]
})
export class UsersModule { }
