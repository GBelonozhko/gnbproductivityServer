const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const JournalSchema = new mongoose.Schema({ 


},{ timestamps: true }
    );
    
    module.exports = mongoose.model('JournalEntries', JournalSchema); 