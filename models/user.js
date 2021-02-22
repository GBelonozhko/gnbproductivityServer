const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  status: {
    type: String,
    default: "I am new!",
  },
  todos: [
    {
      type: ObjectId,
      ref: "todos",
    },
  ],
  numtrackers: [{ type: ObjectId, ref: "NumTrackers" }],

  journal: [{ type: ObjectId, ref: "JournalEntries" }],
});

module.exports = mongoose.model("User", userSchema);
