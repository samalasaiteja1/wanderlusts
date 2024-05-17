const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken});

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };
module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
  }

  module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path:"reviews",
      populate:{
        path:"author",
      },
    })
      .populate("owner"); // Populate the owner field
    if (!listing) {
      req.flash("error", "Listing you request does not exist!");
      res.redirect("/listings");
      return;
    }
   
    res.render("listings/show.ejs", { listing });
  };
  module.exports.createlisting=async(req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
      query:req.body.listing.location,
      limit: 1
    })
      .send();
      

    let url=req.file.path;
    let filename=req.file.filename;

     const newListing = new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     newListing.geometry = response.body.features[0].geometry;
     let savedListing= await newListing.save();
     console.log(savedListing);
   req.flash("success","New Listing created");
   res.redirect("/listings");
  
};
module.exports.editlisting = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }
    
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/h_10,w_15");
    
    res.render("listings/edit.ejs", { listing, originalImageUrl });
  } catch (err) {
    console.error("Error:", err);
    req.flash("error", "Something went wrong while fetching the listing details!");
    res.redirect("/listings");
  }
};

  
  module.exports.updatelisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") { // Corrected typo: req.fil -> req.file
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};

  module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","New Listing deleted");
    res.redirect("/listings");
  };