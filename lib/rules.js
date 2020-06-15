
const email=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

module.exports={
    username:{
        min:10,
        max:30,
        pattern:email
    },
    password:{
        min:8,
        max:20,
        pattern:/^[a-zA-Z0-9!@#$%^&*_+:?{|}()\[\]~-]{8,20}$/
    },
    _2fa:{
        pattern:/^\d+$/
    }
}