import { Request, Response } from "express";

export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
};

declare global {
  namespace Express {
    interface Session {
      _userId?: number;
    }
  }
}
