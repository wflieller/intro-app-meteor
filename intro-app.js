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
        }
    });



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
  }
})

    Template.friends.rendered = function() {
        Deps.autorun(function() {
            Meteor.subscribe("posts", Meteor.userId());
            Meteor.subscribe("likes");
        })
    }

    Template.friends.posts = function() {
        return Posts.find({parent:null}, {
            sort: {
                date: -1
            }
        });
    }

    Template.friends.events({
        'keyup .posttext': function(evt, tmpl) {
            if (evt.which === 13) {
                var posttext = tmpl.find('.posttext').value;
                var options = {text: posttext, parent: null};
                Meteor.call('addPost', options);
                $('.posttext').val("").select().focus();
            }
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
