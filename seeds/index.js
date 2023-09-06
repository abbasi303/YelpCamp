const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelpers');


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected")
});

const sample = array =>array[Math.floor(Math.random() * array.length)]

const seedDB =async(req,res )=>{
    await Campground.deleteMany({});
    for(let i=0; i<50;i++){
        const random100 = Math.floor(Math.random()*1000)
        const price =Math.floor(Math.random()*20 +10)

        const camp = new Campground({
            //YOUR USER ID
            author: '64e749ff110bdb6134b7d71b',
            location:`${cities[random100].city},${cities[random100].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random100].longitude,
                    cities[random100].latitude
                ]
            },
            images: [
                {
                    url:'https://res.cloudinary.com/dmnf19is4/image/upload/v1693072723/YelpCamp/mr59fab6g0tlmgc4iqty.jpg',
                    filename: 'YelpCamp/mr59fab6g0tlmgc4iqty'
                },
                {
                    url:'https://res.cloudinary.com/dmnf19is4/image/upload/v1693071452/YelpCamp/jhj99k6v7nfexr9scsqn.jpg',
                    filename: 'YelpCamp/jhj99k6v7nfexr9scsqn'
                }
            ]
        })
        await camp.save();
    }
}

seedDB();