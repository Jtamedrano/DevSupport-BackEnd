import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Ticket } from "./entities/Ticket";
import path from "path";
import { User } from "./entities/User";
import dotenv from "dotenv";

const env = dotenv.config({ path: "./.env" });

const dbConfig: Parameters<typeof MikroORM.init>[0] = __prod__
  ? {
      host: env.parsed?.DB_HOST,
      dbName: env.parsed?.DB,
      port: Number(env.parsed?.DB_PORT),
    }
  : {
      dbName: "dev_support",
    };

console.log(dbConfig);

const config = {
  user: env.parsed?.DB_USER,
  password: env.parsed?.DB_PSWD,
  debug: !__prod__,
  type: "postgresql",
  ...dbConfig,
  entities: [Ticket, User],
  migrations: {
    path: path.join(__dirname, "migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];

export default config;
