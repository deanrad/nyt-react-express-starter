const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const OAUTH_CLIENT_ID="141992064594-7jj14dutsuv1lof45dq7luhhqkummha9.apps.googleusercontent.com"
const OAUTH_SECRET="ZVqPcZK1q9rqbjIyuSmK1mkv"

// Configure body parser for AJAX requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Set up promises with mongoose
mongoose.Promise = global.Promise;
// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/nytreact",
  {
    useMongoClient: true
  }
);

/** DB */
const db = require('./models')
const { Article } = db
/** END DB */

/* Begin Auth */
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Use the GitHubStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and GitHub
//   profile), and invoke a callback with a user object.
const callbackURL =
  process.env.NODE_ENV === "production"
    ? "https://fierce-hamlet-67131.herokuapp.com/auth/google/callback"
    : "http://localhost:3001/auth/google/callback";

const OAUTH_SCOPES = ['profile', 'email']
passport.use(
  new GoogleStrategy(
    {
      clientID: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_SECRET,
      callbackURL
    },
    function(accessToken, refreshToken, profile, done) {

      console.log('Yay Google Profile', profile);
      done(null, profile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: OAUTH_SCOPES }),
  function(req, res) {
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    console.log("req.user is ", req.user);
    res.redirect(
      process.env.NODE_ENV === "production" ? "/" : "//localhost:3000/"
    );
  }
);
/* End Auth */

/** routes */
app.post("/api/saved", (req, res) => {
  // get the posted object
  var article = req.body

  // call Article.create
  // then return some json (success|error)
  Article.create(article)
  .then(() => {
    res.json(article)
  })
  .catch((err) => {
    res.json(err)
  })
})

app.get('/api/saved', (req, res) => {
  Article.find({}).then(articles => res.json(articles))
})
/** end routes */

// Send every request to the React app
// Define any API routes before this runs
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, function() {
  console.log(`🌎 ==> Server now on port ${PORT}!`);
});
