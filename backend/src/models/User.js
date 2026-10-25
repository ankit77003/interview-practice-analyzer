const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);