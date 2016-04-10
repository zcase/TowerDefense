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
        internalRender,
        towerCount = 0,
        creepStartingPostitions = [{x : 0, y : 310}, {x: 0, y : 330}, {x: 0 , y: 270}];
    var count = 0;

        
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
    
    // Creates the gun tower
    function createLowLevelTower1() {
        towerCount++;

        var createdTower = components.Tower({
            image : 'images/gun1.png',
            center : {x : 12000, y : 300},
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                                
                var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                var actX = Math.floor(e.clientX);
                var actY = Math.floor(e.clientY);
                console.log("Grid X: " + xPos);
                console.log("Grid Y: " + yPos);
                console.log("Mouse X: " + actX);
                console.log("Mouse Y: " + actY);
                console.log("Gamegrid[mousex][mousey] = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col);
                
                // This snaps the object to the nearest square to the left
                if(gameGrid.layout[xPos][yPos].taken === false){
                    // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
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
                var x = (e.clientX / 20) - 3;
                var y = (e.clientY / 20) - 3;
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                
                console.log("MovingMouseX = " + xPos);
                console.log("MovingMouseY = " + yPos);
                console.log('\n');
                
                if(e.clientX >=0 && e.clientX <= 850 && e.clientY >= 0 && e.clientY <= 650) {
                    createdTower.moveTo({x : xPos*20 + 10, y : yPos*20 + 10   });
                    createdTower.inCanvas = true;
                }else {
                    createdTower.inCanvas = false;
                }
                
                // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                // createdTower.moveTo({x : e.clientX, y : e.clientY });

                if(createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true){
                    createdTower.positionColor = 'red'
                } else {
                    createdTower.positionColor = 'green';
                } 
            }
        });
        
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    
    // Creates the cannon tower
    function createLowLevelTower2() {
        var createdTower = components.Tower({
            image : 'images/cannon1.png',
            center : {x : 12000, y : 300},
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        createdTower.strength = 20;
        createdTower.attackDistance = createdTower.width * 3;
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                                
                var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                var actX = Math.floor(e.clientX);
                var actY = Math.floor(e.clientY);
                console.log("Grid X: " + xPos);
                console.log("Grid Y: " + yPos);
                console.log("Mouse X: " + actX);
                console.log("Mouse Y: " + actY);
                console.log("Gamegrid[mousex][mousey] = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col);
                
                // This snaps the object to the nearest square to the left
                if(gameGrid.layout[xPos][yPos].taken === false){
                    // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
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
                var x = (e.clientX / 20) - 3;
                var y = (e.clientY / 20) - 3;
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                
                console.log("MovingMouseX = " + xPos);
                console.log("MovingMouseY = " + yPos);
                console.log('\n');
                
                if(e.clientX >=0 && e.clientX <= 850 && e.clientY >= 0 && e.clientY <= 650) {
                    createdTower.moveTo({x : xPos*20 + 10, y : yPos*20 + 10   });
                    createdTower.inCanvas = true;
                }else {
                    createdTower.inCanvas = false;
                }
                
                // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                // createdTower.moveTo({x : e.clientX, y : e.clientY });

                if(createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true){
                    createdTower.positionColor = 'red'
                } else {
                    createdTower.positionColor = 'green';
                } 
            }
        });
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    
    // Creates tower which is a mixed weapon
    function createLowLevelTower3() {
        var createdTower = components.Tower({
            image : 'images/tower1.png',
            center : {x : 12000, y : 300},
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
        });
        
        createdTower.strength = 10;
        createdTower.attackDistance = createdTower.width * 4;
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                                
                var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                var actX = Math.floor(e.clientX);
                var actY = Math.floor(e.clientY);
                console.log("Grid X: " + xPos);
                console.log("Grid Y: " + yPos);
                console.log("Mouse X: " + actX);
                console.log("Mouse Y: " + actY);
                console.log("Gamegrid[mousex][mousey] = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col);
                
                // This snaps the object to the nearest square to the left
                if(gameGrid.layout[xPos][yPos].taken === false){
                    // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
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
                var x = (e.clientX / 20) - 3;
                var y = (e.clientY / 20) - 3;
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                
                console.log("MovingMouseX = " + xPos);
                console.log("MovingMouseY = " + yPos);
                console.log('\n');
                
                if(e.clientX >=0 && e.clientX <= 850 && e.clientY >= 0 && e.clientY <= 650) {
                    createdTower.moveTo({x : xPos*20 + 10, y : yPos*20 + 10   });
                    createdTower.inCanvas = true;
                }else {
                    createdTower.inCanvas = false;
                }
                
                // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                // createdTower.moveTo({x : e.clientX, y : e.clientY });

                if(createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true){
                    createdTower.positionColor = 'red'
                } else {
                    createdTower.positionColor = 'green';
                } 
            }
        });
        mouseArray.push(createdMouse);

        
        // return createdTower;
    } // End createLowLevelTower
    
    // Creates air tower
    function createLowLevelTower4() {
        var createdTower = components.Tower({
            image : 'images/missile1.png',
            center : {x : 12000, y : 300},
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 200,
            rotateRate : 3.14159,
            isSelected : true,
            towerNum : towerCount,
            inCanvas : false,
        });
        
        createdTower.strength = 10;
        createdTower.attackDistance = createdTower.width * 5;
        
        towers.push(createdTower);
        
        var createdMouse = input.Mouse();
        createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
            if(createdTower.isSelected === true) {
                                
                var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                var actX = Math.floor(e.clientX);
                var actY = Math.floor(e.clientY);
                console.log("Grid X: " + xPos);
                console.log("Grid Y: " + yPos);
                console.log("Mouse X: " + actX);
                console.log("Mouse Y: " + actY);
                console.log("Gamegrid[mousex][mousey] = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col);
                
                // This snaps the object to the nearest square to the left
                if(gameGrid.layout[xPos][yPos].taken === false){
                    // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
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
                var x = (e.clientX / 20) - 3;
                var y = (e.clientY / 20) - 3;
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                
                // console.log("MovingMouseX = " + xPos);
                // console.log("MovingMouseY = " + yPos);
                // console.log('\n');
                
                if(e.clientX >=0 && e.clientX <= 850 && e.clientY >= 0 && e.clientY <= 650) {
                    createdTower.moveTo({x : xPos*20 + 10, y : yPos*20 + 10   });
                    createdTower.inCanvas = true;
                }else {
                    createdTower.inCanvas = false;
                }
                
                // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                // createdTower.moveTo({x : e.clientX, y : e.clientY });

                if(createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true){
                    createdTower.positionColor = 'red'
                } else {
                    createdTower.positionColor = 'green';
                } 
            }
        });
                
        mouseArray.push(createdMouse);        
    } // End createLowLevelTower
    
    function createCreep() {
        
        var randomStart = creepStartingPostitions[Math.floor(Math.random()*creepStartingPostitions.length)];
        
        var creep = components.Creep({
            image : 'images/USU-Logo.png',
            center : randomStart,
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 20,
            // moveRate : 100,
            
        });
        
        creeps.push(creep);
    }
    
    function createPersonCreep(){
        
        var randomStart = creepStartingPostitions[Math.floor(Math.random()*creepStartingPostitions.length)];
        
        person = components.AnimatedMoveModel({
            spriteSheet : 'images/personSprite.png',
            spriteCount : 7,
            spriteTime : [200,100, 200, 100, 200, 100, 200],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 310 },
            center : randomStart,
            width:20,
            height:20,
			rotation : 0,
            // percent_of_size: 100/150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 20/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000	
        }, graphics);
        creeps.push(person);
    }
    
    function createNaziCreep(){
        var randomStart = creepStartingPostitions[Math.floor(Math.random()*creepStartingPostitions.length)];
        
        nazi = components.AnimatedMoveModel({
            spriteSheet : 'images/naziSprite.png',
            spriteCount : 7,
            spriteTime : [100, 75, 75, 100, 75, 75,100],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 290 },
            center : randomStart,
            width: 30,
            height:30,
            percent_of_size: 20/150,
			rotation : 0,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 30/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000	
        }, graphics);
        creeps.push(nazi);
    }
    
    function createDragonCreep() {
        
        var randomStart = creepStartingPostitions[Math.floor(Math.random()*creepStartingPostitions.length)];
        
        dragon = components.AnimatedMoveModel( {
			spriteSheet : 'images/dragonSprite.png',
			spriteCount : 4,
			spriteTime : [200,150, 150, 150],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 330 },
            center : randomStart,
			rotation : 0,
            width : 150,
            height: 150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 40 / 1000,			// pixels per millisecond
			rotateRate : 0	// Radians per millisecond
		}, graphics);
        creeps.push(dragon);
        
    }

    
    function updatePlaying(elapsedTime) {
        if( count < 1 && count <=2) {
            // createCreep();
            createPersonCreep();
            createDragonCreep();
            createNaziCreep();
            
            count++;
        }
        
        
        // Update each tower
        for(var i = 0; i < towers.length; i++) {
            // towers[i].update(elapsedTime); // need to create up date function to change rotation of tower pic based on creeps
        }
        
        // Update each creep
        for(var i = 0; i < creeps.length; i++) {
            // internalUpdate = createPersonCreep;
            // creeps[i].moveForward(elapsedTime);
            creeps[i].update(elapsedTime, gameGrid); // need to create update fuction to update creep movement, life, sprite postion

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
            creeps[i].render(graphics);
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
        
        if(creeps.length > 0 ) {
            for(var i = 0; i < creeps.length; i++) {
                creeps[i].render(graphics);
            }
        }
        
    } // End render
    
        
   return {
       initialize : initialize,
       createLowLevelTower1 : createLowLevelTower1,
       createLowLevelTower2 : createLowLevelTower2,
       createLowLevelTower3 : createLowLevelTower3,
       createLowLevelTower4 : createLowLevelTower4,
       createDragonCreep : createDragonCreep,
    //    AnimatedModel : AnimatedModel,
    //    AnimatedMoveModel : AnimatedMoveModel,
       processInput : processInput,
       update : update,
       render : render
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input));