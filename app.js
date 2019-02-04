var express = require('express');
var server = express();
require('dotenv').config();

var createError = require('http-errors');
var path = require("path");
var expressValidator = require('express-validator');
server.use(expressValidator());
var mongoose = require('mongoose');

const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourismOffice';
mongoose.promise = global.promise;

mongoose.connect(CONNECTION_URI
  ,{ useNewUrlParser: true }
);

const PORT = process.env.PORT || 8090 ;
server.set('views', path.join(__dirname, 'views'));
server.set("view engine","ejs");
server.set("views","./views");
server.use(express.static(path.join(__dirname, 'public')));


var session = require("express-session");
server.use(session({
    secret:'krunal'
}))

var userRouts = require("./controllers/user.js");
server.use("/user",userRouts);
server.use("/",userRouts);

var authRouts = require("./controllers/auth.js");
server.use("/auth",authRouts)

//Auth MidWare.
server.use(function(req,resp,next){
    if(!(req.session.email && req.session.password )){
        resp.redirect('/auth/login');
    }// }else if(req.session.email && req.session.password ){
    //     resp.redirect('/hajj/addHajj');
    // }
    else{
      next();
    }

});

var authRouts = require("./controllers/auth.js");
server.use("/auth",authRouts);

var hajjRouts = require("./controllers/hajj.js");
server.use("/hajj",hajjRouts);


var umrahRouts = require("./controllers/Umrah.js");
server.use("/umrah",umrahRouts );

var ExternalTourismRouts = require("./controllers/ExternalTourism.js");
server.use("/ExternalTourism",ExternalTourismRouts );

var InternalTourismRouts = require("./controllers/InternalTourism.js");
server.use("/InternalTourism",InternalTourismRouts);


// server.use(function(req, res, next) {
//   next(createError(404));
// });

server.listen(PORT,function(){
  console.log('server listen at port number ' + PORT);
});
