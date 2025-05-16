import user_model from "../models/users_model";
import express, { Request, Response } from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
type customRequest = Request & {
  user?: { user_id?: string; email?: string; name?: string };
};
// Function to register users
export async function register(req: Request, res: Response) {
  try {
    const ValidateSchema = Joi.object({
      name: Joi.string().required().min(3).max(30),
      email: Joi.string().required().min(6).max(225).email(),
      password: Joi.string().required().min(6).max(225),
    });

    //Validating User
    const validationValue = ValidateSchema.validate(req.body);
    if (validationValue.error) {
      return res.status(400).json({
        message: validationValue.error.details[0].message,
      });
    }
    console.log(validationValue);
    //check for existing email
    const existingUser = await user_model.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists!",
      });
    }

    //Hash user password
    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    // Register user
    const value = await user_model.create({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashPassword,
    });

    res.status(201).json({
      data: value,
    });
  } catch (err: any) {
    res.status(400).json({ msg: "Something went wrong.. try again" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const validateSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
console.log("req body",req.body)
    //validate body
    const validationResult = await validateSchema.validate(req.body);
    //check for errors
    if (validationResult.error) {
      return res.status(400).json({
        msg: validationResult.error.details[0].message,
      });
    }
    //check for existing email
    const existingUser = await user_model.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "Account with this user does not exist!",
      });
    }
    //check if the password is wrong or doesn't match
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      existingUser.password
    );
    if (!passwordIsValid) {
      //invalid password
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    //email exist and password matches, proceed to create token

    console.log("existingUser",existingUser)
    // Create token
    const token = jwt.sign(
      { user_id: existingUser._id, user_email: existingUser.email },
      process.env.TOKEN_KEY as string,
      {
        expiresIn: process.env.TOKEN_EXPIRATION,
      }
    );
    res.cookie("token", token, { httpOnly: true });

    res.status(200).json({
      status: "signed in successfully!",
      token,
    });
  } catch (err: any) {
    console.log("err",err)
    res.status(400).json({ msg: err });
  }

  
}


