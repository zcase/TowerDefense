
towerDefense.myScreens['mainMenu'] = (function(screens) {

    function initialize() {
    
        document.getElementById('newGame').addEventListener(
            'click',
            function() {screens.showScreen('gameScreen'); });
        
        document.getElementById('highScores').addEventListener(
            'click',
            function() {screens.showScreen('highScoresScreen'); });
            
        document.getElementById('controls').addEventListener(
            'click',
            function() {screens.showScreen('controlsScreen'); });
            
            
        document.getElementById('about').addEventListener(
            'click',
            function() {screens.showScreen('aboutScreen'); });
    }
    
    
    function run() {
        
    }
    
    return {
        initialize : initialize,
        run : run,
    };


}(towerDefense.screens));