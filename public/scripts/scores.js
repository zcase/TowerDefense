
var score = [{
        id : 0,
        score : '0',
    }, {
        id : 1,
        score : '0',
    }, {
        id : 2,
        score : '0',
    }],
    nextId = 3;

exports.all = function(req, res){
    console.log('all player scores');
    res.writeHead(200, {'content-type' : 'application/json'});
    res.end(JSON.stringify(score));
}

exports.add = function(req, res) {
	console.log('add new person called');
	console.log('Request: ' + JSON.stringify(req.body));

	score.push( {
		id : nextId,
		name : request.query.name,
		score : getScore, 
	});
	nextId++;

	response.writeHead(200);
	response.end();
};