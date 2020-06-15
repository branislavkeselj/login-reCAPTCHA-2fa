let log=require('../../lib/log/write');

let config=require('../../config.json');

module.exports=function(req,res,next) {

    if(req.session.user.guest) {

        res.redirect(config.url.login);
    }
    else {

        const msg='IP: '+req.session.ip+' | USERNAME: '+req.session.user.username;

        req.session.destroy(function(err) {

            if(err) {

                log(null,'error','LOGOUT | '+err.message);

                next(new Error())
            }
            else {

                log(null,'logout',msg);

                res.redirect(config.url.login)
            }
        })
    }
};