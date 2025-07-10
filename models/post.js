const mongoose = require('mongoose');

const postschema = new mongoose.Schema({
  comp_id:String,
  companyName: String,
  role: String,
  salary: String,
  responsibilities: String,
  skills: String,
  description: String,
  duration: String, 
  startDate:  Date, 
  endDate:  Date,
  applicants:[String],    
});

module.exports = mongoose.model('Post', postschema);
