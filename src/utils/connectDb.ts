import mongoose from "mongoose";

export const connectDb = () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("already");

      return;
    } else {
      mongoose.connect(process.env.MONGOURI).then(() => {
        console.log("connected");
      });
    }
  } catch (error) {
    console.log("failed to connect to db", error);
  }
};
