import { MongooseModule } from "@nestjs/mongoose";
import { PasswordResetCache, PasswordResetCacheSchema } from "./password-reset-cache.entity";

export const PasswordMongooseModule = MongooseModule.forFeature([{ name: PasswordResetCache.name, schema: PasswordResetCacheSchema }]);
