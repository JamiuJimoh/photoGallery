// require("dotenv").config();
const express        = require("express")
const app            = express()
const bodyParser     = require("body-parser")
const mongoose       = require("mongoose")
const passport       = require("passport")
const cookieParser   = require("cookie-parser")
const LocalStrategy  = require("passport-local")
const Photo          = require("./models/photo")
const User           = require("./models/user")
const session        = require("express-session")
const methodOverride = require("method-override")

const photoRoutes     = require("./routes/photos")
const indexRoutes    = require("./routes/index")

const { handleError } = require('./middleware');

mongoose.connect("mongodb://localhost/phogal", {
    useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
  });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(cookieParser('secret'));

app.use(require("express-session")({
    secret: "I am really short",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/photos", photoRoutes);
app.use(handleError);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});



// app.listen(3000 || process.env.PORT, process.env.IP, function(){
//    console.log("The YelpCamp Server Has Started!");
// });
