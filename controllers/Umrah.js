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

require("../models/Umrah");
var umrahModel = mongoose.model('Umrah')

Router.get("/addUmrah",function(req,resp){
  resp.render("omra/add-omra.ejs");

});

Router.post("/addUmrah",uploadMid.any(),function(req,resp){

    var name = req.body.name;
    var desc = req.body.desc;
    var price = req.body.price;
    var hotelName = req.body.hotelName;
    //var contact = req.body.contact;
    var imgs = [];
    var hotelImages = [];
    var allImages = [];
        req.checkBody('name','name is empty').notEmpty();
        req.checkBody('desc','description is empty').notEmpty();
        req.checkBody('price','price is empty').notEmpty();
        req.checkBody('hotelName','hotel name is empty').notEmpty();
        let errors = req.validationErrors();
        if(errors){
          resp.redirect('/umrah/addUmrah');
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
          umrahModel.find({name:req.body.name ,desc:req.body.desc,price:req.body.price,hotelName: req.body.hotelName,
            contact:req.body.contact}, function(err, omraTrips) {
                            //resp.json({   omraTrips: omraTrips});
                            if(omraTrips.length > 0){
                              resp.redirect('/umrah/addUmrah');
                              //resp.json({ msg : "duplicate omra trip" });
                            }else{
                              var umrah = new umrahModel({
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
                              umrah.save(function(err) {
                                    if(err){
                                        console.log(err);
                                        return;
                                      }else
                                      resp.redirect('/umrah/ListOfOmra');
                                      //resp.json({ umrah : umrah });
      
                                    });//save the object
                            }
                        });
        }

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
Router.get('/ListOfOmra',function(req,resp,next){
  umrahModel.find({}, function(err, Trips) {
                                  if(!err){
                                    resp.render('omra/list-of-omra',{data:Trips});
                                  }else {
                                      resp.json(err);
                                  }
                              });
});
Router.get('/delete/:id',function(req,resp){
  umrahModel.remove({_id:req.params.id},function(err,result){
    if(!err){
      resp.redirect('/Umrah/ListOfOmra');
    }
  });
})

module.exports=Router;
