import "reflect-metadata";
import "dotenv-safe";
import { createConnection } from "typeorm";
import { __prod__ } from "./constants";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TicketResolver } from "./resolvers/Ticket";
import { UserResolver } from "./resolvers/User";
import Redis from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
import { MyContext } from "./types";
import cors from "cors";
import { Ticket } from "./entities/Ticket";
import { User } from "./entities/User";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const main = async () => {
  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    ssl: !__prod__ && { rejectUnauthorized: false },
    synchronize: true,
    logging: true,
    entities: [Ticket, User],
    migrations: [path.join(__dirname, "./migrations/*")],
  });

  const app = express();
  const RedisStore = connectRedis(session);
  const redis = Redis.createClient(
    "redis://:p438ebc6295469bfcd8ff2728680f9640657c65c90fbba0bc86148400432269ec@ec2-3-228-35-16.compute-1.amazonaws.com:16349"
  );
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
        // domain: __prod__ ? ".jtamedrano.com" : undefined,
      },
      secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : "",
      resave: false,
      saveUninitialized: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, TicketResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
    introspection: true,
    playground: true,
  });

  apolloServer.applyMiddleware({ app });

  const port =
    typeof process.env.PORT === "string" ? parseInt(process.env.PORT) : 5000;
  const url = `http://localhost:${port}`;
  app.listen(port, () => {
    console.log(`Server started on ${url}`);
    console.log(`Apollo Server on ${url}/graphql`);
  });
};

main().catch((err) => {
  console.log(err);
});
