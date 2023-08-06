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


        const camp= new Campground({
            location:`${cities[random100].city},${cities[random100].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://random.imagecdn.app/500/150',
            description:'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae voluptate culpa perferendis officiis animi quas sapiente maiores alias nostrum soluta ex nobis aut, consectetur sit. Cumque quisquam atque minus ipsum.',
            price
        })
        await camp.save();

    }
}

seedDB();
