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



const flash = require('connect-flash')
const campgroundsRoute = require('./routes/campground')
const userRoute = require('./routes/user')
const reviewsRoute = require('./routes/reviews')


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

app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret: 'thismustbesecret',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires: Date.now() +1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
}


app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))


app.use(session(sessionConfig))
app.use(flash());

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