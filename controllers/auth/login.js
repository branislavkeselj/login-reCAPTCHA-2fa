const db=require('../../lib/db/db');

const config=require('../../config.json');

const fetch=require('node-fetch');

const rules=require('../../lib/rules');

const logger=require('../../lib/log/write');

const redis = require('redis');

const client=redis.createClient();

const hash=require('../../lib/hashPassword');

module.exports=(req,res,next)=>{

    new Promise(validate)
    .then(selectUser)
    .then(verifyPassword)
    .then(isBlocked)
    .then(signIn)
    .catch(loginFailed);

    function selectUser(data){

        const query="SELECT `id`,`name`,`username`,`password`,`_2fa_code`,`blocked` "+
            "FROM `users` "+
            "WHERE `username`="+db.escape(data.username)+" && `deleted`=0 LIMIT 1";

        return db.executeQuery(req,query)
            .then(rez=>{

                if(rez.length===0) {

                    throw error('username_not_exist','CONTROLLERS/AUTH/LOGIN | selectUser | Korisničko ime ne postoji u bazi | USERNAME ['+data.username+']');
                }
                else {

                    data.db=rez[0];

                    return data;
                }
            })
/*            .catch(e=>{

                throw error('mysql_error','CONTROLLERS/AUTH/LOGIN | selectUser | mysql error');
            });
*/
    }

    function validate(resolve, reject){

        const log='CONTROLLERS/AUTH/LOGIN | validate | ';

        let form={};

        if(req.body.token!==req.session.token) {

            reject(error('wrong_token',log+'Pogrešan token.'));

            return;
        }

        form.username=(req.body.username||'').trim();

        if(!(rules.username.min<=form.username.length && form.username.length<=rules.username.max && rules.username.pattern.test(form.username))){

            reject(error('validate_username_format',log+'USERNAME ['+form.username+']'));

            return;
        }

        form.password=(req.body.password||'').trim();

        if(!rules.password.pattern.test(form.password)){

            reject(error('validate_password_format',log+'PASSWORD | FORMAT | USERNAME ['+form.username+']'));

            return
        }

        if(req.session.login.reCaptcha) {

            fetch(config.reCaptcha.url.replace('{secret}',config.reCaptcha.secret).replace('{response}',(req.body['g-recaptcha-response']||'')))
                .then(rez => rez.json())
                .then(json => {

                    if(json.success) resolve(form)
                    else reject(error('recaptcha_error_code',log+'RECAPTCHA | ERROR CODE'))

                }) 
                .catch(e=>reject(error('recaptcha_request',log+'RECAPTCHA | MSG: '+e.message)))
        }
        else resolve(form);
    }

   function verifyPassword(data){

        const salt=data.db.password.substring(data.db.password.length - 16,data.db.password.length);

        const password=hash.sha512(data.password,salt);

        if(data.db.password!==(password.hash+password.salt)){

            throw error('wrong_password','CONTROLLERS/AUTH/LOGIN | verifyPassword | Pogrešna lozinka | USERNAME ['+data.username+']');
        }
        return data;
    }

    function isBlocked(data){

        if(data.db.blocked) {

            throw error('account_blocked','CONTROLLERS/AUTH/LOGIN | isBlocked | Nalog je blokiran | USERNAME ['+data.username+']');
        }
        else return data;
    }

    function signIn(data){

        const query="UPDATE `users` "+
            "SET `last_visit_time`=NOW() "+
            "WHERE `id`="+data.db.id+" LIMIT 1";

        db.executeQuery(req,query)
            .catch(e=>{
                logger(req,'error','CONTROLLERS/AUTH/LOGIN | updateLastVisit | MYSQL ERROR ');
            })

        logger(req,'login','');

        data.db.guest=0;

        req.session.user=data.db;

        req.session._2fa={
            enable:!!data.db._2fa_code,
            failed:{
                attempts:0,
                msg:''
            }
        }

        delete req.session.login;

        res.redirect(config.url.root);
    }

    function loginFailed(err){

        if(err.sqlState){
            next(new Error(req.session.lang.mysql.error));
        }
        else if(err.message==='account_blocked'){

            req.session.login.blocked=1;

            res.redirect(config.url.blocked_user);
        }
        else {

            let login=req.session.login;

            login.failed.attempt+=1;

            login.failed.msg='Pogrešno korisničko ime ili lozinka.';

            if(config.login.failed.blocked.attempts && config.login.failed.blocked.attempts===login.failed.attempt){
    
                logger(req,'error','Blokiran pristup aplikaciji.');
    
                login.reCaptcha=1;

                login.failed.msg='';
    
                client.set(req.session.ip,req.session.ip, 'EX', config.login.failed.blocked.expires);

                res.redirect(config.url.blocked_app);
                
                return;
            }
            else if(!login.reCaptcha) {

                if(config.login.failed.reCaptcha && config.login.failed.reCaptcha===login.failed.attempt) login.reCaptcha=1;
            }
        
            res.redirect(config.url.login)
        }
    }

    function error(err,log){
        
        logger(req,'error',log);

        return new Error(err);
    }
}