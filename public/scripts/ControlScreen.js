
towerDefense.myScreens['controlsScreen'] = (function(screens, input) {

    function initialize() {
    
        document.getElementById('controlsBack').addEventListener(
            'click',
            function() {screens.showScreen('mainMenu'); });

    }
    
    
    function displayShortcuts() {
        var controls = towerDefense.controls.getControls();
        
        var upgradeShortcut = document.getElementById('upgradeShortcut'),
            sellShortcut = document.getElementById('sellShortcut'),
            startShortcut = document.getElementById('startShortcut');
        
        for(var i = 0; i < controls.upgrade.length; i++ ) {
            if(controls.upgrade.length === 1) {
                upgradeShortcut.innerHTML = String.fromCharCode(controls.upgrade[i]);
            } else {
                upgradeShortcut.innerHTML = String.fromCharCode(controls.upgrade[i]) + " ";
            }
        }
        
        for(var i = 0; i < controls.sell.length; i++ ) {
            if(controls.sell.length === 1) {
                sellShortcut.innerHTML = String.fromCharCode(controls.sell[i]);
            } else {
                sellShortcut.innerHTML = String.fromCharCode(controls.sell[i]) + " ";
            }
        }
        
        for(var i = 0; i < controls.start.length; i++ ) {
            if(controls.start.length === 1) {
                startShortcut.innerHTML = String.fromCharCode(controls.start[i]);
            } else {
                startShortcut.innerHTML = String.fromCharCode(controls.start[i]) + " ";
            }
        }
    }
    
    function run() {
        displayShortcuts();
    }
    
    return {
        initialize : initialize,
        run : run,
    };


}(towerDefense.screens, towerDefense.input));