import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

import { AppModule } from "./app.module";

void (async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(port);
})();
