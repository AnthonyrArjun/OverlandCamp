const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
global.fetch = fetch;

mongoose.connect('mongodb://localhost:27017/overland-camp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected');
});


  // call unsplash and return small image
async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
            client_id: '-ymN9aap_V5Tud9aHcG4q2fVzuTItsEs-B5rH8pMiFI',
            collections: 'MfEeelWy2oQ',
        },
        })
        return resp.data.urls.small
    } catch (err) {
        console.error(err)
    }
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 25; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor sit amet. Sit dolorem inventore ut minima nisi aut unde ullam et officia omnis qui totam quis aut sint officiis. Sed dolor vero et iste velit non ipsa fugiat et perferendis reprehenderit At quaerat vero.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});