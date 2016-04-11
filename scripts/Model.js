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
        money,
        creepStartingPostitions = [{x : 0, y : 310}, {x: 0, y : 330}, {x: 0 , y: 270}];
    var count = 0;

    
    function upgrade() {
        for(var i = 0; i < towers.length; i++) {
            if(towers[i].isSelected === true && (money - towers[i].upgradeCost) >=0) {
                towers[i].level++;
                var image;
                if(towers[i].level === 2) {
                    towers[i].image = towers[i].image2;
                    towers[i].cost += 4;
                    towers[i].strength += 3;
                    towers[i].attackDistance += 20;
                    towers[i].upgradeCost += 4;
                    money -= towers[i].upgradeCost;
                    
                } else if(towers[i].level === 3) {
                    towers[i].image = towers[i].image3;
                    towers[i].cost += 5;
                    towers[i].strength += 4;
                    towers[i].attackDistance += 20;
                    towers[i].upgradeCost += 5;
                    money -= towers[i].upgradeCost;
                    
                }
            }
        }
    }
    
    function initializeGameGrid() {
        gameGrid = components.Grid(graphics.width(), graphics.height());
    } // End initializeGameGrid
    
    
    function initialize() {
        initializeGameGrid();
        
        score = 0;
        livesRemaining = 10;
        money = 200;
        
        // Potentially set these to something else if there is a count down screen or something
        internalUpdate = updatePlaying;
        internalRender = renderPlaying;
        
        var GeneralMouse = input.Mouse();
        GeneralMouse.registerCommand('mousedown', function(e, elapsedTime) {
            var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
            var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
            var xPos = Math.floor(x);
            var yPos = Math.floor(y);
            
            console.log("General X: " + xPos);
            console.log("General Y: " + yPos);
            
            
            for(var i = 0; i < towers.length; i++) {
                // if(towers[i].x === xPos && towers[i].y === yPos) {
                if(xPos >= towers[i].x -.5 && xPos <= towers[i].x + 0.5 && yPos >= towers[i].y - 0.5 && yPos <= towers[i].y + 0.5) {
                    towers[i].isSelected = true;
                    document.getElementById('upgradeButton').style.visibility = "visible";
                } else {
                    towers[i].isSelected = false;
                    document.getElementById('upgradeButton').style.visibility = "hidden";
                }
            }
            
        });
        
        GeneralMouse.registerCommand('mousemove', function(e, elapsedTime) {
            var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
            var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
            var xPos = Math.floor(x);
            var yPos = Math.floor(y);
            
            console.log("General X: " + xPos);
            console.log("General Y: " + yPos);
        });
        
        mouseArray.push(GeneralMouse);
        
    } // End initialize
    
    // Creates the gun tower
    function createLowLevelTower1() {
        if(money - 5 >= 0) {
        towerCount++;

            var createdTower = components.Tower({
                image : 'images/gun1.png',
                image2 : 'images/gun2.png',
                image3 : 'images/gun3.png',
                center : {x : 12000, y : 300},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 3.14159,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                level : 1,
                cost : 5,
                strength : 5,
                attackDistance : 20 * 2,
                upgradeCost : 8,
            });
            
            money -= createdTower.cost;
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
                    console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdMouse.deregisterCommand('mousedown');
                        createdTower.isSelected = false;
                        document.getElementById('upgradeButton').style.visibility = "hidden";
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
                        createdTower.moveTo({x : xPos*20 -10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });

                 
                    if((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) ||(createdTower.inCanvas === true && createdTower.blocking === true)){
                        createdTower.positionColor = 'red'
                    } else {
                        createdTower.positionColor = 'green';
                    } 
                }
            });
            
            mouseArray.push(createdMouse);

        }
    } // End createLowLevelTower
    
    // Creates the cannon tower
    function createLowLevelTower2() {
        if(money - 8 >= 0) {
            var createdTower = components.Tower({
                image : 'images/cannon1.png',
                image2 : 'images/cannon2.png',
                image3 : 'images/cannon3.png',
                center : {x : 12000, y : 300},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 3.14159,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                level : 1,
                cost : 8,
                strength : 20,
                attackDistance : 20 * 3,
                upgradeCost : 11,
            });
            
            money -= createdTower.cost;
            
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
                    console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdMouse.deregisterCommand('mousedown');
                        createdTower.isSelected = false;
                        document.getElementById('upgradeButton').style.visibility = "hidden";  
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
                        createdTower.moveTo({x : xPos*20 -10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });

                 
                    if((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) ||(createdTower.inCanvas === true && createdTower.blocking === true)){
                        createdTower.positionColor = 'red'
                    } else {
                        createdTower.positionColor = 'green';
                    } 
                }
            });
            mouseArray.push(createdMouse);

        }        
    } // End createLowLevelTower
    
    // Creates tower which is a mixed weapon
    function createLowLevelTower3() {
        if(money - 12 >= 0) {
            var createdTower = components.Tower({
                image : 'images/tower1.png',
                image2 : 'images/tower2.png',
                image3 : 'images/tower3.png',
                center : {x : 12000, y : 300},
                width : 20,
                height : 20,
                rotation : 0,
                moveRate : 200,
                rotateRate : 3.14159,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                level : 1,
                cost : 12,
                strength : 10,
                attackDistance : 20 * 4,
                upgradeCost : 15,
                
            });
            
            money -= createdTower.cost;
            
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
                    console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdMouse.deregisterCommand('mousedown');
                        createdTower.isSelected = false;
                        document.getElementById('upgradeButton').style.visibility = "hidden";  
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
                        createdTower.moveTo({x : xPos*20 -10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });

                 
                    if((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) ||(createdTower.inCanvas === true && createdTower.blocking === true)){
                        createdTower.positionColor = 'red'
                    } else {
                        createdTower.positionColor = 'green';
                    } 
                }
            });
            mouseArray.push(createdMouse);

        }
    } // End createLowLevelTower
    
    // Creates air tower
    function createLowLevelTower4() {
        if(money - 12 >= 0) {
            var createdTower = components.Tower({
                image : 'images/missile1.png',
                image2 : 'images/missile2.png',
                image3 : 'images/missile3.png',
                center : {x : 12000, y : 300},
                width : 20,
                height : 20,
                rotation : 0,
                moveRate : 200,
                rotateRate : 3.14159,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                strength : 20,
                attackDistance : 20 * 5,
                level : 1,
                cost : 12,
                upgradeCost : 15,
                
            });
            
            money -= createdTower.cost;
            // createdTower.attackDistance = createdTower.width * 5;
            
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
                    console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        // createdTower.moveTo(({ x: (xPos*40) - 20, y : (yPos*40) - 20}));
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdMouse.deregisterCommand('mousedown');
                        createdTower.isSelected = false;
                        document.getElementById('upgradeButton').style.visibility = "hidden";   
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
                        createdTower.moveTo({x : xPos*20 -10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });

                 
                    if((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) ||(createdTower.inCanvas === true && createdTower.blocking === true)){
                        createdTower.positionColor = 'red'
                    } else {
                        createdTower.positionColor = 'green';
                    } 
                }
            });
                    
            mouseArray.push(createdMouse);
        }      
    } // End createLowLevelTower
    
    function createCreep() {
        
        var randomStart = creepStartingPostitions[Math.floor(Math.random()*creepStartingPostitions.length)];
        
        var creep = components.Creep({
            image : 'images/USU-Logo.png',
            center : randomStart,
            width : 20,
            height : 20,
            rotation : 0,
            // moveRate : 20,
            moveRate : 100,
            
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
			moveRate : 25/1000,			// pixels per millisecond
			rotateRate : 3.141590 / 2 / 1000,
            armor : 0,	
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
			rotateRate : 3.141590 / 2 / 1000,
            armor : 30,	
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
			rotateRate : 0,	// Radians per millisecond
            armor: 10,
		}, graphics);
        creeps.push(dragon);
        
    }

    
    function updatePlaying(elapsedTime) {
        if( count < 1 && count <=2) {
            createCreep();
            createPersonCreep();
            createDragonCreep();
            createNaziCreep();
            
            count++;
        }
        
        
        // Update each tower
        for(var i = 0; i < towers.length; i++) {
            towers[i].update(elapsedTime, gameGrid, creeps); // need to create up date function to change rotation of tower pic based on creeps
        }
        
        // Update each creep
        for(var i = 0; i < creeps.length; i++) {
            // internalUpdate = createPersonCreep;
            // creeps[i].moveForward(elapsedTime);
            creeps[i].update(elapsedTime, gameGrid); // need to create update fuction to update creep movement, life, sprite postion
            if(creeps[i].x >= 41) {
                var index = creeps.indexOf(creeps[i]);
                creeps.splice(index, 1);
            }
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
        
        document.getElementById('moneyLabel').innerHTML = 'Money = $' + money;
        
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
       render : render,
       upgrade : upgrade,
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input));