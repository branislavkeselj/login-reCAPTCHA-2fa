const otplib=require('otplib');

const rules=require('../../lib/rules');

const config=require('../../config.json');

const logger=require('../../lib/log/write');

module.exports=(req,res)=>{
 
    new Promise(validate)
    .then(verifyCode)
    .catch(failed);
   
    function validate(resolve, reject){
    
        const code=(req.body.code||'').trim();

        if(rules._2fa.pattern.test(code)){

            resolve(code); // 
        }
        else reject(error('rules_2fa','CONTROLLERS/AUTH/CODE2FA | validate | CODE['+code+'] | FORMAT'))
    }

    function verifyCode(code){

        if(otplib.authenticator.check(code, req.session.user._2fa_code)){

            req.session._2fa.enable=0;

            res.redirect(config.url.root);
        }
        else throw error('wrong_code','CONTROLLERS/AUTH/CODE2FA | verifyCode')
    }

    function failed(err){

        if(config._2FA.failed.attempts){

            req.session._2fa.failed.attempts+=1;

            if(config._2FA.failed.attempts===req.session._2fa.failed.attempts){
            
                res.redirect(config.url.logout);

                return;
            }
        }
        
        req.session._2fa.failed.msg=req.session.lang._2fa[err.message]; 

        res.redirect(config.url._2fa);
    }

    function error(err,log){
        
        logger(req,'error',log);

        return new Error(err);
    }
}