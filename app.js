// if(process.env.NODE_ENV !== "production"){  //allow if you want to see stack trace
//     require('dotenv').config();
// }
require('dotenv').config();


const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate')
const Campground = require('./models/campground')
const catchAsync =require('./utils/catchAsync')
const ExpressError =require('./utils/ExpressError')
const Joi = require('joi')
const session = require('express-session')
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const Review = require('./models/review')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

const flash = require('connect-flash')
const campgroundsRoute = require('./routes/campground')
const userRoute = require('./routes/user')
const reviewsRoute = require('./routes/reviews')


// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
const mongoose = require('mongoose');
require('dotenv').config(); // Make sure this is called if you're using a .env file

const dbUrl = process.env.DB_URL; // Assuming your connection string is stored in DB_URL
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Database connection error', err));




const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database Connected")
});

const app = express();

app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    name:'Yelp-session',
    secret: 'thismustbesecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        // secure:true,
        expires: Date.now() +1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(session(sessionConfig))
app.use(flash());
app.use(mongoSanitize())
app.use(helmet())


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/douqbebwk/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            // Update the styleSrc array to include the sources from your CSP directive
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://kit-free.fontawesome.com/", 
                "https://stackpath.bootstrapcdn.com/", 
                "https://api.mapbox.com/", 
                "https://api.tiles.mapbox.com/", 
                "https://fonts.googleapis.com/", 
                "https://use.fontawesome.com/", 
                "https://cdn.jsdelivr.net"
            ],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/douqbebwk/", // Make sure this matches your Cloudinary account!
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    console.log(req.session)
    res.locals.currentUser= req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    next();

})

app.get('/fakeuser',async(req,res,next)=>{
    const user = new User({email: 'abbasigmail.com', username:'abbasi'})
    const newUser = await User.register(user,'chicken');
    res.send(newUser)
})

app.get('/',(req,res)=>{
    res.render('home')
})

app.use('/',userRoute);
app.use('/campgrounds',campgroundsRoute);
app.use('/campgrounds/:id/reviews',reviewsRoute);





app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode =500 , message='Something wrong'}= err;
    if(!err.message) err.message = 'Oh no, Something Went Wrong'
    res.status(statusCode).render('error',{err});
    
})

app.listen(3000, ()=>{
    console.log("Server running on port 3000")
})