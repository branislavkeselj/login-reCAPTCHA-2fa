const express = require('express');

const router = express.Router();

const config=require('../config.json');

const indexController=require('../controllers/index');

const logoutController=require('../controllers/auth/logout');

const _2faView=require('../views/code2fa');

const _2faController=require('../controllers/auth/code2fa');

router.get(config.url.logout,logoutController);

router.use((req, res, next)=> {

    if(req.session.user.guest) {

        res.redirect(config.url.login);
    }
    else next();
})

router.use(config.url._2fa,(req,res,next)=>{

    if(!req.session._2fa.enable){

        res.redirect(config.url.root);
    }
    else next();
})

router.get(config.url._2fa,_2faView);

router.post(config.url._2fa,_2faController);

router.use((req, res, next)=> {

    if(req.session._2fa.enable){

        res.redirect(config.url._2fa);
    }
    else next()
})

router.get(config.url.root,indexController);

module.exports = router;