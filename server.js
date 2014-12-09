var express = require("express");
var path = require("path");
var jade = require("jade");
var cookieParser = require("cookie-parser");
var bodyparser = require('body-parser');
var validator = require('validator');
var app = express();
var passport = require('passport')
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy
var logger = require('morgan')
var session = require('express-session')
var methodOverride = require('method-override');

var FACEBOOK_APP_ID = '1591881341039856'
var FACEBOOK_APP_SECRET = "4be3e009e43e201b451ef4dc0df19cce";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://bodybuddy.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Facebook profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Facebook account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));


var __static = path.resolve('static');
var __views = path.resolve('views');

// configure Express
app.set('view engine', 'jade');
app.use(logger('combined'));
app.use(cookieParser());
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat' }));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));
app.use('/js', express.static(__static + '/js'));


var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/bodybuddy';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
    db = databaseConnection;
});

var workouts = require("./js/workouts.js");

app.get('/', function(req, res) {
    res.sendFile(__views + '/index.html'); 
});

app.get('/signup', ensureAuthenticated, function(req, res) {
	res.sendFile(__views + '/signup.html');
});

app.get('/editprofile', ensureAuthenticated, function(req, res) {
    res.sendFile(__views + '/editprofile.html');
    //res.render(__views + '/editprofile.html');
});

app.post('/editprofile', ensureAuthenticated, function(req, res) {
    var firstName = validator.sanitize(request.body.firstName).xss();
    var lastName = validator.sanitize(request.body.lastName).xss();
    var emailAddr = vaidator.sanitize(request.body.emailAddr).xss();
    var gender = validator.sanitize(request.body.gender).xss();
    // ...
});

function motivationalMessage() {
    var num = Math.floor(Math.random() * 3);    
    switch (num) {
        case 0:
            return "Do not fear the unknown.";
        case 1:
            return "I will show you the path.";
        case 2:
            return "Your skills are inferior!";
    }
}

// Profile example:
// {'account':123456789,
//  'strength':{'Squat':150,'Bench':150,'Row:150...},
//  'position':3}
function getProfile(indentifier) {
    db.collection('profiles', function(er, collection) {
        collection.find({'account':identifier}).toArray(function(err, profiles) {
            return profiles[0];
        });
    });
}

// History example:
// {'account':123456789,
//  'history':[{'time':10000000,'avg':150},{'time':10005000,'avg':160}]}
function getHistory(identifier) {
    db.collection('history', function(er, collection) {
        collection.find({'account':identifier}).toArray(function(err, histories) {
            return histories[0].history;
        });
    });
}

app.get('/profile', ensureAuthenticated, function(req, res){
    var identifier = req.user;
    var profile = getProfile(identifier);
    var history = {'account':1,'history':[{'time':0,'avg':150},{'time':1,'avg':200}]};//getHistory(identifier);
    if (!profile) {
        res.redirect('/editprofile');
    }
    var workout = /*[{'title':'testtitle1','intensity':'testintensity1','description':'testdescription1'},{'title':'testtitle2','intensity':'testintensity2','description':'testdescription2'}] */workouts.getWorkout(profile);
    var feedback = motivationalMessage();
    res.render(__views + '/profile.jade',
        {'workouts': workout,
         'date': new Date(),
         'feedback': feedback,
         'history': JSON.stringify(history)
    });

});

app.get('/home', function(req, res){
	res.sendFile(__views + '/home.html');
});

app.get('/login', function(req, res){
	//res.sendFile(__views + '/login.html');
    res.redirect('/auth/facebook');
});

app.get('/about', function(req, res){
    res.sendFile(__views + '/about.html');
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // The request will be redirected to Facebook for authentication, so this
    // function will not be called.
});

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(process.env.PORT || 3000);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}
