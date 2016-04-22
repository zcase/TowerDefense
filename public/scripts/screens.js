
towerDefense.screens = (function(myScreens) {
    
    function showScreen(id) {
        var screen = 0,
            active = null;
            
        active = document.getElementsByClassName('active');
        for(screen= 0; screen < active.length; screen += 1){
            active[screen].classList.remove('active');
        }
        
        myScreens[id].run();
        
        document.getElementById(id).classList.add('active');
    }
    
    
    function initialize() {
        var screen = null;
        
        for(screen in myScreens) {
            if(myScreens.hasOwnProperty(screen)) {
                myScreens[screen].initialize();
            }
        }
        
        showScreen('mainMenu');
    }
    
    return {
        initialize : initialize,
        showScreen : showScreen,
    };
    
    
}(towerDefense.myScreens));