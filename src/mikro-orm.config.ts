import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Ticket } from "./entities/Ticket";
import path from "path";
import { User } from "./entities/User";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const dbConfig: Parameters<typeof MikroORM.init>[0] = __prod__
  ? {
      clientUrl: process.env.DATABASE_URL,
    }
  : {
      dbName: "dev_support",
      user: process.env.DBUSER,
      password: process.env.DBPSWD,
    };

console.log(dbConfig);

const config = {
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
