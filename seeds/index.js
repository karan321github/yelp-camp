const mongoose  = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const {places , descriptors} = require('./seedHelper')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp' , {
        // useNewUrlParser: true,
        // useCreateIndex: true ,
        // useUnifiedTopology: true,
   })
const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error:"))
db.once("open" , ()=> {
        console.log("DATABASE CONNECTED")
});


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '6568627ab42ec9a7d0036c35',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia ipsam eum odit accusantium debitis culpa quo voluptas consequatur maxime nemo eius quas explicabo amet, earum eveniet aliquid numquam placeat rerum?' ,
            price , 
            images: [
              {
                url: 'https://res.cloudinary.com/df2fls3be/image/upload/v1701609043/YelpCamp/nqcprvn0y5szkxfispwh.jpg',
                filename: 'YelpCamp/nqcprvn0y5szkxfispwh',
              },
              {
                url: 'https://res.cloudinary.com/df2fls3be/image/upload/v1701609043/YelpCamp/dpnswit3hdmz7rss7con.jpg',
                filename: 'YelpCamp/dpnswit3hdmz7rss7con',
              },
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})