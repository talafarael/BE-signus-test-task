import { InferSelectModel } from "drizzle-orm";
import * as schema from "../../drizzle/schema"

export type IUser = InferSelectModel<typeof schema.users>;
