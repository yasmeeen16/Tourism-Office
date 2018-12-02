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

require("../models/InternalTourism");
var InternalTourismModel = mongoose.model('InternalTourism')

Router.get("/addInternalTourism",function(req,resp){
  resp.render("omra/add-indoor.ejs");

});

Router.post("/addInternalTourism",uploadMid.any(),function(req,resp){

  var name = req.body.name;
  var desc = req.body.desc;
  var price = req.body.price;
  var hotelName = req.body.hotelName;

  // var from = req.body.from;
  // var to = req.body.to;
  var discount = req.body.discount;
  var servises = req.body.servises;
  var imgs = [];
  var hotelImages = [];
  var allImages = [];
    if (req.files.length > 0){
      for(var i=0 ; i < req.files.length ; i++ ){
        if(req.files[i].fieldname === "imgs"){
          imgs.push(req.files[i].filename);
        }else if(req.files[i].fieldname === "hotelImages"){
          hotelImages.push(req.files[i].filename);
        }//end else if
      }//end for
    }// end if
    InternalTourismModel.find({name:req.body.name ,desc:req.body.desc,price:req.body.price,hotelName: req.body.hotelName,
      contact:req.body.contact}, function(err, InternalTourismTrips) {
                       if(InternalTourismTrips.length > 0 ){
                          resp.json({msg: "duplicated InternalTourism trip"});
                       }else{
                         var internalTourism = new InternalTourismModel({
                           name:req.body.name,
                           desc:req.body.desc,
                           price:req.body.price,
                           hotelName: req.body.hotelName,

                           discount: req.body.discount,
                           period: req.body.period,
                           program: req.body.program,
                           imgs:imgs,
                           hotelImages:hotelImages,
                           servises:req.body.servises,
                           time:Date.now()
                         });//object of t
                         internalTourism.save(function(err) {
                               if(err){
                                   console.log(err);
                                   return;
                                 }else
                                 resp.redirect('/InternalTourism/ListOfInternalTourism');
                                 //resp.json({internalTourism:internalTourism});

                               });//save the object
                       }
                  });

 // resp.json(hotelImages);

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
Router.get('/ListOfInternalTourism',function(req,resp,next){
  InternalTourismModel.find({}, function(err, Trips) {
                                  if(!err){
                                    resp.render('omra/list-of-indoor',{data:Trips});
                                  }else {
                                      resp.json(err);
                                  }
                              });
});
Router.get('/delete/:id',function(req,resp){
  InternalTourismModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      resp.redirect('/InternalTourism/ListOfInternalTourism');
    }
  });
})

module.exports=Router;
