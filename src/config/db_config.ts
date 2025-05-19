import mongoose from "mongoose";

// function connect() {
//   mongoose
//     .connect(process.env.DATABASE_URL as string)
//     .then(() => console.log("we are going live in 5,4,3,2,1"))
//     .catch((err) => console.log("Error Connecting to Database => ", err));
// }

const MONGO_URI = process.env.DATABASE_URL as string || "";

export const connect = async () => {
  if (process.env.NODE_ENV === "test") return; // skip real DB in tests

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error Connecting to Database => ", err);
  }
};

export default connect;
