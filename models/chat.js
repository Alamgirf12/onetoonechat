var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var chatSchema = new Schema({

  from : {type: String},
  to : {type: String, },
  msg : {type: String},
 
  createdOn : {type: Date, default : Date.now}

});
var Chat = mongoose.model('chat',chatSchema);

module.exports = Chat;