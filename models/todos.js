const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const ToDoSchema = new mongoose.Schema({ 
 
  title:{
    type: String,
  },

  creator: { 
    type: ObjectId,
    ref: "User",
  },

   task: {
    type: String,
    
  },

  isComplete: {
    type: Boolean,
    default: false
  },

  isRoutine: {
    type: Boolean,
    default: false
  },

  isVisible: {
    type: Boolean,
    default: true
  },

  color:{
    type: String,
  },

  startTime:{
    type:Date,
    default:null
  },
  endTime:{
    type:Date,
    default:null
  }


},{ timestamps: true }
);

module.exports = mongoose.model('Todos', ToDoSchema); 