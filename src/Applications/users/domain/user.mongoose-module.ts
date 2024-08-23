import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.entity";

export const UserMongooseModule = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);
