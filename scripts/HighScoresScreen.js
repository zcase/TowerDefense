
towerDefense.myScreens['highScoresScreen'] = (function(screens) {

    function initialize() {
    
        document.getElementById('highScoresBack').addEventListener(
            'click',
            function() {screens.showScreen('mainMenu'); });

    }
    
    
    function run() {
        
    }
    
    return {
        initialize : initialize,
        run : run,
    };


}(towerDefense.screens));