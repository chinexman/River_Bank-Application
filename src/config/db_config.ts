import mongoose from "mongoose";

function connect() {
  mongoose
    .connect(process.env.DATABASE_URL as string)
    .then(() => console.log("we are going live in 5,4,3,2,1"))
    .catch((err) => console.log("Error Connecting to Database => ", err));
}

export default connect;
