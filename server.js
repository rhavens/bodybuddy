var express = require("express");
var path = require("path");
var jade = require("jade");
var cookieParser = require("cookie-parser");
var bodyparser = require('body-parser');
var validator = require('express-validator');
var expressSanitizer = require('express-sanitizer');
var app = express();
var passport = require('passport')
var util = require('util')
var FacebookStrategy = require('passport-facebook').Strategy
var logger = require('morgan')
var session = require('express-session')
var methodOverride = require('method-override');

var FACEBOOK_APP_ID = '392824514208595'
var FACEBOOK_APP_SECRET = "a208eb3e5b07e78376fa25df0842b7cb";

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
app.use(validator());
app.use(expressSanitizer());

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
    function sanitize(data){
       return data;//req.sanitize(req.param('data'));
    }
    function storeProfile(profileToStore) {
        db.collection('profiles', function(er, collection) {
            collection.insert(profileToStore, function(err) {
                if (err) {
                    res.redirect('/editprofile');
                } else {
                res.redirect('/profile');
                }
            });
        });
    }
    var profile = {};
    profile.firstname = sanitize(req.body.firstname);
    profile.lastname = sanitize(req.body.lastname);
    req.assert('emailaddr', 'Invalid email address').isEmail();
    profile.email = sanitize(req.body.email);
    profile.gender = sanitize(req.body.gender);
    profile.birthday = sanitize(req.body.birthday);
    profile.goal = sanitize(req.body.goal);
    profile.height = parseInt(sanitize(req.body.height));
    profile.weight = parseInt(sanitize(req.body.weight));
    profile.position = 0;
    profile.account = req.user.id;

    if (!(profile.firstName && profile.lastName && profile.emailAddr &&
            profile.gender && profile.birthday && profile.height && profile.weight)) {
        res.redirect('/editprofile');
    }
    storeProfile(profile);
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
function getProfile(identifier) {
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
            if (histories[0]) {
                // the actual history
                return histories[0].history;
            }
            // undefined
            return histories[0];
        });
    });
}

app.get('/profile', ensureAuthenticated, function(req, res){
    var identifier = req.user.id;
    var profile = getProfile(identifier);
    var history = getHistory(identifier);/*{'account':1,'history':[{'time':0,'avg':150},{'time':1,'avg':200}]};*/
    // debugging
    res.send(JSON.stringify(profile));
    return;
    if (!profile) {
        res.redirect('/editprofile');
    }
    var workout = workouts.getWorkout(profile);/*[{'title':'testtitle1','intensity':'testintensity1','description':'testdescription1'},{'title':'testtitle2','intensity':'testintensity2','description':'testdescription2'}] */
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
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/profile');
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
