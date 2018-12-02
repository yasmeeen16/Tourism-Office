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

require("../models/ExternalTourism");
var ExternalTourismModel = mongoose.model('ExternalTourism')

Router.get("/addExternalTourism",function(req,resp){
  resp.render("omra/add-outdoor.ejs");

});

Router.post("/addExternalTourism",uploadMid.any(),function(req,resp){

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
    ExternalTourismModel.find({name:req.body.name ,desc:req.body.desc,price:req.body.price,hotelName: req.body.hotelName,
      contact:req.body.contact}, function(err, ExternalTourismTrips) {
                    if(ExternalTourismTrips.length > 0){
                        resp.json({msg:"duplicate tourism trip "});
                    }else{
                      var externalTourism = new ExternalTourismModel({
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
                      });//object of hajj
                      externalTourism .save(function(err) {
                            if(err){
                                console.log(err);
                                return;
                              }else
                              resp.redirect('/ExternalTourism/ListOfExternalTourism');
                              //resp.json({externalTourism:externalTourism });

                            });//save the object
                    }
                  });

 // resp.json(hotelImages);

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
Router.get('/ListOfExternalTourism',function(req,resp,next){
  ExternalTourismModel.find({}, function(err, Trips) {
                                  if(!err){
                                    resp.render('omra/list-of-outdoor',{data:Trips});
                                  }else {
                                      resp.json(err);
                                  }
                              });
});
Router.get('/delete/:id',function(req,resp){
  ExternalTourismModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      resp.redirect('/ExternalTourism/ListOfExternalTourism');
    }
  });
})


module.exports=Router;
