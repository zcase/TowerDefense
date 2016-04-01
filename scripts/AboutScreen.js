
towerDefense.myScreens['aboutScreen'] = (function(screens) {

    function initialize() {
    
        document.getElementById('aboutBack').addEventListener(
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