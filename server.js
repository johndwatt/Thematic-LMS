// === External Modules ===
const express = require("express");

const methodOverride = require("method-override");

const session = require("express-session");

const MongoStore = require("connect-mongo");

const multer = require("multer");

const upload = multer({dest: "uploads/"});

require("dotenv").config();

// === Internal Modules ===
const controllers = require("./controllers/index");

// === Instanced Modules ===
const app = express();

// === Configuration===
const PORT = process.env.PORT || 4000;

/* SECTION App Config */
app.set("view engine", "ejs");

// === Middleware ===

app.use(
    session({
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/lms" }),
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2,
      },
    })
  );

app.use((req, res, next) => {
    res.locals.user = req.session.currentUser;
    return next();
}); 


app.use(express.static("public"));

// multer calls for file 
app.use(upload.single("file"));

// NOTE allows body data for all routes
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.use(require("./utils/logger"));

const authRequired = (req,res,next) => {
  if(!req.session.currentUser){
    return res.redirect("/login");
  }
  next();
}

app.use("/", controllers.auth);

app.use("/assignments", authRequired, controllers.assignment);

app.use("/submissions", authRequired, controllers.submission);

// === Routes ===
app.get("/", (req, res) => {
    res.redirect("/assignments");
});

// 404
app.get("/*", (req, res) => {
    const context = {
        error: req.error,
    };
    res.render("404", context);
});

// === Bind Server ===
app.listen(PORT, () => {
    console.log(`Server is live on port ${PORT}!`);
});