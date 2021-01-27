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

  isVisible: {
    type: Boolean,
    default: true
  },

  color:{
    type: String,
  },

  duration:{
    type:Object
  }
      

},{ timestamps: true }
);

module.exports = mongoose.model('Todos', ToDoSchema); 