if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

console.log(process.env.SECRET);
console.log(process.env.API_KEY);





// const dotenv = require('./')
const express = require('express');
const ejsMate = require('ejs-mate')
const path = require('path');
const mongoose  = require('mongoose');
const method_override = require('method-override');
const ExpressError = require('./utils/ExpressError')
const { error } = require('console');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');


const userRoutes = require('./routes/user.js')
const campgroundsRoutes = require('./routes/campgrounds.js')
const reviewsRoutes = require('./routes/reviews.js');
const { config } = require('process');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
const db = mongoose.connection 
db.on("error" , console.error.bind(console , "connection error:"))
db.once("open" , ()=> {
        console.log("DATABASE CONNECTED")
});
 


const app = express();


app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs')
app.set('views' ,path.join(__dirname , 'views'))
app.use(express.urlencoded({extended: true}))
app.use(method_override('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret:'thisshouldbebettersecret',
  resave: false ,
  saveUninitialized: false,
  cookie:{
    httpOnly: true , 
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,

  }
}



app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
   
app.use((req , res , next) => {
        console.log(req.session)
        res.locals.currentUser = req.user;
        res.locals.success = req.flash('success') ;
        res.locals.error = req.flash('error')
        next();
})

app.get('/fakeUser' , async(req  , res) => {
        const user = new User({email: 'ks867850@gmail.com' , username: 'karan'});
        const newUser = await User.register(user , 'singh321');
        res.send(newUser);
})


app.use('/' , userRoutes);
app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/reviews', reviewsRoutes)

app.get('/' , (req , res) => {
        res.render('home')
})


app.all('*' , (req , res , next) => {
        next(new ExpressError('Page is not found' , '404'))
})

app.use((err , req , res , next) =>{
        const {statusCode = 505} = err
        if(!err.message) err.message = 'Oh no! Something went wrong'
        res.status(statusCode).render('error' , {err})
})
// app.use((err , req , res , next) => {
//         res.send("something went wrong")
// })
app.listen(3000 , () => {
        console.log("SERVER IS LISTENING ON PORT 3000")
});