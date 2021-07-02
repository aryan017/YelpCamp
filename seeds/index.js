const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors,places}= require('./seedHelpers');
const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database Connected');
});

const Sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000= Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campground({
            author: '6032475100619f17c46ef945',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${Sample(descriptors)} ${Sample(places)}`,
            image: 'https://source.unsplash.com/collection/155011',
            description:'This is the best campground in the world',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
