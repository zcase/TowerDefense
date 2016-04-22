function addScore(){
    var name = $('#id-playername').val(),
        score = $('#id-playerscore').val();
        
    $.ajax({
        url : 'http://localhost:2000/v1/high-scores?name=' + name + '&score=' + score,
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
            alert('POST failed');
        },
        success : function(data){
            var list = $('#id-highScoresList'),
                value,
                text;
                
            list.empty();
            for (value = 0; value < data.length; value++){
                text = (data[value].name + " - " + data[value].score);
                list.append($('<li>', { text : text }));
            }
        }
    });
}