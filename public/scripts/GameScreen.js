
towerDefense.myScreens['gameScreen'] = (function(gameModel, screens, graphics, input, sound) {

    var stopGame = false,
        mouseCapture = false,
        mouse = input.Mouse(),
        lastTime = performance.now(),
        backgroundSound;
      var  gameScreenkeyboard = input.Keyboard();

    function initialize() {
    
        gameScreenkeyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, function() {
            stopGame = true;
            screens.showScreen('mainMenu');
        });
        
        document.getElementById('gameBack').addEventListener(
            'click',
            function() {
                stopGame = true;
                screens.showScreen('mainMenu');
        });
    }
    
    
    
    // Process Input
    function processInput(elapsedTime) {
        gameScreenkeyboard.update(elapsedTime);
        gameModel.processInputGeneral(elapsedTime);
        gameModel.processInput(elapsedTime);
        // gameModel.processInputGeneral(elapsedTime);
    }
    
    
    // Update the game model
    function update(elapsedTime) {
        gameModel.update(elapsedTime);
        stopGame = gameModel.getGameOver();
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