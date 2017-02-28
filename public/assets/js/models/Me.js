var Me = Backbone.Model.extend({
    initialize: function() {

    },
    login: function(after_fetch) {
        var self = this;
        modem('GET', 'login', function(teacherData) {
            self.attributes = teacherData;
            self.set("permissionName", getUserRole(teacherData.permissionLevel));

            after_fetch();
        }, function(xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);


            setTimeout(function() {
              //alertMsg("body", "credenciais erradas");
                app.navigate('/home', {
                    trigger: true
                });
              }, 1500);
        });
    },
    fetch: function(after_fetch) {
        var self = this;
        modem('GET', 'me', function(teacherData) {
            self.attributes = teacherData;
            self.set("permissionName", getUserRole(teacherData.permissionLevel));

            after_fetch();
        }, function(xhr, ajaxOptions, thrownError) {
            var json = JSON.parse(xhr.responseText);

            setTimeout(function() {
                console.log(json.result);
                app.navigate('/home', {
                    trigger: true
                });
                }, 1500);
        });
    }
});
