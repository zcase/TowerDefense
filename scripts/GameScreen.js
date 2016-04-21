
towerDefense.myScreens['gameScreen'] = (function(gameModel, screens, graphics, input, sound) {

    var stopGame = false,
        mouseCapture = false,
        mouse = input.Mouse(),
        lastTime = performance.now(),
        backgroundSound;
        // keyboard = input.Keyboard(),

    function initialize() {
    
        // keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            
        //     stopGame = true;
            
        //     screens.showScreen('mainMenu');
        // });
        
        document.getElementById('gameBack').addEventListener(
            'click',
            function() {screens.showScreen('mainMenu'); });
    }
    
    
    
    // Process Input
    function processInput(elapsedTime) {
        // keyboard.update(elapsedTime);
        gameModel.processInputGeneral(elapsedTime);
        gameModel.processInput(elapsedTime);
        // gameModel.processInputGeneral(elapsedTime);
    }
    
    
    // Update the game model
    function update(elapsedTime) {
        gameModel.update(elapsedTime);

    }
    
    
    // Render the game model
    function render(elapsedTime) {
        graphics.clear();
        gameModel.render(elapsedTime);
    }
    
    function gameLoop(time) {
        var elapsedTime = time - lastTime;
        
        processInput(elapsedTime);
        update(elapsedTime);
        
        lastTime = time;
        
        render(elapsedTime);
        
        if(!stopGame) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    
    function run() {
        gameModel.initialize();
        lastTime = performance.now();
        
        stopGame = false;
        
        backgroundSound = sound.sound('sounds/determination.mp3');
        backgroundSound.play();
        
        requestAnimationFrame(gameLoop);
        
    }
    
    return {
        initialize : initialize,
        run : run,
    };


}(towerDefense.model, towerDefense.screens, towerDefense.graphics, towerDefense.input, towerDefense.sound));