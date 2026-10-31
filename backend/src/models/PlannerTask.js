const mongoose = require("mongoose");

const plannerTaskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
    },

    phase: {
      type: Number,
      required: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

plannerTaskSchema.index({ userId: 1, phase: 1 });

module.exports = mongoose.model("PlannerTask", plannerTaskSchema);