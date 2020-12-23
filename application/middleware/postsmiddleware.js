const {getNRecentPosts, getPostById} = require('../models/Posts');
const {getCommentsForPost} = require('../models/Comments');
const postMiddleWare = {}

postMiddleWare.getRecentPosts = async function(req,res,next){
    try{
        let results = await getNRecentPosts(8);
        res.locals.results = results;
        if(results.length == 0){
            req.flash('error', 'There are no posts created yet');
        }
        next();
    }catch(err){
        next(err);
    }
}

postMiddleWare.getPostById = async function(req,res,next){
    try{
        let postId = req.params.id;
        let results = await getPostById(postId);
        if(results && results.length){
            res.locals.currentPost = results[0];
            next();
        }else{
            req.flash("error", "These are not the posts you are looking for.");
            res.redirect('/');
        }
    }catch(err){
        next(err);
    }
}

postMiddleWare.getCommentsForPost = async function(req,res,next) {
    let postId = req.params.id;
    try{
        let results = await getCommentsForPost(postId);
        res.locals.currentPost.comments = results;
        next();
    }catch(err){
        next(err);
    }
}

module.exports = postMiddleWare;