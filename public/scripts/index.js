var myIndex = (function () {
    
    function addScore(score) {
        var num = window.parseInt(score,10);
        $.ajax({
            url: 'http://localhost:2000/v1/scores?score=' + num,
            type: 'POST',
            error: function () {
                alert('POST failed');
            },
            success: function () {
                showScores();
            }
        });
    }

    function showScores() {

        $.ajax({
            url: 'http://localhost:2000/v1/scores',
            cache: false,
            type: 'GET',
            error: function () {
                alert('Get failed');
            },
            success: function (data) {
                var list = $('#id-highScoresList'),
                    value,
                    text,
                    scores = [];

                list.empty();
                for (var i = 0; i < data.length; i++) {
				scores.push(parseInt(data[i].score,10));
			}
				
			scores.sort(function (a, b) {
				if (a > b) {
					return -1;
				}
				else if (a < b) {
					return 1;
				}
				else {
					return 0;
				}
			});
			
			if (scores.length >= 5) {
				scores = scores.slice(0, 5);
			}

			for (value = 0; value < scores.length; value++) {
				text = (scores[value]);
				list.append($('<li>', { text: text }));
			}
            scores.length = 0;
            }
        });
    }

    return {
        addScore: addScore,
        showScores: showScores,
    }

} ());