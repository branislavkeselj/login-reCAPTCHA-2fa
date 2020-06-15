const config=require('../../config.json');

module.exports=(req,res)=>{

   const html=`<!DOCTYPE html>
<html>
<head>
    <title>`+req.session.lang.greska+` - 401</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <style>
        html, body {
            width:100%;
            height: 100%;
        }
        body {
            margin: 0;
            padding: 0;
            color: #839198;
            font: 14px Verdana,Arial,sans-serif;
        }
        .container {
            text-align: center;
          
        }
        .logo {
            margin:0 auto;
            padding-top:40px;
            text-align:left
        }
        .content {
            text-align: center;
            display: inline-block;
        }
        .msg {
           font-size: 16px;
           font-weight: bold;
           color: #4c5960;
           background: #deeef5;
           border-radius: 4px;
           padding:8px;
           margin: 30px 0 ;
       }
        .footer {
            width: 100%;
            border-top:solid 1px #f1f1f1;
            background-color: #deeef5;
            font-size: 12px;
            position: fixed;
            padding: 5px;
            bottom: 0;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="content">
        <div class="logo">Logo</div>
        <div class="msg">`+req.session.lang.login.nalog_je_blokiran+`</div>
    </div>
    <div class="footer">&#169;`+new Date().getFullYear()+`</div>
</div>
</body>
</html>`;

    res.status(401).send(html);
}