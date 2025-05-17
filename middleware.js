const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>
{
  
    if(!req.isAuthenticated())
    {
        // console.log(req.path,"..",req.originalUrl)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing..!")
        return res.redirect("/login");
    }
    next();

}


module.exports.saveRedirectUrl = (req,res,next) =>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings");
    }

    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }

    next();
};




module.exports.isReviewAuthor = async  (req,res,next)=>
{
     let {id, reviewId } = req.params;
   let review =  Review.findById(id);
   if(review.author._id.equals(currUser._id))
   {
    req.flash("error","You are not the authr of this review");
    return res.redirect(`/listings${id}`);
   }
   next();

}
