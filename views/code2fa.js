const config=require('../config.json');

module.exports=(req,res)=>{

    const html=`<!DOCTYPE html>
<html>
<head>
    <title>`+config.app.name+` / `+req.session.lang._2fa.title+`</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"> 
    <style>
         html, body {
            margin: 0;
            padding: 0;
            height: 100%;
        }
        
        body {
            font: 14px Verdana,Arial,sans-serif;;
            background-color: #fff;
            line-height: 18px;
        }
        
        .em2-container {
            margin: 0 auto;
            padding-top: 40px;
        }
       
        .em2-form-box {
            margin:30px auto;
            width: 310px;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            border:solid 1px #eee
        }
        
        .em2-form-btn {
            width:70px;
            padding:11px 5px;
            border-radius: 4px;
            border:solid 1px #ccc;
            background: #f1f1f1;
            font-size: 15px;
            color: #777;
            vertical-align:middle;
            font-family : inherit;
        }
        
        .em2-form-label {
            font-size: 14px ;
            color: #777;
        }
        
        .em2-form-input {
            width:150px;
            padding:11px 5px;
            font-size:16px;
            border-radius:4px;
            vertical-align:middle;
            border:solid 1px #dddddd;
        }
        
        .em2-error {
            width: 335px;
            margin:20px auto;
            padding: 5px;
            -webkit-border-radius: 3px;
            -moz-border-radius: 3px;
            border-radius: 3px;
            font-size: 16px;
            color: #a94442;
            background-color: #f2dede;
            border: solid 1px #f2bdbd;
        }
        
        .logout{
            margin:0 auto;
            width: 303px;
            text-align: right;
        }
        
        a {
            color: #4c5960;
            font-weight: bold;
        }

        input[type='number'] {
            -moz-appearance:textfield;
        }
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    </style>
</head>
<body>
    <div class="em2-container">
        <div class="logout">
            <a href="`+config.url.logout+`">`+req.session.lang.logout+`</a>
        </div>
        `+(req.session._2fa.failed.msg ?
            `<div class="em2-error">`+req.session._2fa.failed.msg+`</div>`:
        ``
        )+`
        <form action="`+config.url._2fa+`" method="POST" class="em2-form-box">
            <label class="em2-form-label">`+req.session.lang._2fa.input_2fa_kod+`</label>
            <input name="code" type="number" maxlength="10" class="em2-form-input" />
            <button class="em2-form-btn" onclick="return send()">`+req.session.lang._2fa.posalji+`</button>
        </form>
    </div>
</body>
</html>`;

    req.session._2fa.failed.msg='';

    res.send(html);
}