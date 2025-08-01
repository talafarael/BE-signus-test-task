import { Injectable, Inject } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DrizzleAsyncProvider } from 'src/drizzle/drizzle.provider';
import * as schema from "../drizzle/schema"
import { eq } from 'drizzle-orm';
import { IUser } from './model/users.model';
import { UserCacheService } from './cache/user-cache.service';


@Injectable()
export class UsersService {
  constructor(
    @Inject(DrizzleAsyncProvider)
    private db: NodePgDatabase<typeof schema>,
    private readonly userCacheService: UserCacheService
  ) { }

  async findOne(username: string): Promise<IUser | undefined> {
    const cachedUser = await this.userCacheService.getUserByUsername(username);
    if (cachedUser) return cachedUser;

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.username, username)
    });

    if (user) {
      await this.userCacheService.cacheUser(user);
    }

    return user ?? undefined;
  }
  async getMe(username: string): Promise<IUser> {
    const user = await this.findOne(username)
    if (!user) {
      throw new Error('User not found');
    }
    return user
  }
  async create(userData: Omit<IUser, 'id'>): Promise<IUser> {
    try {
      const [newUser] = await this.db
        .insert(schema.users)
        .values(userData)
        .returning();
      return newUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }
}
