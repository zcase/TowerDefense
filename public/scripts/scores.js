var score = [{
        id : 0,
        name : 'someone1',
        score : '500',
    }, {
        id : 1,
        name : 'someone2',
        score : '450',
    }, {
        id : 2,
        name : 'someone3',
        score : '400',
    }],
    nextId = 3;

exports.all = function(req, res){
    console.log('all player scores');
    res.writeHead(200, {'content-type' : 'application/json'});
    res.end(JSON.stringify(score));
}

exports.add = function(req, res) {
	console.log('add new person called');
	console.log('Name: ' + request.query.name);

	var now = new Date();
	score.push( {
		id : nextId,
		name : request.query.name,
		score : getScore, 
	});
	nextId++;

	response.writeHead(200);
	response.end();
};