
towerDefense.myScreens['controlsScreen'] = (function(screens, input, controls) {

    function initialize() {
    
        document.getElementById('controlsBack').addEventListener(
            'click',
            function() {screens.showScreen('mainMenu'); });

    }
    
    
    function displayShortcuts() {
        var myControls = controls.getControls();
        
        var upgradeShortcut = document.getElementById('upgradeShortcut'),
            sellShortcut = document.getElementById('sellShortcut'),
            startShortcut = document.getElementById('startShortcut');
        
        var controlString = '';
        for(var i = 0; i < myControls.upgrade.length; i++ ) {
            
            if(i === myControls.upgrade.length-1) {
                controlString += String.fromCharCode(myControls.upgrade[i]);
                // upgradeShortcut.innerHTML = String.fromCharCode(controls.upgrade[i]);
            } else {
                controlString += String.fromCharCode(myControls.upgrade[i]) + " + ";
                // upgradeShortcut.innerHTML = String.fromCharCode(controls.upgrade[i]) + " ";
            }
        }
        upgradeShortcut.innerHTML = controlString;
        controlString = '';
        
        for(var i = 0; i < myControls.sell.length; i++ ) {
            if(i === myControls.sell.length-1) {
                controlString += String.fromCharCode(myControls.sell[i]);
            } else {
                controlString += String.fromCharCode(myControls.sell[i]) + " + ";
            }
        }
        sellShortcut.innerHTML = controlString;
        controlString = '';
        
        for(var i = 0; i < myControls.start.length; i++ ) {
            if(i === myControls.start.length-1) {
                controlString += String.fromCharCode(myControls.start[i]);
            } else {
                controlString += String.fromCharCode(myControls.start[i]) + " + ";
            }
        }
        startShortcut.innerHTML = controlString;
        controlString = '';
    }
    
    function run() {
        displayShortcuts();
    }
    
    return {
        initialize : initialize,
        run : run,
    };


}(towerDefense.screens, towerDefense.input, towerDefense.controls));