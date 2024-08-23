import { DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

export type Variables = "PORT" | "MONGO_URI" | "JWT_SECRET" | "JWT_EXPIRED_TIME";
export type Secrets = Record<Variables, string>;

class Config {
  readonly DEBUG: boolean;
  readonly configModule: DynamicModule;

  private constructor() {
    this.configModule = ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" });
  }

  static #instance?: Config; // crazy singleton 🤡
  static get instance(): Readonly<Config> {
    if (this.#instance === undefined) this.#instance = new Config();
    return this.#instance;
  }

  readonly #error = (variable: Variables): Error => new Error(`💩 Environment Variable: ${variable} is undefined`);
  readonly #getSecretFromDotEnv = (variable: Variables): Readonly<string> => {
    const target = process.env[variable];
    if (target === undefined) throw this.#error(variable);
    return target;
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
}

export const { configModule, DEBUG, secrets, getAsyncSecrets } = Config.instance;
