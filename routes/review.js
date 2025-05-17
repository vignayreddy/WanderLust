const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js"); // Correct import
const { isLoggedIn,isReviewAuthor } = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");


const validateReview =(req,res,next)=>
{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details[0].message;
        throw new ExpressError(msg, 400);

    }
    else{
        next();
    }
}

//Reviews
//Post route
router.post("/",isLoggedIn, validateReview,wrapAsync(createReview));


//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(destroyReview));


module.exports=router;