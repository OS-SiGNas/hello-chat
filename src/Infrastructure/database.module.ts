import { MongooseModule } from "@nestjs/mongoose";
import { secrets } from "../Domain/config";

export const DatabaseModule = MongooseModule.forRoot(secrets.MONGO_URI);
