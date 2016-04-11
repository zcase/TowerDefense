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
            width : 60,
            height : 60,
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
                                
                var x =  (Math.floor(e.clientX) / 60) - 3; // This gives the x grid position
                var y =  (Math.floor(e.clientY) / 60) - 3; // This gives the y grid position
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
                var x = (e.clientX / 60) - 3;
                var y = (e.clientY / 60) - 3;
                var xPos = Math.floor(x);
                var yPos = Math.floor(y);
                
                console.log("MovingMouseX = " + xPos);
                console.log("MovingMouseY = " + yPos);
                console.log('\n');
                
                if(e.clientX >=0 && e.clientX <= 850 && e.clientY >= 0 && e.clientY <= 650) {
                    createdTower.moveTo({x : xPos*60 + 30, y : yPos*60 + 30   });
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
        var creep = components.Creep({
            image : 'images/USU-Logo.png',
            center : {x : 10, y : 310},
            width : 20,
            height : 20,
            rotation : 0,
            // moveRate : 50,
            moveRate : 100,
            
        });
        
        creeps.push(creep);
    }
    
    function createPersonCreep(){
        person = AnimatedMoveModel({
            spriteSheet : 'images/personSprite.png',
            spriteCount : 7,
            spriteTime : [200,100, 200, 100, 200, 100, 200],	// milliseconds per sprite animation frame
			center : { x: 100, y: 100 },
            width:20,
            height:20,
			rotation : 0,
            // percent_of_size: 100/150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 20/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000	
        });
        creeps.push(person);
    }
    
    function createNaziCreep(){
        nazi = AnimatedMoveModel({
            spriteSheet : 'images/naziSprite.png',
            spriteCount : 7,
            spriteTime : [100, 75, 75, 100, 75, 75,100],	// milliseconds per sprite animation frame
			center : { x: 64, y: 64 },
            width: 30,
            height:30,
            percent_of_size: 20/150,
			rotation : 0,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 30/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000	
        });
        creeps.push(nazi);
    }
    
    function createDragonCreep() {
        dragon = AnimatedMoveModel( {
			spriteSheet : 'images/dragonSprite.png',
			spriteCount : 4,
			spriteTime : [200,150, 150, 150],	// milliseconds per sprite animation frame
			center : { x: -100, y: 300 },
			rotation : 0,
            width : 150,
            height: 150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 50 / 1000,			// pixels per millisecond
			rotateRate : 0	// Radians per millisecond
		});
        creeps.push(dragon);
        
    }
    function createBossCreep(){
        boss = AnimatedMoveModel({
            spriteSheet : 'images/bossSprite.png',
            spriteCount : 8,
            spriteTime : [200, 300, 100, 200, 300,200,300,200],	// milliseconds per sprite animation frame
			center : { x: 400, y: 400 },
            width: 30,
            height:30,
            percent_of_size: 20/150,
			rotation : 0,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 28/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000	
        });
        creeps.push(boss);
    }
    
    function AnimatedModel(spec) {
		var that = {},
			sprite = graphics.drawCreep(spec);	// We contain a SpriteSheet, not inherited from, big difference
			 console.log("Model: ",sprite.width);
		that.update = function(elapsedTime) {
			sprite.update(elapsedTime);
		};
		
		that.render = function() {
			sprite.draw();
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime);
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime);
		};
		that.moveForward = function(elapsedTime) {
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);

			spec.center.x += (vectorX * spec.moveRate * elapsedTime);
			spec.center.y += (vectorY * spec.moveRate * elapsedTime);
		};
        that.moveBackward = function(elapsedTime) {
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);
                
			spec.center.x -= (vectorX * spec.moveRate * elapsedTime);
			spec.center.y -= (vectorY * spec.moveRate * elapsedTime);
		};
		
		return that;
	}
    
    function AnimatedMoveModel(spec) {
		var that = AnimatedModel(spec),	// Inherit from AnimatedModel
			base = {
				moveForward : that.moveForward,
				moveBackward : that.moveBackward,
				rotateRight : that.rotateRight,
				rotateLeft : that.rotateLeft,
				update : that.update
			},
			didMoveForward = false,
			didMoveBackward = false;

		that.update = function(elapsedTime) {
			if (didMoveForward === true) {
				base.update(elapsedTime, true);
			} else if (didMoveBackward === true) {
				base.update(elapsedTime, false);
			}
			
			didMoveForward = false;
			didMoveBackward = false;
		};
		
		that.moveForward = function(elapsedTime) {
			base.moveForward(elapsedTime);
			didMoveForward = true;
		};
		
		that.moveBackward = function(elapsedTime) {
			base.moveBackward(elapsedTime);
			didMoveBackward = true;
		};
		
		that.rotateRight = function(elapsedTime) {
			base.rotateRight(elapsedTime);
			didMoveForward = true;
		};
		
		that.rotateLeft = function(elapsedTime) {
			base.rotateLeft(elapsedTime);
			didMoveForward = true;
		};
		
		return that;
	}
    
    function updatePlaying(elapsedTime) {
        // createDragonCreep();
        if( count < 1 && count <=2) {
            // createCreep();
            createPersonCreep();
            createDragonCreep();
            createNaziCreep();
            createBossCreep();
            
            count++;
        }
        
        
        // Update each tower
        for(var i = 0; i < towers.length; i++) {
            // towers[i].update(elapsedTime); // need to create up date function to change rotation of tower pic based on creeps
        }
        
        // Update each creep
        for(var i = 0; i < creeps.length; i++) {
            // internalUpdate = createPersonCreep;
            creeps[i].moveForward(elapsedTime);
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
       AnimatedModel : AnimatedModel,
       AnimatedMoveModel : AnimatedMoveModel,
       processInput : processInput,
       update : update,
       render : render
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input));