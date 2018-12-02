var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var auth = new Schema ({
  _id: { type: Schema.ObjectId, auto: true },
  name: String,
  password:String,
  email:String,
  time:{
    type:Date,
    Default:Date.now()
  }
});

mongoose.model("auth",auth);
