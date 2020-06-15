const express = require('express');

const router = express.Router();

const config=require('../config.json');

const loginFormView=require('../views/auth/login/form');

const loginController=require('../controllers/auth/login');

router.use((req, res, next)=> {

    if(!config.login.enable) {

        next(new Error(req.session.lang.login.prijavljivanje_na_aplikaciju_je_onemoguceno))
    }
    else if(!req.session.user.guest) {

        res.redirect(config.url.root);
    }
    else next();
})

router.get('/',loginFormView);

router.post('/',loginController);

module.exports = router;