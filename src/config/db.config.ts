import { registerAs } from "@nestjs/config";

export default registerAs('db', () => ({
  database_url: process.env.DATABASE_URL
}));
