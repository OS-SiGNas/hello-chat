import { DynamicModule, Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

export type Variables = "PORT" | "MONGO_URI" | "JWT_SECRET" | "JWT_EXPIRED_TIME";
export type Secrets = Readonly<Record<Variables, string>>;
interface IConfig {
  configModule: DynamicModule;
  secrets: Secrets;
  getAsyncSecrets: () => Promise<Secrets>;
}

const Config = class implements IConfig {
  static #instance?: IConfig; // crazy singleton 🤡
  static get instance(): Readonly<IConfig> {
    if (this.#instance === undefined) this.#instance = new Config();
    return this.#instance;
  }

  readonly #logger = new Logger("Config");
  readonly configModule: DynamicModule;
  readonly #configService = new ConfigService();

  private constructor() {
    const envFilePath = process.env.NODE_ENV !== undefined ? `.env.${process.env.NODE_ENV}` : ".env";
    this.#logger.debug("EnvTarget: " + envFilePath);
    this.configModule = ConfigModule.forRoot({ isGlobal: true, envFilePath });
  }

  readonly #error = (variable: Variables): Error => new Error(`💩 Environment Variable: ${variable} is undefined`);
  readonly #getSecretFromDotEnv = (target: Variables): Readonly<string> => {
    const variable = this.#configService.get(target);
    if (variable === undefined) throw this.#error(target);
    this.#logger.debug("Seted variable: " + target);
    return variable;
  };

  public get secrets(): Secrets {
    return {
      PORT: this.#getSecretFromDotEnv("PORT"),
      MONGO_URI: this.#getSecretFromDotEnv("MONGO_URI"),
      JWT_SECRET: this.#getSecretFromDotEnv("JWT_SECRET"),
      JWT_EXPIRED_TIME: this.#getSecretFromDotEnv("JWT_EXPIRED_TIME"),
    } as const;
  }

  // TODO: Implement asyncronous method for secrets like AWS Secret Manager
  public readonly getAsyncSecrets = async (): Promise<Secrets> => {
    return await Promise.resolve(this.secrets);
  };
};

export const { configModule, secrets, getAsyncSecrets }: IConfig = Config.instance;
