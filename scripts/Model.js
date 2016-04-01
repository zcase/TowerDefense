towerDefense.model = (function (components, graphics, input) {
    var gameGrid,
        tower,
        towers = [],
        creep,
        creeps = [],
        score,
        livesRemaining = 10,
        keyboard = input.Keyboard(),
        mouse = input.Mouse(),
        mouseCapture = true,
        internalUpdate,
        internalRender;
        
    function initializeGameGrid() {
        gameGrid = components.Grid(graphics.width(), graphics.height());
    } // End initializeGameGrid
    
    
    function initialize() {
        initializeGameGrid();
        
        score = 0;
        livesRemaining = 10;
        
        // Potentially set these to something else if there is a count down screen or something
        internalUpdate = updatePlaying;
        internalRender = renderPlaying;
        
    } // End initialize
    
        
    function createLowLevelTower() {
        var createdTower = components.Tower({
            image : 'images/USU-Logo.png',
            center : {x : 900, y : 300},
            width : 40,
            height : 40,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        towers.push(createdTower);
        
        
        mouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(mouseCapture === true) {
                mouseCapture = false;
                createdTower.isSelected = false;
            }
            else {
                mouseCapture = true;
                createdTower.isSelected = true;
            }
        });
        
        mouse.registerCommand('mousemove', function(e, elapsedTime) {
            if(mouseCapture || createdTower.isSelected == true) {
                // for(var i = 0; i < towers.length; i++ ) {
                //     if(tower.placed === false){
                //         towers[i].moveTo({x : e.clientX, y : e.clientY });
                //     }
                // }
                createdTower.moveTo({x : e.clientX, y : e.clientY });
            }
        });

        
        // return createdTower;
    } // End createLowLevelTower
    
    function updatePlaying(elapsedTime) {
        
        // Update each tower
        for(var i = 0; i < towers.length; i++) {
            // towers[i].update(elapsedTime); // need to create up date function to change rotation of tower pic based on creeps
        }
        
        // Update each creep
        for(var i = 0; i < creeps.length; i++) {
            creeps[i].update(elapsedTime); // need to create update fuction to update creep movement, life, sprite postion
        }
        
        //update munitions
        
        // Create update for score based on creeps killed/ creeps pass to other side
    }
    
    function renderPlaying() {
        gameGrid.render(graphics);
        
        for(var i = 0; i < towers.length; i++) {
            towers[i].render(graphics);
        }
        
        for(var i = 0; i < creeps.length; i++) {
            // creeps[i].render(graphics);
        }
        
        // render munitions
    }
    
    
    function processInput(elapsedTime) {
        keyboard.update(elapsedTime);
        mouse.update(elapsedTime);
    } // End processInput
    
    function update(elapsedTime) {
        internalUpdate(elapsedTime);
    } // End update
    
    function render() {
        internalRender();
        
        if(towers.length > 0 ) {
            for(var i = 0; i < towers.length; i++) {
                towers[i].render(graphics);
            }
        }
        
    } // End render
    
        
   return {
       initialize : initialize,
       createLowLevelTower : createLowLevelTower,
       processInput : processInput,
       update : update,
       render : render
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input));