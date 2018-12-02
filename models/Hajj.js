var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Hajj = new Schema ({
  _id: { type: Schema.ObjectId, auto: true },
  name: String,
  desc: String,
  imgs: [String],
  price: String,
  servises: [String],
  hotelName: String,
  hotelImages: [String],
  contact: String,
  from:Date,
  to:Date,
  time:{
    type:Date,
    Default:Date.now()
  }
});

mongoose.model("Hajj",Hajj);
