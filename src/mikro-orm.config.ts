import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Ticket } from "./entities/Ticket";
import path from "path";
import { User } from "./entities/User";
import dotenv from "dotenv";

const env = dotenv.config({ path: "./.env" });
console.log(env);

const config = {
  clientUrl: process.env.DATABASE_URL,
  debug: !__prod__,
  type: "postgresql",
  driverOptions: {
    connection: {
      ssl: { rejectUnauthorized: false },
    },
  },
  entities: [Ticket, User],
  migrations: {
    path: path.join(__dirname, "migrations"),
    pattern: /^[\w-]+\d+\.[tj]s$/,
  },
} as Parameters<typeof MikroORM.init>[0];

export default config;
