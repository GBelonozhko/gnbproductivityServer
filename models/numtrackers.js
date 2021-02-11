const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const NumTrackerSchema = new mongoose.Schema(
  {
    creator: {
      type: ObjectId,
      ref: "User",
    },

    value: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      requred: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('NumTrackers',NumTrackerSchema );