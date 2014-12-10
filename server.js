var express = require("express");
var path = require("path");
var jade = require("jade");
var cookieParser = require("cookie-parser");
var bodyparser = require('body-parser');
var validator = require('express-validator');
var expressSanitizer = require('express-sanitizer');
var app = express();
var passport = require('passport');
var util = require('util');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var session = require('express-session');
var methodOverride = require('method-override');
var nodemailer = require('nodemailer');


var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/bodybuddy';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
    db = databaseConnection;
});

var workouts = require("./js/workouts.js");

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
app.locals.pretty = true;
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

app.get('/', function(req, res) {
    res.sendFile(__views + '/index.html');
});

app.get('/signup', ensureAuthenticated, function(req, res) {
	res.redirect('/editprofile');
});

app.get('/editprofile', ensureAuthenticated, function(req, res) {
    res.sendFile(__views + '/editprofile.html');
    //res.render(__views + '/editprofile.html');
});

app.post('/editprofile', ensureAuthenticated, function(req, res) {
    function sanitize(data){
       return data;//req.sanitize(req.param('data'));
    }
    function storeProfile(profile) {
        db.collection('profiles', function(err, collection) {
            collection.remove({'account':profile.account}, function(err, c) {});
            collection.insert(profile, function(err, c) {
                db.collection('history', function(errr, collection) {
                    var history = {};
                    history['account'] = profile.account;
                    var firstPoint = {};
                    firstPoint['time'] = new Date().getTime();
                    firstPoint['avg'] = workouts.getHeuristic(profile.strength);
                    history['history'] = [];
                    history['history'].push(firstPoint);
                    collection.insert(history, function(errrr, c) {});
                });
            });
        });
    }
    var profile = {};
    profile.firstname = sanitize(req.body.firstname);
    profile.lastname = sanitize(req.body.lastname);
    req.assert('emailaddr', 'Invalid email address').isEmail();
    profile.emailaddr = sanitize(req.body.email);
    profile.gender = sanitize(req.body.gender);
    profile.birthday = sanitize(req.body.birthday);
    profile.goal = sanitize(req.body.goal);
    profile.height = parseInt(sanitize(req.body.height));
    profile.weight = parseInt(sanitize(req.body.weight));
    profile.strength = workouts.getInitStrength(profile);
    profile.position = 0;
    profile.account = req.user.id;

    if (!(profile.firstname && profile.lastname && profile.emailaddr &&
profile.gender && profile.birthday && profile.height && profile.weight && 
profile.goal)) {
        res.redirect('/editprofile');
    }
    else {
        storeProfile(profile);
        res.redirect('/profile');
    }
});



function motivationalMessage() {
    var num = Math.floor(Math.random() * 9);    
    switch (num) {
        case 0:
            return "Congrats on getting this far! You've come a long way. Push yourself harder, and the results will come. As Ming Chow once proclaimed... 'I wish I took Comp 40.' Ming pushes himself every day.";
        case 1:
            return "Don’t quit. You’ve been working hard. Keep your goal in mind, and believe in yourself. It’s amazing how much a positive mindset can affect your life. Ming Chow, a famous Computer Science professor, once proclaimed “I think this assignments 2, 3 and 4 are some of the best assignments I’ve ever come up with.” Channel Ming’s positivity in your life, and in your workout routine.";
        case 2:
            return "Great job! Remember that there is more to fitness than your workout routine. In addition to completing your workouts, try to get enough sleep, eat well, and stay hydrated. The time between workouts is incredibly important.";
        case 3:
            return "As Ming Chow has taught us all, always be alert and aware of your surroundings. Beware of stumbling into one of the four chans."
        case 4:
            return "I once went to a conference on the Mongo DB. There are many security flaws in the system to take account of."
        case 5:
            return "Force is meaningless without skill."
        case 6:
            return "This place sucked until I came here."
        case 7:
            return "As Ming Chow has said repeatedly, 'I don't know. Let's find out.'"
        case 8:
            return "''You miss 100% of the shots you don't take' - Wayne Gretsky' - Michael Scott"
    }
}

