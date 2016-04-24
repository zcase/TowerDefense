var myIndex = (function() {
function addScore(score){
        
    $.ajax({
        url : 'http://localhost:2000/v1/high-scores&score=' + score,
        type : 'POST',
        error : function(){
            alert('POST failed');
        },
        success : function(){
            showScores();
        }
    });
}

function showScores(){
    $.ajax({
        url : 'http://localhost:2000/v1/high-scores',
        cache : false,
        type : 'GET',
        error : function(){
            alert('Get failed');
        },
        success : function(data){
            var list = $('#id-highScoresList'),
                value,
                text;
                
            list.empty();
            for (value = 0; value < data.length; value++){
                text = (data[value].score);
                list.append($('<li>', { text : text }));
            }
        }
    });
}

return {
    addScore : addScore,
    showScores : showScores,
}

}());