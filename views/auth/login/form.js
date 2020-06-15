const fs=require('fs');

const config=require('../../../config.json');

const crypto=require('crypto');

module.exports=(req,res)=>{

    const path='./views/auth/login';

    const css='<style>'+fs.readFileSync(path+'/css.css')+'</style>';

    const js='<script>'+fs.readFileSync(path+'/js.js')+'</script>';

    req.session.token=crypto.randomBytes(48).toString('hex');

    const html=`<!DOCTYPE html>
<html>
<head>
    <title>`+config.app.name+` / `+req.session.lang.login.title+`</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <script src="js/jquery-3.2.1.min.js"></script>
    `+css+
    js+`
</head>
<body>
    <div class="em2-container">
        <div class="em2-logo">Logo</div>
        `+(req.session.login.failed.msg ?
            `<div class="em2-error-msg">`+req.session.login.failed.msg+`</div>`:
            ``
        )+`
        <form id="form" action="`+config.url.login+`" method="POST" class="em2-form-box">
            <label class="em2-form-label">`+req.session.lang.login.input_korisnicko_ime+`</label>
            <input name="username" id="username" type="text" maxlength="30" class="em2-form-input" />
            <label class="em2-form-label">`+req.session.lang.login.input_lozinka+`</label>
            <input name="password" id="password" type="password" maxlength="20" class="em2-form-input"/>
            <input name="token" type="hidden" value="`+req.session.token+`">
            `+(req.session.login.reCaptcha ?
                `<label class="em2-form-label">`+req.session.lang.login.input_reCaptcha+`</label>
                <div id="em2-form-reCaptcha" class="g-recaptcha" data-sitekey="`+config.reCaptcha.site+`" data-callback="cb"></div>`:
                ``
            )+`
            <div class="em2-form-button-box">
                <button class="em2-form-btn" onclick="return send()">`+req.session.lang.login.button_prijavi_se+`</button>
            </div>
        </form>
        <div class="em2-form-footer">&#169;`+new Date().getFullYear()+`</div>
    </div>
`+(req.session.login.reCaptcha ?
    `<script src="https://www.google.com/recaptcha/api.js?hl=sr" async defer></script>`:
    ``
)+`
</body>
</html>`;

    req.session.login.failed.msg='';

    res.send(html);
}