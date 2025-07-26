import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service';
import { IUser } from '../model/users.model';

@Injectable()
export class UserCacheService {
  private readonly CACHE_KEYS = {
    USER_BY_USERNAME: (username: string) => `user:username:${username}`,
  };

  private readonly TTL = {
    USER_DATA: 300,
  };

  constructor(private readonly redisService: RedisService) { }

  async getUserByUsername(username: string): Promise<IUser | null> {
    const cacheKey = this.CACHE_KEYS.USER_BY_USERNAME(username);
    return this.redisService.getValue(cacheKey);
  }

  async setUserByUsername(username: string, user: IUser): Promise<void> {
    const cacheKey = this.CACHE_KEYS.USER_BY_USERNAME(username);
    await this.redisService.setValue(cacheKey, user, this.TTL.USER_DATA);
  }

  async cacheUser(user: IUser): Promise<void> {
    await Promise.all([
      this.setUserByUsername(user.username, user),
    ]);
  }

} 
