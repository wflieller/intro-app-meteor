Meteor.publish("posts", function(userid){
	return Posts.find([]);
})

Meteor.publish("likes", function(postid){
	return Likes.find({post:postid});
})

Meteor.methods({
  // {text:'', owner:'', date:'', parent:''}
  'addPost': function(options){
    var post = {
      text:options.text,
      owner:Meteor.userId(),
      date:new Date(),
      parent:options.parent
    }
    Posts.insert(post);
  },
  'removePost': function(id){
    Posts.remove({_id:id});
  },
  'removeAllPosts': function(){
    Posts.remove({});
  },
  'likePost': function(id){
  	Likes.insert({_id:id});
  },
  'removePhoto': function(id){
    Photos.remove({_id:id});
  },
})