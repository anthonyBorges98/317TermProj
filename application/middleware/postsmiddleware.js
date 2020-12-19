var PostModel = require('../models/Posts');
const postMiddleWare = {}

postMiddleWare.getRecentPosts = async function(req,res,next){
    try{
        let results = await PostModel.getNRecentPosts(8);
        res.locals.results;
        if(results.length == 0){
            req.flash('error', 'There are no posts created yet');
        }
        next();
    }catch(err){
        next(err);
    }
}

module.exports = postMiddleWare;