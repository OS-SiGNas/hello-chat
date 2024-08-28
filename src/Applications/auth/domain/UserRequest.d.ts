import type { Request } from "express";
import type { PayloadToken } from "./PayloadToken";

export interface UserRequest extends Request {
  user: PayloadToken;
}
