var express = require("express");
var app = express();

set NODE_PATH=\home\ryan\Downloads\node_modules;%NODE_PATH%

app.get('/', function(req, res){
    res.send('hello world'); 
});

// Only works on 3000 regardless of what I set environment port to or how I set [value] in app.set('port', [value]).
app.listen(3000);