const mongoose = require("mongoose");
const { randomUUID } = require("crypto");

const problemSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    platform: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    topic: { type: String, required: true },
    timeTaken: { type: Number, required: true },
    status: {
      type: String,
      enum: ["SOLVED", "UNSOLVED"],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

problemSchema.index({ userId: 1, topic: 1 });
problemSchema.index({ userId: 1, difficulty: 1 });

problemSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports =
  mongoose.models.Problem || mongoose.model("Problem", problemSchema);