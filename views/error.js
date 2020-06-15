const config=require('../config.json');

module.exports=(req,res,data)=>{

    data=data||{};

   const html=`<!DOCTYPE html>
<html>
<head>
    <title>`+(data.title||req.session.lang.greska)+' - '+(data.status ? data.status:500)+`</title>
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
            display: table;
            font: 14px Verdana,Arial,sans-serif;
            
        }
        .container {
            text-align: center;
          
        }
        .logo {
            margin:0 auto;
            padding-top:40px;
        }
        .content {
            text-align: center;
            display: inline-block;
        }
        .title {
            font-size: 170px;
            margin-top: 30px;
        }
        .msg {
           font-size: 16px;
           font-weight: bold;
           color: #4c5960;
           background: #deeef5;
           border-radius: 4px;
           padding:8px;
           margin-bottom: 15px
       }
        a {
            color: #4c5960;
            font-weight: bold;
        }
        .link {
            font-size: 16px;
            font-weight: normal;
            color: #4c5960;
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
        <div class="title">`+(data.status||500)+`</div>
        <div class="msg">`+(data.message||req.session.lang.greska_na_serveru)+`</div>
        <div class="link">`+req.session.lang.vratite_se_na_link_pocetnu_stranu.replace('{url}',config.url.root)+`</div>
    </div>
    <div class="footer">&#169;`+new Date().getFullYear()+`</div>
</div>
</body>
</html>`;

    res.status(data.status||500).send(html);
}