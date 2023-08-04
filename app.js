const express = require('express');
const path = require('path');

const Campground = require('./models/campground')

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

const app = express();


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/makenewcamp',async (req,res)=>{
    const camp= new Campground({
        title:"backyard"
    });
    await camp.save();
    res.send(camp);
})


app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})