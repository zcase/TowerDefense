
var scores = [{
        score: 0,
    }, {
        score: 0,
    }, {
        score: 0,
    }, {
        score: 0,
    }, {
        score: 0,
    }];
    
// var scores = [];

exports.all = function (req, res) {
        console.log('all player scores');
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(scores));
    }

exports.add = function (req, res) {
    console.log('add new scores called');
    console.log('Score: ' + req.query.score);
    // console.log('Request: ' + JSON.stringify(req.body));
    
    scores.push({
        score: req.query.score,
    });

    response.writeHead(200);
    response.end();
};