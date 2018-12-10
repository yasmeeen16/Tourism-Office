var express = require('express');
var server = express();
var createError = require('http-errors');
var path = require("path");
var expressValidator = require('express-validator');
server.use(expressValidator());
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/tourismOffice');

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
    }else{
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

server.listen(8090,function(){
  console.log('server listen at port number 8090 ...... ');
});
