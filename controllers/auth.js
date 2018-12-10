
var express = require('express');
var Router = express.Router();
var BodyParser = require('body-parser');
var expressValidator = require('express-validator');
var BodyParserMid = BodyParser.urlencoded();//middle ware to get data from request body
var bcrypt = require('bcrypt');
var mongoose = require("mongoose");
var jwt = require('jsonwebtoken');
require("../models/auth");

var passwordHash = require('password-hash');//for generate hashed password and verifiy

var adminModel = mongoose.model('auth');
const path = require('path');
 //var ClientModel = mongoose.model('clientData');
Router.get('/login',function(req,resp){
    resp.render("omra/sign-in.ejs");

});

Router.post('/login',BodyParserMid,function(req,resp){
        var email = req.body.email;
        var password = req.body.password;
        //for validation
        req.checkBody('email','email is empty').notEmpty();
        req.checkBody('email','email is not email').isEmail();
        req.checkBody('password','password is empty').notEmpty();
        let errors = req.validationErrors();
        if(errors){
          resp.redirect('/auth/login');
          // return resp.status(409).json({
          //   message:"enter your data"
          // });
        }else{
            adminModel.findOne({ email: req.body.email }, function(err, user) {
                if(err){
                  return resp.status(409).json({
                    message:"error"
                  });
                }
                if(user!=null){

                  if(passwordHash.verify(req.body.password , user.password))
                      {
                          req.session.email=req.body.email;
                          req.session.password=req.body.password;
                          const jsontoken = jwt.sign({user: user},'mysecret-key');
                            resp.redirect('/umrah/addUmrah');
                      }else {
                        resp.redirect('/auth/login');
                          //resp.json([{err:"password not valid"},false]);
                      }
                }else{
                  return resp.status(409).json({
                    message:"user not found"
                  });
                }
            });
        }
});
Router.get('/register',function(req,resp){

});
Router.post('/register',BodyParserMid,function(req,resp,next){

    adminModel.findOne({ email: req.body.email }, function(err, user) {
        if(user){
          return resp.status(409).json({
            message:"email is existed"
          });
        }else{
          var name = req.body.name;
          var email = req.body.email;
          var password = req.body.password;
          var confPassword = req.body.confPassword;

          req.checkBody('name','name is empty').notEmpty();
          req.checkBody('email','email is empty').notEmpty();
          req.checkBody('email','email is empty').isEmail();
          req.checkBody('password','password is empty').notEmpty();
          req.checkBody('confPassword','password is not matched').equals(req.body.password);

          let errors = req.validationErrors();
          if(errors){
            resp.json(errors);
          }else{
            var adminModel = mongoose.model("auth");
            var admin = new adminModel({
              name:req.body.name,
              email:req.body.email,
              password:req.body.password,
              time:new Date()
            });
            var hashedPassword = passwordHash.generate(req.body.password);
                admin.password = hashedPassword;
                admin.save(function(err,doc){
                  if(err){
                    console.log(err);
                  }
                  const jsontoken = jwt.sign({admin: admin},'mysecret-key');
                        resp.json({ admin: admin, token:jsontoken});
                });
          }
        }
    });//end of   adminModel.findOne
});
Router.get('/logout', function(req, resp, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return resp.redirect('/auth/login');
      }
    });
  }
});


module.exports=Router;
