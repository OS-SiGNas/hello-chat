import { MongooseModule } from "@nestjs/mongoose";
import { secrets } from "../Domain/config-module";

export const DatabaseModule = MongooseModule.forRoot(secrets.MONGO_URI);
