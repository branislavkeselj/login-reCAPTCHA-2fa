
const fs=require('fs');

module.exports=(req,type,msg)=>{

    const path='./log/'+type;

    const accessFolder=(path,callback)=>{

        const createFolder=(path)=>{

            fs.mkdir(path, (err) => {

                if (err) {
                    callback(err);
                }
                else callback(null);
            })
        }

        fs.access(path, (err)=> {

            if (err && err.code === 'ENOENT') {

                createFolder(path);
            }
            else callback(null)
        })
    }

    const appendFile=()=>{

        const d = new Date();

        const date=d.getFullYear() + "-" +("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) ;

        const time=("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+':'+ ("0" + d.getSeconds()).slice(-2)+'.'+d.getMilliseconds();

        const info=' | '+(req ? 'IP: '+req.session.ip+(req.session.user.username ? ' | USERNAME: '+req.session.user.username:'')+' | ':'');

        const stream=fs.createWriteStream(path+'/'+date+'.txt', {flags:'a+'});

        stream.write(time+info+msg+'\n');//msg.replace(/\n/g,'')

        stream.on('error',(err)=>{
            console.log(err);
        })
    }

    accessFolder(path,(err)=>{

        if(err){
            console.log(err);
        }
        else appendFile()
    })
};