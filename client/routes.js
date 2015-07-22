Router.configure({
  layoutTemplate: "layout"
});

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
  this.route("profile", {
    template: "profile",
    path: 'profile/:_id'
  });
  this.route("updates");
  this.route("social");
  this.route("signin")
});

var mustBeSignedIn = function(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('/signin');
    this.next();
  }
  else {
    this.next();
  }
};

Router.onBeforeAction(mustBeSignedIn, {except: ['/signin']});

