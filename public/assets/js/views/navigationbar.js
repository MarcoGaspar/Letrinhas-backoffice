window.NavigationBarView = Backbone.View.extend({

    events: {
        "click .gotoprofile": "gotoprofile",
        "click .gotostudents": "gotostudents",
        "click .gotoschools": "gotoschools",
        "click #logoutBtn": "logout"
    },

    gotoprofile: function (e) {
        e.preventDefault();
        app.navigate('user', true);
    },

    logout: function (e) {
        e.preventDefault();
        window.sessionStorage.removeItem("keyo");
        history.replaceState({}, "Title", "#home");
        location.reload();
    },

    gotostudents: function (e) {
        e.preventDefault();
        app.navigate('students', true);
    },

    gotoschools: function (e) {
        e.preventDefault();
        app.navigate('schools', true);
    },

    //Class Initializer
    initialize: function () {
        this.data = this.model.toJSON();
    },

    //Class Renderer
    render: function () {
        var self = this;
        $(this.el).html(this.template(self.data));
        /// $("body", this.el).addClass("sidebar-collapse")

        return this;
    }

});
