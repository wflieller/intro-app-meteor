Photos = new Meteor.Collection("photos");
Posts = new Meteor.Collection('posts');
Likes = new Meteor.Collection('likes');


if (Meteor.isClient) {
    var selectedMarkerId = new Blaze.ReactiveVar(null);


    Deps.autorun(function() {
        selectedMarkerId.set(Session.get("currentPhoto"));
    });

    Tracker.autorun(function() {
        if (Reload.isWaitingForResume()) {
            alert("Close and reopen this app to get the new version!");
        }
    });

    Template.map.helpers({
        markers: Photos.find(),
        selectedMarkerId: selectedMarkerId
    });

    var onSuccess = function(imageData) {
        var latLng = Geolocation.latLng();

        if (!latLng) {
            return;
        }

        Photos.insert({
            image: imageData,
            createdAt: new Date(),
            owner:Meteor.userId(),
            username: Meteor.user().profile.firstName,
            marker: {
                lat: latLng.lat,
                lng: latLng.lng,
                infoWindowContent: "<img width='100' src='" + imageData + "' />"
            }
        });



        Router.go("/list");
    };
    

    Template.layout.events({
        "click .photo-link": function() {
            MeteorCamera.getPicture(function(error, data) {
                // we have a picture
                if (!error) {
                    onSuccess(data);
                }
            });
        }
    });

    Template.layout.helpers({
        onPage: function(pageName) {
            return Router.current().route.name === pageName;
        }
    });

    Template.list.helpers({
        photos: function() {
            return Photos.find({}, {sort: {"createdAt": -1}
            });
        },
        createdAt: function() {
            return moment(this.createdAt).fromNow();
        }
    });
    Template.list.likeCount = function() {
        return Likes.find(this._id).count();
    };

    Template.list.events({
      'click .remove': function() {
            Meteor.call("removePhoto", this._id);
      },
      'click .like': function() {
            Meteor.call("likePhoto", this._id);
      }
    })



    Template.post.likeCount = function() {
        return Likes.find(this._id).count();
    }

    Template.post.postComments = function(){
      return Posts.find({parent:this._id})
    }

    Template.post.events({
      'keyup .comment': function(evt, tmpl) {
            if (evt.which === 13) {
              var commenttext = tmpl.find('.comment').value;
              var options = {text: commenttext, parent:this._id};
              Meteor.call('addPost', options);
              $('.comment').val('').select().focus();
            }
      },
      'click .remove': function() {
            Meteor.call("removePost", this._id);
      },
      'click .like': function() {
            Meteor.call("likePost", this._id);
      }

    })

    Template.updates.helpers({
      isOwner: function() {
            return this.owner === Meteor.userId();
        }
    })

    Template.updates.rendered = function() {
        Deps.autorun(function() {
            Meteor.subscribe("posts", Meteor.userId());
            Meteor.subscribe("likes");
        })
    }

    Template.updates.posts = function() {
        return Posts.find({parent:null}, {
            sort: {
                date: -1
            }
        });
    }

    Template.updates.events({
        'keyup .posttext': function(evt, tmpl) {
            if (evt.which === 13) {
                var posttext = tmpl.find('.posttext').value;
                var options = {text: posttext, parent: null};
                Meteor.call('addPost', options);
                $('.posttext').val("").select().focus();
            }
        }
    })

    Template.sidebar.helpers({
      opts: function() {
        var opts ={
          facebook: true,
          twitter: true,
          pinterest: false,
          shareData: {
            url: 'http://www.intro-app.meteor.com'
          }
        };
        return opts;
      }
    })
  }



// Post = new Mongo.Collection("post");

// if (Meteor.isClient) {
//     Template.main.helpers({
//         post: function() {
//             return Post.find();
//         },
//         date: function() {
//             return moment(this.date).fromNow();
//         },
//         users: function() {
//             return Users.find({});
//         },
//     })

// }
