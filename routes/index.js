const express = require('express');

const router = express.Router();

const config=require('../config.json');

const logger=require('../lib/log/write');

const redis = require('redis');

const client=redis.createClient();

const blocekdAppView=require('../views/blocked/app');

const blocekdUserView=require('../views/blocked/user');

router.get(config.url.blocked_app,(req,res,next)=>{

    client.get(req.session.ip, function(err, data) {

        if(err){

            logger(req, 'error', err.message);

            next(new Error())
        }
        else if(data){

            blocekdAppView(req,res); 
        }
        else res.redirect(config.url.root);    
    })
});

router.get(config.url.blocked_user,(req,res,next)=>{
    
    if(req.session.login && req.session.login.blocked) {

        blocekdUserView(req,res);
    }
    else res.redirect(config.url.root); 
});

router.use((req, res, next)=> {

    client.get(req.session.ip, function(err, data) {

        if (err) {

            logger(req, 'error', err.message);

            next(new Error())
        }
        else if (data) {

            res.redirect(config.url.blocked_app)
        }
        else if(req.session.login && req.session.login.blocked){

            res.redirect(config.url.blocked_user);
        }
        else next();
    })
})

module.exports = router;