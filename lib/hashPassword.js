const crypto = require('crypto');

const genRandomString = (length)=>{

    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex')
        .slice(0,length);
};

exports.sha512 = (password, salt)=>{

    const hash = crypto.createHmac('sha512', salt);

    hash.update(password);

    const value = hash.digest('hex');

    return {
        salt:salt,
        hash:value
    };
};

exports.saltHashPassword=function(userpassword) {

    const salt = genRandomString(16);

    const data = this.sha512(userpassword, salt);

    return data.hash+data.salt;
};