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
var HajjModel = mongoose.model('Hajj')

Router.get("/addHajj",function(req,resp){
  resp.render("omra/add-hej.ejs");

});

Router.post("/addHajj",uploadMid.any(),function(req,resp){
    if(!(req.session.email && req.session.password )){
        resp.redirect('/auth/login');
    }else{


    var name = req.body.name;
    var desc = req.body.desc;
    var price = req.body.price;
    var hotelName = req.body.hotelName;
    // var contact = req.body.contact;
    var imgs = [];
    var hotelImages = [];
    var allImages = [];
    req.checkBody('name','name is empty').notEmpty();
    req.checkBody('desc','description is empty').notEmpty();
    req.checkBody('price','price is empty').notEmpty();
    req.checkBody('hotelName','hotel name is empty').notEmpty();
    let errors = req.validationErrors();
    if(errors){
      resp.redirect('/hajj/addHajj');
      // return resp.status(409).json({
      //   message:"enter your data"
      // });
    }else{
      if (req.files.length > 0){
        for(var i=0 ; i < req.files.length ; i++ ){
          if(req.files[i].fieldname === "imgs"){
            imgs.push(req.files[i].filename);
          }else if(req.files[i].fieldname === "hotelImages"){
            hotelImages.push(req.files[i].filename);
          }//end else if
        }//end for
      }// end if
      HajjModel.find({name:req.body.name ,desc:req.body.desc,price:req.body.price,hotelName: req.body.hotelName,
        contact:req.body.contact}, function(err, hajjTrips) {
                        if(hajjTrips.length>0){
                          //resp.json({ msg : "duplicate Hajj trip" });
                          resp.redirect("/hajj/addHajj");
                        }else{
                          var hajj = new HajjModel({
                            name:req.body.name,
                            desc:req.body.desc,
                            price:req.body.price,
                            hotelName: req.body.hotelName,
                            from:req.body.from,
                            to:req.body.to,
                            imgs:imgs,
                            hotelImages:hotelImages,
                            servises:req.body.servises,
                            time:Date.now()
                          });//object of hajj
                          hajj.save(function(err) {
                                if(err){
                                    console.log(err);
                                    return;
                                  }else
                                  resp.redirect('/hajj/ListOfHajj');
                                  //resp.json({ hajj : hajj });

                                });//save the object
                        }
                    });
    }
  }
 // resp.json(hotelImages);
});
Router.get('/allHajj',function(req,resp,next){
    HajjModel.find({}, function(err, hajjTrips) {
                                    if(!err){
                                      resp.render('omra/hej.ejs',{data:hajjTrips});
                                    }else {
                                        resp.json(err);
                                    }
                                });
});



Router.get('/ListOfHajj',function(req,resp,next){
  HajjModel.find({}, function(err, hajjTrips) {
                                  if(!err){
                                    resp.render('omra/list-of-hajj',{data:hajjTrips});
                                  }else {
                                      resp.json(err);
                                  }
                              });
});
Router.get('/delete/:id',function(req,resp){
  HajjModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      resp.redirect('/hajj/ListOfHajj');
    }
  });
})

module.exports=Router;
