const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn,isOwner } = require("../middleware.js");
const { index, renderNewForm, showListing, createListing, renderEditForm, updateListing, destroyListing } = require("../controllers/listings.js");
const multer = require("multer"); //For Local
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});



// New Route
router.get("/new",isLoggedIn,renderNewForm);
// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, renderEditForm);


// Index Route
// Create Route
router.route("/")
    .get(index)
   .post(isLoggedIn,upload.single("image"),createListing);
  


// Show Route
// Update Route
// Delete Route
router.route("/:id")
    .get(showListing )
    .put(isLoggedIn,isOwner,upload.single("image"), updateListing)
    .delete(isLoggedIn,isOwner, destroyListing);

module.exports=router;