import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { userRequestInterface } from "../interfaces/interface";

function Authorization(
  req: userRequestInterface,
  res: Response,
  next: NextFunction
) {
  const userToken = req.headers.token || "";


  if (!userToken) {
    return res.status(401).json({
      status: "you are not an authorized user",
      message: "Enter  login  details to have access",
    });
  }
  // try {
  //   const Authorization = jwt.verify(
  //     userToken.toString(),
  //     process.env.TOKEN_KEY || ""
  //   );
  //   req.user = Authorization;
  //   next();
  // } catch (err) {
  //   res.status(401).json({
  //     status: "Failed",
  //     message: "Invalid token",
  //   });
  // }

  try {
    const decoded = jwt.verify(userToken.toString(), process.env.TOKEN_KEY || "");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      status: "Failed",
      message: "Invalid token",
    });
  }
}

export default Authorization;
