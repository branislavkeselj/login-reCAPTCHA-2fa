const config=require('../config.json');

module.exports=(req,res,data)=>{

    const html=`<!DOCTYPE html>
<html>
<head>
    <title>`+config.app.name+`</title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
        }
    </style>
</head>
<body>
<a href="`+config.url.logout+`">`+req.session.lang.logout+`</a>
<br /><br />
app
</body>
</html>`;

    res.status(200).send(html);
}