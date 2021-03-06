const express=require('express');
const path =require('path');
const mongoose = require('mongoose');
const session =require('express-session');
const ejsMate = require('ejs-mate');
const flash =require('connect-flash');
const app=express();
const ExpressError=require('./utils/ExpressError');
const methodOverride = require('method-override');
const usersRoutes = require('./routes/users')
const CampgroundsRoutes = require('./routes/campgrounds');
const ReviewsRoutes = require('./routes/reviews');
const passport =require('passport');
const LocalStrategy =require('passport-local');
const User = require('./Models/user');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Database Connected');
});

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));

const sessionConfig = {
    secret: 'Mysecret',
    saveUninitialized:true,
    resave:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser=req.user;
    res.locals.success  = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/',usersRoutes);
app.use('/campgrounds',CampgroundsRoutes);
app.use('/campgrounds/:id/reviews',ReviewsRoutes);
app.get('/',(req,res) => {
    res.render('home');
})




app.all('*',(req,res,next) => {
    next(new ExpressError('Page not Found',404));
})

app.use((err,req,res,next) => {
    const {statusCode = 500}=err;
    if(!err.message) err.message= "OH no something went Wrong";
    res.status(statusCode).render('error',{err});
});


app.listen(3000,() => {
    console.log('SERVING THE PORT 3000!!!')
})