// Profile example:
// {'account':123456789,
//  'strength':{'Squat':150,'Bench':150,'Row:150...},
//  'position':3}
/*

// History example:
// {'account':123456789,
//  'history':[{'time':10000000,'avg':150},{'time':10005000,'avg':160}]}
function getHistory(identifier) {
    var pizza;
    return db.collection('history', function(er, collection) {
        collection.find({account: identifier}).toArray(function(err, cursor) {
            pizza = cursor[0];
        });
    });
    return pizza;
}
*/

app.get('/profile', ensureAuthenticated, function(req, res) {
    var identifier = req.user.id;
    db.collection('profiles', function(er, collection) {
        collection.find({'account':identifier}).toArray(function(err, profiles) {
            var profile = profiles[0];
            db.collection('history', function(errr, collection) {
                collection.find({'account':identifier}).toArray(function(errrr, histories) {
                    if (!profile) {
                        res.redirect('/editprofile');
                    } else {
                        var history = histories[0];
                        if (history.history[0]) {
                            var timeMin = history.history[0].time;
                            history.history = history.history.map(function(point) {
                                return {'time':(point.time - timeMin),'avg':point.avg};
                            });
                        }
                        var workout = workouts.getWorkout(profile);
                        var feedback = motivationalMessage();
                        var now = new Date();
                        var weekday = new Array(7);
                        weekday[0] = "Sunday";
                        weekday[1] = "Monday";
                        weekday[2] = "Tuesday";
                        weekday[3] = "Wednesday";
                        weekday[4] = "Thursday";
                        weekday[5] = "Friday";
                        weekday[6] = "Saturday";
                        var month = new Array(12);
                        month[0] = "January";
                        month[1] = "February";
                        month[2] = "March";
                        month[3] = "April";
                        month[4] = "May";
                        month[5] = "June";
                        month[6] = "July";
                        month[7] = "August";
                        month[8] = "September";
                        month[9] = "October";
                        month[10] = "November";
                        month[11] = "December";
                        console.log(JSON.stringify(workout));
                        res.render(__views + '/profile.jade',
                            {'workouts': workout,
                            'date': (weekday[now.getDay()] + ', ' + month[now.getMonth()] + ' ' + now.getDate() + ' ' + now.getFullYear()),
                            'feedback': feedback,
                            'history': JSON.stringify(history)
                        });
                    }
                });
            });
        });
    });
});

app.post('/profile', ensureAuthenticated, function(req, res) {
    var success = req.body.success;
    var identifier = req.user.id;
    if (success != 'yes' && success != 'no') {
        res.send(400);
        return;
    }
    db.collection('profiles', function(er, collection) {
        collection.find({'account':identifier}).toArray(function(err, profiles) {
            var profile = profiles[0];
            for (var key in profile.strength) {
                profile.strength[key] *= (success == 'yes') ? 1.1 : .9;
            }
            profile.position = (profile.position + 1) % workouts.getGoalLength(profile.goal);
            collection.remove({'account':profile.account}, function(err, c) {});
            collection.insert(profile, function(err, c) {
                db.collection('history', function(errr, collection) {
                    collection.find({'account':identifier}).toArray(function(errrr, histories) {
                        var history = histories[0];
                        history.history.push({'time':(new Date().getTime()), 'avg':workouts.getHeuristic(profile.strength)});
                        collection.remove({'account':profile.account}, function(err, c) {});
                        collection.insert(history, function(errrrr, collection) {
                            var responseVal = {'history':history.history,'workout':workouts.getWorkout(profile)};
                            res.send(JSON.stringify(responseVal));
                            // create reusable transporter object using SMTP transport
                            sendEmail(profile);

                        });
                    });
                });
            });
        });
    });
});
function sendEmail(profile){
    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'bodybuddy.reminders@gmail.com',
        pass: 'mingchow'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'BodyBuddy  <bodybuddy.reminders@gmail.com>', // sender address
    to: profile.email, // list of receivers
    subject: 'Your Next Workout...', // Subject line
    text: 'Hello '+profile.firstname+ ","
    html: '<b> Hello! </b>' // plaintext body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});
}

app.get('/home', function(req, res){
	res.sendFile(__views + '/home.html');
});

app.get('/login', function(req, res){
    res.redirect('/auth/facebook');
});

app.get('/about', function(req, res){
    res.sendFile(__views + '/about.html');
});

app.get('/auth/facebook', passport.authenticate('facebook'),
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
