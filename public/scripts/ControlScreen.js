
towerDefense.myScreens['controlsScreen'] = (function(screens) {

    function initialize() {
    
        document.getElementById('controlsBack').addEventListener(
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