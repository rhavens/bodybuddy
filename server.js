var express = require("express");
var path = require("path");
var jade = require("jade");
var cookieparser = require("cookieparser");
var bodyparser = require('body-parser');
var validator = require('validator');
var app = express();

var __static = path.resolve('static');
var __views = path.resolve('views');

var mongoUri = process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/bodybuddy';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
    db = databaseConnection;
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

app.use('/img', express.static(__static + '/img'));
app.use('/css', express.static(__static + '/css'));
app.use('/js', express.static(__static + '/js'));

var workouts = require("./js/workouts.js");

app.get('/', function(req, res){
    res.sendFile(__views + '/index.html'); 
});

app.get('/signup', function(req, res){
	res.sendFile(__views + '/signup.html');
});

app.get('/editprofile', function(req, res){
    res.sendFile(__views + '/editprofile.html');
    //res.render(__views + '/editprofile.html');
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

app.get('/profile', function(req, res){
    var identifier = 'testprofile';
    var profile = undefined;//getProfile(identifier);
    var history = {'account':1,'history':[{'time':0,'avg':150},{'time':1,'avg':200}]};//getHistory(identifier);
/*    if (history) {
        history = history.history.map(function(point) {
            return [point.time, point.avg];
        });
    }*/
/*    if (!profile) {
        res.redirect('/login');
    }*/
    var workout = [{'title':'testtitle1','intensity':'testintensity1','description':'testdescription1'},{'title':'testtitle2','intensity':'testintensity2','description':'testdescription2'}]//workouts.getWorkout(profile);
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
	res.sendFile(__views + '/login.html');
});

app.get('/about', function(req, res){
    res.sendFile(__views + '/about.html');
});

app.listen(3000);
