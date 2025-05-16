import mongoose from "mongoose";
import { UserInterface } from "../interfaces/interface";

const userSchema = new mongoose.Schema<UserInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
});
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
