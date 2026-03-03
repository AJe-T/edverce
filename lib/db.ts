import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
};

const resolveDatabaseUrl = () => {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.DATABASE_URL_DEV &&
    process.env.DATABASE_URL_DEV.length > 0
  ) {
    return process.env.DATABASE_URL_DEV;
  }

  return process.env.DATABASE_URL;
};

export const db =
  globalThis.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
