Router.map(function() {
	
  this.route('map', {
    path: '/',
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
  this.route("profile");
  this.route("friends");
  this.route("register");
});

Router.configure({
  layoutTemplate: "layout"
});