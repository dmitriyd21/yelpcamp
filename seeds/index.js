if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const axios = require('axios');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

await mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: [{
        client_id: '6L0wnMGRZFyLPx6--3ZqUQr2lzW_qTw_ZTcxp7KIGBw',
        collections: 1114848,

      }],
    })
    return resp.data.urls.small
  } catch (err) {
    console.error(err)
  }
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random50 = Math.floor(Math.random() * 50);
    const price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random50].city}, ${cities[random50].admin_name}`
    const camp = new Campground({
      author: '64312a77e704631af8af97d6',
      location: location,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [{
        path: 'https://res.cloudinary.com/dainmtlap/image/upload/v1681482495/YelpCamp/x70jrsfzpbcqhusdklzs.jpg',
        filename: 'njrfb13uslwahhtmsgdg'
      },
      {
        path: 'https://res.cloudinary.com/dainmtlap/image/upload/v1681482497/YelpCamp/njrfb13uslwahhtmsgdg.jpg',
        filename: 'x70jrsfzpbcqhusdklzs'
      }],
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random50].lng,
          cities[random50].lat
        ]
      }
    })
    await camp.save();
  }
}

seedDB().then(() => {
  mongoose.connection.close();
})