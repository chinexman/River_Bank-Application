import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { Request } from "express";

interface transactionsInterface {
  amount: number;
  type: string;
  sender: mongoose.Schema.Types.ObjectId;
  receiver: mongoose.Schema.Types.ObjectId;
  description: string;
  date:Date
}


interface UserInterface {
  email: string;
  name: string;
  password: string;
}

interface userRequestInterface extends Request {
  user?: string | JwtPayload;
}


export {
  transactionsInterface,
  userRequestInterface,
  UserInterface,
};
