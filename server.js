var express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express();
    
app.set('port', 2000);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/scripts'));

app.get('/', function(req, res){
    res.sendFile('index.html');
});

http.createServer(app).listen(app.get('port'),function(){
    console.log("Tower Defense server listening on port " + app.get('port'));
});