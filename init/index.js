// Initialization Logic

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/travellust";

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
})

async function main(){
    mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany();

    // Adding Owner Property in all Listings
    // using spread so that, all remaining fields remain as it is as before; just add a new field owner to all listings
    initData.data = initData.data.map((obj) => ({...obj, owner: "664c5a4d827ccb9f4d6d1072"}));

    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();