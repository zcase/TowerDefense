
var score = [{
    score: '0',
}, {
        score: '0',
    }, {
        score: '0',
    }, {
        score: '0',
    }, {
        score: '0',
    }];

    exports.all = function (req, res) {
        console.log('all player scores');
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify(score));
    }

exports.add = function (req, res) {
    console.log('add new person called');
    console.log('Request: ' + JSON.stringify(req.body));

    score.push({
        id: nextId,
        score: req.query.score,
    });
    score.sort(function (a, b) {
        if (a > b) {
            return -1;
        } else if (a < b) {
            return 1;
        }

        return 0;
    });
    if (score.length > 5) {
        score = score.slice(0, 5);
    }

    response.writeHead(200);
    response.end();
};