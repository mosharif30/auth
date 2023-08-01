import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
  email: { type: String, minLength: 3, required: true },
  password: { type: String, minLength: 3, required: true },
  name: { type: String, minLength: 3 },
  age: { type: Number, min: 10, max: 99 },
  isAdmin: { type: String, default: false, readonly: true },
  createdAt: { type: Date, default: () => Date.now() },
});
const User = models.User || model("User", userSchema);

export default User;
