import { PasswordResetCache } from "../../domain";

const mockPasswordResetCacheDb: PasswordResetCache[] = [];

export const mockPasswordResetModel = {
  findOne: jest.fn(async (target: PasswordResetCache) => {
    const cache = mockPasswordResetCacheDb.find((cache) => cache.email === target.email);
    if (cache === undefined) return null;
    return cache;
  }),
  create: jest.fn(async (o: PasswordResetCache) => {
    mockPasswordResetCacheDb.push(o);
    return {
      ...o,
      save: jest.fn(),
    };
  }),
};
