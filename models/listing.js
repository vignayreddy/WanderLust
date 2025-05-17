const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new mongoose.Schema({

    title:
    {
        type: String,
        required: true
    },
    description:String,
    image:
    {
        url:String,
        filename:String,
        
        // filename:String,
        // url:{
        // type: String,
        // default:"https://unsplash.com/photos/brown-wooden-boat-moving-towards-the-mountain-O453M2Liufs",
        // set: (v)=> v===""? "https://unsplash.com/photos/brown-wooden-boat-moving-towards-the-mountain-O453M2Liufs" : v,
        // },
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry:{
        type:{
            type:String,
            enum: ["Point"],
            required:true,
        },
        coordinates:{
            type:[Number],
            required:true
        },
    },
    // category:{
    //     type:String,
    //     enum:["mountains","arctic","farms","deserts"]
    // }

});


listingSchema.post("findOneAndDelete",async(listing)=>
{

    if(listing){
  await Review.deleteMany({reviews:{$in: listing.reviews}});

    }
  
})




const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;