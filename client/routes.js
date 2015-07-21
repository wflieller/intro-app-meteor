Router.map(function() {
	
  this.route('map', {
    path: '/map',
    data: function () {
      Session.set("currentPhoto", null);
    }
  });
  this.route("mapWithPhoto", {
    template: "map",
    path: 'map/:_id',
    data: function () {
      Session.set("currentPhoto", this.params._id);
    }
  });
  this.route('camera-page');
  this.route("list");
  this.route("profile", {
    template: "profile",
    path: 'profile/:_id'
  });
  this.route("friends");
  this.route("register", {
    template: "register",
    path: "/"
  });
});

Router.configure({
  layoutTemplate: "layout"
});