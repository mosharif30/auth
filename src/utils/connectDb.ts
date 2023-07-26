import mongoose from "mongoose";

export const connectDb = () => {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    } else {
      mongoose.connect(process.env.MONGOURI).then(() => {});
    }
  } catch (error) {
    console.log("failed to connect to db", error);
  }
};
