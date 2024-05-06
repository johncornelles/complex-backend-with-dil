import mongoose from "mongoose";

const testSchema = mongoose.Schema({
  id: Number,
  name: String,
  squad: Number,
});

export const test = mongoose.model("test", testSchema);
