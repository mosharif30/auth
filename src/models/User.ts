import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, minLength: 3, required: true },
  password: { type: String, minLength: 3, required: true },
  age: { type: String },
  createdAt: { type: Date, default: () => Date.now() },
});
const User = models.User || model("User", userSchema);

export default User;
