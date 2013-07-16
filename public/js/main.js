var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "arts" : "list",
        "arts/page/:page"  : "list",
        "arts/add"         : "addArt",
        "arts/:id"         : "artDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var artList = new ArtCollection();
        artList.fetch({success: function(){
            $("#content").html(new ArtListView({model: artList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    artDetails: function (id) {
        var art = new Art({_id: id});
        art.fetch({success: function(){
            $("#content").html(new ArtView({model: art}).el);
        }});
        this.headerView.selectMenuItem();
    },

    addArt: function() {
        var art = new Art();
        $('#content').html(new ArtView({model: art}).el);
        this.headerView.selectMenuItem('add-menu');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'ArtView', 'ArtListItemView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});