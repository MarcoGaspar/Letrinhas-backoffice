window.Home = Backbone.View.extend({

    events: {
        "click #loginbtn": "login",
        "click #showDownload": "showDownload",
        "click .btn-info": "appDownload",
        "click #hide": "hide",
        'keydown' : 'keydownHandler'
    },

    keydownHandler: function(e) {

        if (e.keyCode === 13) {
            this.login();
        }
    },


    //Show Login Modal
        attemptlogin: function(e) {
        var self = this;

        //Check User Authenticity
        modem('GET', 'me',

            //Response Handler
            function(json) {
                console.log(json)
                    //If Session Already Present, Go to user main
                app.navigate("/user", {
                    trigger: true
                });
            },

            //Error Handling
            function(xhr, ajaxOptions, thrownError) {
                //Remove Session Key if login atempt failed
                alert('Dados incorrectos');
                window.sessionStorage.removeItem("keyo");
            }
        );



    },

    checkKeyo: function() {

            if(window.sessionStorage.getItem("keyo")){
                $('#content').append(loadingSpinner());
                      //If Session Already Present, Go to user main
                  app.navigate("/user", {
                      trigger: true
                  })
            }
    },

    //Login Process
    login: function(e) {


        //Create Credentials
        var cre = $('#userEmail').val() + ':' + md5($("#psswrd").val()); //Credentials = Username:Password
        var creb = btoa(cre); //Credentials Base64
        window.sessionStorage.setItem("keyo", creb); //Store Credentials Base64
        window.sessionStorage.setItem("user", $('#userEmail').val());
        //Check User Authenticity
        modem('GET', 'me',

            //Response Handler
            function(json) {

                app.navigate("/user", {
                    trigger: true
                });
                location.reload();
                //Show menus
            },
            function(xhr, ajaxOptions, thrownError) {

                var json = JSON.parse(xhr.responseText);
                //alertMsg("body", "Dados incorrectos");

                document.getElementById("erroLogin").setAttribute("style", "display:block");
                setTimeout(function() {
                    document.getElementById("erroLogin").setAttribute("style", "display:hidden");
                }, 1500);

                //Remove Session Key if login atempt failed
                window.sessionStorage.removeItem("keyo");
                //Checks Error Type
                if (json.message.statusCode == 404) {
                    alert('Dados incorrectos');
                    //alertMsg("body", "Dados incorrectosr");
                } else {
                    alert('Dados incorrectos');
                }

            }
        );

    },


    //Show App Download Modal
    showDownload: function(e) {
        var self = this;

        //Check For BasicAuth Session Cookie
        var keyo = window.sessionStorage.getItem("keyo");

        if (keyo) {
            $("#mApp").modal("show");
        } else {
            self.item = "app";
            $("#mLogin").modal("show");
        }

    },

    //Download App (This Doesn't Prevent File Download By Link Request)
    appDownload: function(e) {

        //Check User Authenticity
        modem('GET', 'me',

            //Response Handler
            function(json) {
                //Hide App Download Modal
                $("#mApp").modal("hide");
            },

            //Error Handling
            function(xhr, ajaxOptions, thrownError) {
                e.preventDefault();

                //Remove Session Key if login atempt failed
                window.sessionStorage.removeItem("keyo");

                //Hide App Download Modal
                $("#mApp").modal("hide");

            }
        );
    },

    //Class Initializer
    initialize: function() {
      //$('#content').append(loadingSpinner());
      this.checkKeyo();
    },

    //Class Renderer
    render: function() {

        $(this.el).html(this.template());
        $(".card-grid", this.el).flip({
            trigger: 'hover'
        });
        $('.card-grid', this.el).css({
            'height': $('.card-grid').width() + 'px'
        });
        // $('#fullpage', this.el).i18n();
        $('#content').append(loadingSpinner());
        return this;
    }

});
