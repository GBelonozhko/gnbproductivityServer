const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const JournalSchema = new mongoose.Schema(
  {
    creator: { 
        type: ObjectId,
        ref: "User",
      },
      journal: {
        type: String,
      },
    rating:{
        type:Array,

  }
},{ timestamps: true }
);

module.exports = mongoose.model("JournalEntries", JournalSchema);
