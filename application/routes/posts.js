var express = require('express');
var router = express.Router();
const {successPrint,errorPrint} = require('../helpers/debug/debugPrinters');
var sharp = require('sharp');
var multer = require('multer');
var crypto = require('crypto');
var PostError = require('../helpers/error/PostErrors');
var PostModel = require('../models/Posts');

var storage = multer.diskStorage({
   destination: function (req,file,cb){
       cb(null, "public/images/uploads")
   },
    filename: function(req,file,cb){
       let fileExt = file.mimetype.split('/')[1];
       let randomName = crypto.randomBytes(22).toString("hex");
       cb(null, `${randomName}.${fileExt}`);
    },
});

var uploader = multer({storage : storage});

router.post('/createPost',uploader.single("uploadImage"), (req,res,next) => {
    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;
    let title = req.body.title;
    let description = req.body.description;
    let fk_userid = req.session.userId;
    /**
     * do server validation here
     * if any values that used for the insert statement are undefined,
     * mysql.query or execute will fail with the following error:
     * BIND parameters cannot be undefined.
     */
    sharp(fileUploaded)
        .resize(200)
        .toFile(destinationOfThumbnail)
        .then(() => {
            return PostModel.create(
                title,
                description,
                fileUploaded,
                destinationOfThumbnail,
                fk_userid,
            );
        })
        .then((postWasCreated) => {
            if(postWasCreated){
                req.flash('success', "Your post was created successfully");
                res.redirect('/');
            }else{
                throw new PostError('Post could not be created' , '/postimage', 200);
            }
        })
        .catch((err) =>{
            if(err instanceof PostError){
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            }else{
                next(err);
            }

        });

});

router.get("/search",async(req,res,next) => {
    try{
        let searchTerm = req.query.search;
        if(!searchTerm){
            res.send({
                resultsStatus: "info",
                message: "No seach term given",
                results:[],
            });
        }else{
            let results = await PostModel.search(searchTerm);
            if(results.length){
                res.send({
                    resultStatus: "info",
                    message: `${results.length} results found`,
                    results: results1,
                });
            }else{
                let results = await PostModel.getNRecentPosts(8);
                res.send({
                    message:
                        "No results where found for your search but here are the 8 most recent posts",
                    results: results,
                });
            }
        }

    }catch{}
})

module.exports = router;