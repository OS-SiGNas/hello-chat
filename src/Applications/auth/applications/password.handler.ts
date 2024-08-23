import { compare, genSalt, hash } from "bcryptjs";

export const encryptPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

/**
 * @param password: password payload
 * @param userPassword: password hashed in db */
export const comparePassword = async (password: string, userPassword: string): Promise<boolean> => {
  return await compare(password, userPassword);
};
