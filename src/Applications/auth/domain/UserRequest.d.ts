import type { Request } from "express";
import type { JwtPayload } from "./JwtPayload";

export interface UserRequest extends Request {
  user: JwtPayload;
}
