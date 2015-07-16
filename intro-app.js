Post = new Mongo.Collection("post");

if (Meteor.isClient) {
    Template.main.helpers({
        post: function() {
            return Post.find();
        },
        date: function() {
            return moment(this.date).fromNow();
        },
        users: function() {
            return Users.find({});
        },
    })

}
