const Listing = require("../models/listing.js");
const fetch = require("node-fetch");

// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Show Listing Details
module.exports.showListing = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" }
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Create Listing with MapTiler Forward Geocoding
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image.filename = filename;
    newListing.image.url = url;

    //  Forward geocoding using MapTiler API
    const location = req.body.location || req.body.listing.location;
    const maptilerToken = process.env.MAP_TOKEN;

    try {
        const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${maptilerToken}`);
        const data = await response.json();

        if (data && data.features && data.features.length > 0) {
            newListing.geometry = data.features[0].geometry;
        } else {
            req.flash("error", "Unable to fetch geolocation for the given location.");
            return res.redirect("/listings");
        }
    } catch (error) {
        console.error("Geocoding error:", error);
        req.flash("error", "Geocoding service failed.");
        return res.redirect("/listings");
    }

    await newListing.save();
    req.flash("success", "New user created successfully");
    res.redirect("/listings");
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not found");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    try {
        let { id } = req.params;
        let url = req.file?.path;
        let filename = req.file?.filename;

        const listing = await Listing.findById(id);
        if (!listing.owner.equals(req.user._id)) {
            req.flash("error", "You don't have permissions to edit this listing");
            return res.redirect(`/listings/${id}`);
        }

        let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

        if (req.file) {
            if (!updatedListing.image) {
                updatedListing.image = {};
            }
            updatedListing.image.filename = filename;
            updatedListing.image.url = url;
            await updatedListing.save();
        }

        req.flash("success", "Listing updated");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error("Update Listing Error:", err);
        req.flash("error", "Something went wrong while updating the listing.");
        res.redirect("/listings");
    }
};



// Destroy Listing
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permissions to delete this listing");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};
