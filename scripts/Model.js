towerDefense.model = (function (components, graphics, input) {
    var gameGrid,
        tower,
        towers = [],
        creep,
        creeps = [],
        score,
        livesRemaining = 10,
        keyboard = input.Keyboard(),
        mouseArray = [],
        mouse = input.Keyboard(),
        mouseCapture = true,
        internalUpdate,
        internalRender;
        towerCount = 0;
        
    function initializeGameGrid() {
        gameGrid = components.Grid(Math.floor(graphics.width() / 40), Math.floor(graphics.height() / 40));
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
        towerCount++;

        var createdTower = components.Tower({
            image : 'images/gun1.png',
            center : {x : 12000, y : 300},
            width : 40,
            height : 40,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
        // mouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                // mouseCapture = false;
                createdTower.isSelected = false;
                createdMouse.deregisterCommand('mousedown');
            }
            else {
                // mouseCapture = true;
                // createdTower.isSelected = true;
            }
        });
        
        // createdMouse.registerCommand('mousedown', createdMouse.mouseDownEffects(mouseCapture, createdTower));
        
        
        createdMouse.registerCommand('mousemove', function(e, elapsedTime) {
        // mouse.registerCommand('mousemove', function(e, elapsedTime) {
            if(createdTower.isSelected) {
                // for(var i = 0; i < towers.length; i++ ) {
                //     if(tower.placed === false){
                //         towers[i].moveTo({x : e.clientX, y : e.clientY });
                //     }
                // }
                createdTower.moveTo({x : e.clientX, y : e.clientY });
            }
        });
        
        // createdMouse.registerCommand('mousemove', createdMouse.mouseMoveEffects(mouseCapture, createdTower,));
        
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    function createLowLevelTower2() {
        var createdTower = components.Tower({
            image : 'images/cannon1.png',
            center : {x : 12000, y : 300},
            width : 40,
            height : 40,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
        // mouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                // mouseCapture = false;
                createdTower.isSelected = false;
                createdMouse.deregisterCommand('mousedown');
            }
            else {
                // mouseCapture = true;
                // createdTower.isSelected = true;
            }
        });
        
        // createdMouse.registerCommand('mousedown', createdMouse.mouseDownEffects(mouseCapture, createdTower));
        
        
        createdMouse.registerCommand('mousemove', function(e, elapsedTime) {
        // mouse.registerCommand('mousemove', function(e, elapsedTime) {
            if(createdTower.isSelected) {
                // for(var i = 0; i < towers.length; i++ ) {
                //     if(tower.placed === false){
                //         towers[i].moveTo({x : e.clientX, y : e.clientY });
                //     }
                // }
                createdTower.moveTo({x : e.clientX, y : e.clientY });
            }
        });
        
        // createdMouse.registerCommand('mousemove', createdMouse.mouseMoveEffects(mouseCapture, createdTower,));
        
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    function createLowLevelTower3() {
        var createdTower = components.Tower({
            image : 'images/tower1.png',
            center : {x : 12000, y : 300},
            width : 40,
            height : 40,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
        // mouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                // mouseCapture = false;
                createdTower.isSelected = false;
                createdMouse.deregisterCommand('mousedown');
            }
            else {
                // mouseCapture = true;
                // createdTower.isSelected = true;
            }
        });
        
        // createdMouse.registerCommand('mousedown', createdMouse.mouseDownEffects(mouseCapture, createdTower));
        
        
        createdMouse.registerCommand('mousemove', function(e, elapsedTime) {
        // mouse.registerCommand('mousemove', function(e, elapsedTime) {
            if(createdTower.isSelected) {
                // for(var i = 0; i < towers.length; i++ ) {
                //     if(tower.placed === false){
                //         towers[i].moveTo({x : e.clientX, y : e.clientY });
                //     }
                // }
                createdTower.moveTo({x : e.clientX, y : e.clientY });
            }
        });
        
        // createdMouse.registerCommand('mousemove', createdMouse.mouseMoveEffects(mouseCapture, createdTower,));
        
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    function createLowLevelTower4() {
        var createdTower = components.Tower({
            image : 'images/missile1.png',
            center : {x : 12000, y : 300},
            width : 40,
            height : 40,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
            towerNum : towerCount,
        });
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                                
                var x = e.clientX / 40;
                var y = e.clientY / 40;
                var xPos = Math.ceil(x);
                var yPos = Math.ceil(y);
                var actX = Math.ceil(e.clientX);
                var actY = Math.ceil(e.clientY);
                console.log("Mouse X: " + xPos);
                console.log("Mouse Y: " + yPos);
                console.log("Act X: " + actX);
                console.log("Act Y: " + actY);
                console.log("Gamegrid[mousex][mousey] = " + gameGrid.layout[xPos][yPos].row);
                
                // This snaps the object to the nearest square to the left
                if(gameGrid.layout[xPos][yPos].taken === false){
                    createdTower.moveTo(({ x: (xPos*40)-20, y : (yPos*40)-20}))
                    gameGrid.layout[xPos][yPos].taken = true;
                    createdTower.render(graphics);
                    createdMouse.deregisterCommand('mousedown');
                    createdTower.isSelected = false;   
                }
                
            }
            else {
                // Do nothing for now...
            }
        });
                
        
        createdMouse.registerCommand('mousemove', function(e, elapsedTime) {
            if(createdTower.isSelected) {
                var x = e.clientX / 40;
                var y = e.clientY / 40;
                var xPos = Math.ceil(x);
                var yPos = Math.ceil(y);
                
                createdTower.moveTo({x : e.clientX, y : e.clientY });
                
                // if(e.clientX <= graphics.width && e.clientX >= 0 && e.clientY <= graphics.height && e.clientY >= 0 ) {
                //     createdTower.inScreen = true;
                // }else {
                //     createdTower.inScreen = false;
                // }
                
                if(gameGrid.layout[xPos][yPos].taken === true){
                    createdTower.rangeColor = 'red';
                } else {
                    createdTower.rangeColor = 'green';
                } 
                
            }
            
            
        });
                
        mouseArray.push(createdMouse);

        
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
        // mouse.update(elapsedTime);
        for(var i = 0; i < mouseArray.length; i++){
            mouseArray[i].update(elapsedTime);
        }
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
       createLowLevelTower1 : createLowLevelTower1,
       createLowLevelTower2 : createLowLevelTower2,
       createLowLevelTower3 : createLowLevelTower3,
       createLowLevelTower4 : createLowLevelTower4,
       processInput : processInput,
       update : update,
       render : render
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input));