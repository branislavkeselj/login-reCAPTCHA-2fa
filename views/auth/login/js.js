function send() {

    var err=0;

    var validate={
        email:function(v) {return v.trim().length},
        password:function(v) {return v.trim().length},
        reCaptcha:function() { return grecaptcha.getResponse().length }
    };

    $('.em2-form-input').removeClass('em2-form-input-error');

    var v=$('#username').val();

    if(!validate.email(v)){

        $('#username').addClass('em2-form-input-error');

        err=1;
    }

    v=$('#password').val();

    if(!validate.password(v)) {

        $('#password').addClass('em2-form-input-error');

        err=1;
    }

    if($('#em2-form-reCaptcha').length && !validate.reCaptcha()) {

        $('#em2-form-reCaptcha').addClass('em2-form-input-error');

        err=1;
    }

    return !err
}

function cb() {
    $('#em2-form-reCaptcha').removeClass('em2-form-input-error');
}