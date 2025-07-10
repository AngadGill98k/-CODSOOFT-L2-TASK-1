const mongoose = require('mongoose');
const post = require('./post');



const jobschema = new mongoose.Schema({
  id:String,
  status:Boolean,
  })

const userschema = new mongoose.Schema({
  name: String,
  pass: String,
  mail: String,
  about: String,
  achievements: String,
  post: [String],
    resume: String,
  jobs_app: [jobschema]
});

module.exports = mongoose.model('User', userschema);
