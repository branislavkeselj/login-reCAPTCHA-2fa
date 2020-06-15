
var logger=require('../log/write');

exports.executeQuery=(req,query)=> {

    return new Promise((resolve,reject)=>{

        req.getConnection((err, connection)=> {

            if(err) {
    
                logger(req,'error',err.message);
    
                reject(err);
            }
            else connection.query(query,(err, rez)=> {
    
                if (err) {
    
                    logger(req,'error','MYSQL QUERY : '+query+'\n'+'MYSQL ERROR : '+err.message);
    
                    //log.write(null,'error','MYSQL ERROR : '+err.message);
    
                    reject(err);
                }
                else resolve(rez);
            })
        })
    })    
};

exports.escape= function(str) {

    str=str.toString();

    const string=str.replace(/[\0\b\t\x1a\n\r"'\\]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\b":
                return "\\b";
            case "\t":
                return "\\t";
            case "\x1a":
                return "\\Z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
                return "\\"+char;
        }
    })

    return "'"+string+"'";
};