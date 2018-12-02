var express = require('express');
var Router = express.Router();
var BodyParser = require('body-parser');
var expressValidato = require('express-validator');
var BodyParserMid = BodyParser.urlencoded();//middle ware to get data from request body
const path = require('path');
var mongoose = require("mongoose");
var fs = require('fs'); //for stream
var multer = require("multer");//to upload file
var uploadMid = multer({dest:"./public/imgs"});

require("../models/Hajj");
require("../models/ExternalTourism");
require("../models/Umrah");
require("../models/InternalTourism");

var HajjModel = mongoose.model('Hajj');
var umrahModel = mongoose.model('Umrah');
var ExternalTourismModel = mongoose.model('ExternalTourism');
var InternalTourismModel = mongoose.model('InternalTourism');
Router.get('/allHajj',function(req,resp,next){
    HajjModel.find({}, function(err, hajjTrips) {
                                    if(!err){
                                      resp.render('omra/hej.ejs',{data:hajjTrips});
                                    }else {
                                        resp.json(err);
                                    }
                                });
});

Router.get('/allOmra',function(req,resp,next){

    umrahModel.find({}, function(err, omraTrips) {
                      if(!err){
                        resp.render('omra/omra.ejs',{data:omraTrips});
                      }else {
                          resp.json(err);
                      }

                  });

});
Router.get('/allExternalTourism',function(req,resp,next){

    ExternalTourismModel.find({}, function(err, ExternalTourismTrips) {

                      if(!err){
                        resp.render('omra/out-door.ejs',{data:ExternalTourismTrips});
                      }else {
                          resp.json(err);
                      }
                  });
});

Router.get('/allInternalTourism',function(req,resp,next){

    InternalTourismModel.find({}, function(err,InternalTourismTrips) {
          if(!err){
            resp.render('omra/in-door.ejs',{data:InternalTourismTrips});
          }else {
              resp.json(err);
          }
      });
});

module.exports=Router;