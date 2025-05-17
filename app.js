if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDBURL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.secret,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("SESSION STORE ERROR IN MONGO", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};



async function main() {
    await mongoose.connect(dbUrl);
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

// This middleware must be registered early and synchronously:
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
   
    next();
});
app.use((req, res, next) => {
  res.locals.currUser = req.user; // assuming you use passport or similar and have req.user set when logged in
  next();
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.use((req, res, next) => {
    const err = new ExpressError("Page Not Found", 404);
    next(err);
});

app.use((err, req, res, next) => {
    const { statusCode = 400 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error.ejs", { err });
});

main()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(8082, () => {
            console.log("Server is running on port 8082");
        });
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });
