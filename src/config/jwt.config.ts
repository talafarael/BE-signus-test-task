import { registerAs } from "@nestjs/config";

export default registerAs('jwt', () => ({
  jwt_secret: process.env.JWT_SECRET
}));
