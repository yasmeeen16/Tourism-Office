var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InternalTourism = new Schema ({
  _id: { type: Schema.ObjectId, auto: true },
  name: String,
  desc: String,
  imgs: [String],
  price: String,
  discount: String,
  servises: [String],
  hotelName: String,
  hotelImages: [String],
  period:String,
  program:String,
  contact: String,
  time:{
    type:Date,
    Default:Date.now()
  }
});

mongoose.model( "InternalTourism" , InternalTourism );
