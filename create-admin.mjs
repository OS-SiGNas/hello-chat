import { connect, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";

const { log, trace } = console;

log("🔥 Starting script to create admin user");

const schema = new Schema({
  name: String,
  email: String,
  password: String,
  roles: Array,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
});

const UserModel = model("User", schema);

log("User schema created");

const getSecrets = () => {
  const error = (variable) => new Error(`💩 Environment Variable: ${variable} is undefined`);
  const getSecretFromDotEnv = (target) => {
    const variable = process.env[target];
    if (variable === undefined) throw error(target);
    log("Seted variable: " + target);
    return variable;
  };

  return {
    mongoUri: getSecretFromDotEnv("MONGO_URI"),
    adminName: getSecretFromDotEnv("ADMIN_NAME"),
    adminEmail: getSecretFromDotEnv("ADMIN_EMAIL"),
    adminPassword: getSecretFromDotEnv("ADMIN_PASSWORD"),
  };
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

void (async () => {
  try {
    const { mongoUri, adminEmail, adminName, adminPassword } = getSecrets();
    const connections = await connect(mongoUri);
    if (connections !== undefined) log("DB is Connected");

    const userAdmin = await UserModel.create({
      name: adminName,
      email: adminEmail,
      password: await encryptPassword(adminPassword),
      roles: ["admin"],
      isActive: true,
    });

    const newAdmin = await userAdmin.save();
    log(`👽 New admin created: ${newAdmin.id}`);
  } catch (error) {
    trace(error);
  } finally {
    log("Script finished");
    process.exit();
  }
})();
