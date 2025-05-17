const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../../models/listing.js");


const MONGO_URL = "mongodb://Vignayreddy:Vinnu2006@localhost:27017/wanderlust?authSource=admin";

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>
{
    console.log(err);
});

async function main()
{
    await mongoose.connect(MONGO_URL);
}


const initDB = async() =>{

    await Listing.deleteMany({});
   initData.data =  initData.data.map((obj)=>({...obj, owner:'68258cf214d0468392daaa57'}));
    await Listing.insertMany(initData.data);
    console.log("Data was inserted successfully");

}

initDB();