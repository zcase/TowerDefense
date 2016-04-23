towerDefense.model = (function (components, graphics, input, sound, controls) {
    var gameGrid,
        tower,
        towers = [],
        bases = [],
        roof = [],
        bullets = [],
        creeps = [],
        displayArray = [],
        particleSystems = [],
        mouseArray = [],
        // generalMouseArray = [],
        GeneralMouse = input.Mouse(),
        modelKeyboard = input.Keyboard(),
        creep,
        score,
        livesRemaining = 10,
        // mouse = input.Keyboard(),
        mouseCapture = true,
        internalUpdate,
        internalRender,
        towerCount = 0,
        startGameValue = false,
        money,
        towerCount = 0,
        towerPlacementSound = sound.sound('sounds/towerPlacement.mp3'),
        creepStartingPostitionsLevel1 = [{x : -20, y : 310}, {x: -20, y : 330}, {x: -20 , y: 270}, {x : -40, y : 310}, {x: -40, y : 330}, {x: -40 , y: 270}, {x : -60, y : 310}, {x: -60, y : 330}, {x: -60 , y: 270}], // Left to right
        creepStartingPostitionsLevel2 = [{x : 19, y : 0}, {x: 19, y : 0}, {x: 19 , y: 0}], // Top to bottom,
        creepStartingPostitionsLevel3 = [{x : -20, y : 310}, {x: -20, y : 330}, {x: -20 , y: 270}, {x : 19, y : 0}, {x: 19, y : 0}, {x: 19 , y: 0}], //Left to Right, Top to Bottom
        
        delayStartTimes = [0, 0.50, 1, 1.50, 2, 2.50, 3, 3.50, 4, 4.50, 5, 5.50, 6, 6.50, 7, 7.50, 8, 8.50, 9];

    
    var count = 0;
    
    function sell() {
        var remove = false;
        for(var i = 0; i < towers.length; i++) {
            if(towers[i].tower.isSelected === true) {
                var xGrid = towers[i].tower.x;
                var yGrid = towers[i].tower.y;
                gameGrid.layout[xGrid][yGrid].taken = false;
                
                money += towers[i].tower.cost / 2;
                towers[i].tower.placed = false;
                
               var index = towers.indexOf(towers[i].tower);
               remove = true;
            }else {
                towers[i].tower.isSelected = false;
                // remove = false;
            }
        }
        if(remove){
            towers.splice(index, 1);
        }
    }
    
    function upgrade() {
        for(var i = 0; i < towers.length; i++) {
            if(towers[i].tower.isSelected === true && (money - towers[i].tower.upgradeCost) >=0) {
                towers[i].tower.level++;
                var image;
                if(towers[i].tower.level === 2) {
                    if(towers[i].tower.base){
                      towers[i].base.image = towers[i].base.image2; 
                      towers[i].tower.image = towers[i].tower.image2; 
                    }
                    if(towers[i].tower.nonBase){
                       towers[i].tower.image = towers[i].tower.image2;
                      
                    }
                    
                    if(towers[i].tower.tower) {
                        towers[i].tower.image = towers[i].tower.image2;
                        towers[i].roof.image = towers[i].roof.image2; 
                    }
                    
                    money -= towers[i].tower.upgradeCost;

                    var cost = towers[i].tower.cost;
                    var strength = towers[i].tower.strength;
                    var upCost = towers[i].tower.upgradeCost;
                    towers[i].tower.cost +=  (cost * 0.75);             // Change to a percentage of current tower.
                    towers[i].tower.strength +=  (strength * .60);         // Change to a percentage of current tower.
                    towers[i].tower.attackDistance += 20;  
                    towers[i].tower.upgradeCost += (upCost * 0.75);      // Change to a percentage of current tower.
                    // Change fire rate by percentage

                } else if(towers[i].tower.level === 3) {
                    if(towers[i].tower.base){
                      towers[i].base.image = towers[i].base.image3; 
                      towers[i].tower.image = towers[i].tower.image3; 
                    }
                    if(towers[i].tower.nonBase){
                       towers[i].tower.image = towers[i].tower.image3;
                      
                    }
                    
                    if(towers[i].tower.tower) {
                        towers[i].tower.image = towers[i].tower.image3;
                        towers[i].roof.image = towers[i].roof.image3; 
                    }
                    towers[i].tower.cost += 5;
                    towers[i].tower.strength += 4;
                    towers[i].tower.attackDistance += 20;
                    towers[i].tower.upgradeCost += 5;
                    money -= towers[i].tower.upgradeCost;
                    
                }
            }
        }
    }
    
    function initializeGameGrid() {
        gameGrid = components.Grid(graphics.width(), graphics.height());
    } // End initializeGameGrid
    
    function startGame() {
        startGameValue = true;
    }
    
    
    function initialize() {
        initializeGameGrid();
        
        score = 0;
        livesRemaining = 10;
        money = 200;
        
        // Potentially set these to something else if there is a count down screen or something
        internalUpdate = updatePlaying;
        internalRender = renderPlaying;
        
        modelKeyboard.registerCommand(KeyEvent.DOM_VK_6, function () {
            console.log("HELLO BRO");
        });
        // modelKeyboard.registerCommand(controls.getControls().upgrade, sell);
        // modelKeyboard.registerCommand(controls.getControls().upgrade, start);
        
        
        // var GeneralKeyboard = input.Keyboard();
        
        // GeneralKeyboard.registerCommand(KeyEvent.DOM_VK_S, startGame());
        
        // GeneralMouse = input.Mouse();
        
        GeneralMouse.registerCommand('mousedown', function(e, elapsedTime) {
            var x = (e.clientX / 20) - 3;
            var y = (e.clientY / 20) - 3;
            var xPos = Math.floor(x);
            var yPos = Math.floor(y);
            
            console.log("General X: " + xPos);
            console.log("General Y: " + yPos);
            
            
            for(var i = 0; i < towers.length; i++) {
                var upgradeButton = document.getElementById('upgradeButton');
                var sell = document.getElementById('sellButton');
                
                var lowerPosX = towers[i].tower.x;
                var upperPosX = towers[i].tower.x + 1;
                var lowerPosY = towers[i].tower.y;
                var upperPosY = towers[i].tower.y + 1;
                if( (xPos >= lowerPosX && xPos <= upperPosX)  && (yPos >= lowerPosY && yPos < upperPosY)) {
                    towers[i].tower.isSelected = true;
                } else {
                    towers[i].tower.isSelected = false;
                }
            }
            
        });
        
        // GeneralMouse.registerCommand('mousemove', function(e, elapsedTime) {
        //     var x = (e.clientX / 20) - 3;
        //     var y = (e.clientY / 20) - 3;
        //     var xPos = Math.floor(x)+1;
        //     var yPos = Math.floor(y)+1;
            
        //     // moveX = e.clientX;
        //     // moveY = e.clientY;
            
        //     // for(var i = 0; i < towers.length; i++) {
        //     //     towers[i].setTarget(e.clientX-120, e.clientY+120);
        //     // }
            
        //     console.log("General Moving X: " + (xPos));
        //     console.log("General Moving Y: " + (yPos));
        // });
        
        // generalMouseArray.push(GeneralMouse);
        
    } // End initialize
    
    // Creates the gun tower
    function createLowLevelTower1() {
        if(money - 5 >= 0) {
            // GeneralMouse.deregisterCommand('mousedown');
        towerCount++;
        var cost = 20;
        var temp = 20;
        var nextUpGrade = temp + (cost/2);
            var createdTower = components.Tower({
                image : 'images/gun1.png',
                image2 : 'images/gun2.png',
                image3 : 'images/gun3.png',
                center : {x : 12000, y : 300},
                target : {x : 100, y : 0},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 10 * Math.PI / 1000,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                level : 1,
                cost : cost,
                placed : false,
                strength : 5,
                attackDistance : 20 * 6,
                upgradeCost : nextUpGrade,
                base : true,
                tower : false,
                nonBase : false,
                type : 'ground',
                sound : 'sounds/gun1Shot.mp3',
                scalar : 2.5,
            });
            
            var createdBase = components.Tower({
                image : 'images/base1.png',
                image2 : 'images/base2.png',
                image3 : 'images/base3.png',
                center : { x : 12000, y : 300},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 0,
                towerNum : towerCount,
                scalar : 1.5,
                
            });
            
            money -= createdTower.cost;
            towers.push({tower : createdTower, base : createdBase, roof: undefined});
                        
            var createdMouse = input.Mouse();
            createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
                if(createdTower.isSelected === true) {
                                    
                    var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                    var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                    var xPos = Math.floor(x);
                    var yPos = Math.floor(y);
                    var actX = Math.floor(e.clientX);
                    var actY = Math.floor(e.clientY);
                    // console.log("Grid X: " + xPos);
                    // console.log("Grid Y: " + yPos);
                    // console.log("Mouse X: " + actX);
                    // console.log("Mouse Y: " + actY);
                    // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdBase.render(graphics);
                        createdTower.isSelected = false;
                        createdTower.placed = true;
                        towerPlacementSound.play();
                        createdMouse.deregisterCommand('mousedown');
                        mouseArray.pop();
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
                        createdTower.moveTo({x : xPos*20+10 , y : yPos*20 + 10   });
                        createdBase.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        // console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    createdBase.x = xPos;
                    createdBase.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });

                 
                    if((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) || (createdTower.inCanvas === true && createdTower.blocking === true)){
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
            towerCount++;
            var cost = 40;
            var temp = 40;
            var nextUpGrade = temp + (cost/2);
            var createdTower = components.Tower({
                image : 'images/cannon1or2.png',
                image2 : 'images/cannon1or2.png',
                image3 : 'images/cannon3.png',
                center : {x : 12000, y : 300},
                target : {x : 100, y : 0},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 10 * Math.PI / 1000,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                level : 1,
                cost : cost,
                placed : false,
                strength : 8,
                attackDistance : 20 * 8,
                upgradeCost : nextUpGrade,
                base : true,
                tower : false,
                nonBase : false,
                type : 'ground',
                sound : 'sounds/cannonShot.mp3',
                scalar : 3,
            });
            
            var createdBase = components.Tower({
                image : 'images/cannonBase1.png',
                image2 : 'images/cannonBase2.png',
                image3 : 'images/cannonBase3.png',
                center : { x : 12000, y : 300},
                width : 20,
                height : 20,
                moveRate : 200,
                rotateRate : 0,
                scalar : 2,
                towerNum : towerCount,
            });
            
            money -= createdTower.cost;
            towers.push({tower : createdTower, base : createdBase, roof: undefined});

            var createdMouse = input.Mouse();
            createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
                if(createdTower.isSelected === true) {
                                    
                    var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                    var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                    var xPos = Math.floor(x);
                    var yPos = Math.floor(y);
                    var actX = Math.floor(e.clientX);
                    var actY = Math.floor(e.clientY);
                    // console.log("Grid X: " + xPos);
                    // console.log("Grid Y: " + yPos);
                    // console.log("Mouse X: " + actX);
                    // console.log("Mouse Y: " + actY);
                    // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdBase.render(graphics);
                        createdTower.isSelected = false;
                        createdTower.placed = true;
                        towerPlacementSound.play();
                        createdMouse.deregisterCommand('mousedown');
                        mouseArray.pop(); 
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
                        createdTower.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdBase.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        // console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    createdBase.x = xPos;
                    createdBase.y = yPos;
                    // createdTower.moveTo({x : e.clientX- 70, y : e.clientY - 50 });
                    // createdTower.moveTo({x : e.clientX, y : e.clientY });


                    if ((createdTower.inCanvas === true && gameGrid.layout[xPos][yPos].taken === true) || (createdTower.inCanvas === true && createdTower.blocking === true)) {
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
        if (money - 12 >= 0) {
            towerCount++;
            var cost = 70;
            var temp = 70;
            var nextUpGrade = temp + (cost / 2);
            var createdTower = components.Tower({
                image: 'images/tower1.png',
                image2: 'images/tower2or3.png',
                image3: 'images/tower2or3.png',
                center: { x: 12000, y: 300 },
                target: { x: 100, y: 0 },
                width: 20,
                height: 20,
                // rotation: 0,
                moveRate: 200,
                rotateRate : 10 * Math.PI / 1000,
                isSelected: true,
                towerNum: towerCount,
                inCanvas: false,
                level: 1,
                cost: cost,
                placed : false,
                strength: 10,
                attackDistance: 20 * 10,
                upgradeCost: nextUpGrade,
                base : false,
                tower : true,
                nonBase : false,
                type : 'both',
                sound : 'sounds/cannonShot.mp3',
                scalar: 2.5,
            }),
                createdRoof = components.Tower({
                image: 'images/towerRoof1.png',
                image2: 'images/towerRoof2.png',
                image3: 'images/towerRoof3.png',
                center: { x: 12000, y: 300 },
                width: 20,
                height: 20,
                moveRate: 200,
                rotateRate: 0,
                scalar: 2.5,
                towerNum : towerCount,
            });

            money -= createdTower.cost;
            towers.push({tower : createdTower, base : undefined, roof: createdRoof});

            var createdMouse = input.Mouse();
            createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
                if(createdTower.isSelected === true) {
                    var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                    var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                    var xPos = Math.floor(x);
                    var yPos = Math.floor(y);
                    var actX = Math.floor(e.clientX);
                    var actY = Math.floor(e.clientY);
                    // console.log("Grid X: " + xPos);
                    // console.log("Grid Y: " + yPos);
                    // console.log("Mouse X: " + actX);
                    // console.log("Mouse Y: " + actY);
                    // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdRoof.render(graphics);
                        createdTower.isSelected = false;
                        createdTower.placed = true;
                        towerPlacementSound.play();
                        createdMouse.deregisterCommand('mousedown');
                        mouseArray.pop(); 
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
                        createdTower.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdRoof.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        // console.log("Blocking = "+ createdTower.blocking);
                    }else {
                        createdTower.inCanvas = false;
                    }
                    
                    var tempGridPosition = {x : xPos, y : yPos};
                    createdTower.x = xPos;
                    createdTower.y = yPos;
                    createdRoof.x = xPos;
                    createdRoof.y = yPos;
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
            towerCount++;
            var cost = 60;
            var temp = 60;
            var nextUpGrade = temp + (cost/2);
            var createdTower = components.Tower({
                image : 'images/missile1.png',
                image2 : 'images/missile2.png',
                image3 : 'images/missile3.png',
                center : {x : 12000, y : 300},
                target : {x : 100, y : 0},
                width : 20,
                height : 20,
                // rotation : 0,
                moveRate : 200,
                rotateRate : 10 * Math.PI / 1000,
                isSelected : true,
                towerNum : towerCount,
                inCanvas : false,
                strength : 12,
                attackDistance : 20 * 15,
                level : 1,
                cost : cost,
                placed : false,
                upgradeCost : nextUpGrade,
                base : false,
                tower : false,
                nonBase : true,
                type : 'flying',
                sound : 'sounds/anitAir.mp3',
                scalar : 2.5,
            });
            
            money -= createdTower.cost;            
            towers.push({tower : createdTower, base : undefined, roof: undefined});
            
            var createdMouse = input.Mouse();
            createdMouse.registerCommand('mousedown', function(e, elapsedTime) {
                if(createdTower.isSelected === true) {
                                    
                    var x =  (Math.floor(e.clientX) / 20) - 3; // This gives the x grid position
                    var y =  (Math.floor(e.clientY) / 20) - 3; // This gives the y grid position
                    var xPos = Math.floor(x);
                    var yPos = Math.floor(y);
                    var actX = Math.floor(e.clientX);
                    var actY = Math.floor(e.clientY);
                    // console.log("Grid X: " + xPos);
                    // console.log("Grid Y: " + yPos);
                    // console.log("Mouse X: " + actX);
                    // console.log("Mouse Y: " + actY);
                    // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                    
                    // This snaps the object to the nearest square to the left
                    if(gameGrid.layout[xPos][yPos].taken === false && createdTower.blocking === false){
                        gameGrid.layout[xPos][yPos].taken = true;
                        createdTower.render(graphics);
                        createdTower.isSelected = false;
                        createdTower.placed = true;
                        towerPlacementSound.play();
                        createdMouse.deregisterCommand('mousedown');
                        mouseArray.pop();  
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
                        createdTower.moveTo({x : xPos*20 +10, y : yPos*20 + 10   });
                        createdTower.inCanvas = true;
                        // console.log("Gamegrid[mousex][mousey].taken = " + gameGrid.layout[xPos][yPos].row + ", "+ gameGrid.layout[xPos][yPos].col + ", "+gameGrid.layout[xPos][yPos].taken);
                        // console.log("Blocking = "+ createdTower.blocking);
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

    function createCreep(delayTimes, startPositions) {
        var randomStart = startPositions[Math.floor(Math.random()*startPositions.length)];
        var randomStartTime = delayTimes[Math.floor(Math.random() *delayTimes.length)];

        
        var creep = components.Creep({
            image : 'images/USU-Logo.png',
            // center : { x: 10, y: 290 },
            center : {x: randomStart.x, y: randomStart.y},
            width : 20,
            height : 20,
            rotation : 0,
            moveRate : 10,
            type : 'ground',
            delayTime : randomStartTime,
            point : 5,
            // delayTime : randomStartTime,
            life : 100,
            moneyGained : 10,
            // healthColor : 'green',
            
        });

        creeps.push(creep);
    }
    
    function createPersonCreep(delayTimes, startPositions){
       var randomStart = startPositions[Math.floor(Math.random()*startPositions.length)];
       var randomStartTime = delayTimes[Math.floor(Math.random() *delayTimes.length)];

        person = components.AnimatedMoveModel({
            spriteSheet : 'images/personSprite.png',
            spriteCount : 7,
            spriteTime : [200,100, 200, 100, 200, 100, 200],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 310 },
            center : {x: randomStart.x, y: randomStart.y},
            width:20,
            height:20,
			rotation : 0,
            // percent_of_size: 100/150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 20/1000,			// pixels per millisecond
			rotateRate : Math.PI / 2 / 1000,
            armor : 0,
            type : 'ground',
            life : 70,
            rightBar : 25,
            delayTime : randomStartTime,
            topBar : 25,
            point : 5,
            moneyGained : 10,
        }, graphics);
        creeps.push(person);
    }
    
    function createNaziCreep(delayTimes, startPositions){
        var randomStart = startPositions[Math.floor(Math.random()*startPositions.length)];
        var randomStartTime = delayTimes[Math.floor(Math.random() *delayTimes.length)];
 
        
        nazi = components.AnimatedMoveModel({
            spriteSheet : 'images/naziSprite.png',
            spriteCount : 7,
            spriteTime : [100, 75, 75, 100, 75, 75,100],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 290 },
            center : {x: randomStart.x, y: randomStart.y},
            width: 30,
            height:30,
            percent_of_size: 20/150,
			rotation : 0,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 100/1000,			// pixels per millisecond
			rotateRate : Math.PI / 2 / 1000,
            armor : 30,
            type : 'ground',
            life : 80,
            rightBar : 25,
            delayTime : randomStartTime,
            topBar : 25,
            point : 15,
            moneyGained : 20,
        }, graphics);
        creeps.push(nazi);
    }
    
    function createDragonCreep(delayTimes, startPositions) {
        var randomStart = startPositions[Math.floor(Math.random()*startPositions.length)];
        var randomStartTime = delayTimes[Math.floor(Math.random() *delayTimes.length)];
        
        dragon = components.AnimatedMoveModel( {
			spriteSheet : 'images/dragonSprite.png',
			spriteCount : 4,
			spriteTime : [200,150, 150, 150],	// milliseconds per sprite animation frame
			// center : { x: 10, y: 330 },
            center : {x: randomStart.x, y: randomStart.y},
			rotation : 0,
            width : 150,
            height: 150,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 100 / 1000,			// pixels per millisecond
			rotateRate : 0,	// Radians per millisecond
            armor: 10,
            type : 'flying',
            life : 100,
            rightBar : 25,
            delayTime : randomStartTime,
            topBar : 50,
            point : 45,
            moneyGained : 40,
		}, graphics);
        creeps.push(dragon);
        
    }

    function createBossCreep(delayTimes, startPositions){
        var randomStart = startPositions[Math.floor(Math.random()*startPositions.length)];
        var randomStartTime = delayTimes[Math.floor(Math.random() *delayTimes.length)];
        
        boss = components.AnimatedMoveModel({
            spriteSheet : 'images/bossSprite.png',
            spriteCount : 8,
            spriteTime : [200, 300, 100, 200, 300,200,300,200],	// milliseconds per sprite animation frame
			// center : { x: 400, y: 400 },
            center : {x: randomStart.x, y: randomStart.y},
            width: 30,
            height:30,
            percent_of_size: 20/150,
			rotation : 0,
			orientation : 0,		// Sprite orientation with respect to "forward"
			moveRate : 20/1000,			// pixels per millisecond
			rotateRate : Math.PI / 2 / 1000,
            flying : false,
            life : 200,
            rightBar : 25,
            delayTime : randomStartTime,
            topBar : 30,
            point : 100,
            moneyGained : 100,
        }, graphics);
        creeps.push(boss);
    }
        
    
    // Create a Wave
    function Wave1(LevelStartingPositions) {
        var temp = delayStartTimes;
        // 10 total creeps all easy creeps
        for(var i = 0; i < 10; i++) {
            createCreep(temp, LevelStartingPositions);
            if(temp.length === 0) {
                temp = delayStartTimes;
            } else {
                temp.pop();
            }
        }
    }
    
    function Wave2(LevelStartingPositions) {
        // 12 total creeps differenct varaity
        var temp = delayStartTimes;
        
        createCreep();
        createCreep();
        createCreep();
        createPersonCreep()
        createPersonCreep()
        createCreep();
        createPersonCreep()
        createPersonCreep()
        createPersonCreep()
        createCreep();
        createCreep();
        createNaziCreep();
    }
    
    function Wave3 (LevelStartingPositions) {
        //16 total creeps
        var temp = delayStartTimes;
        
        createCreep();
        createCreep();
        createNaziCreep();
        createCreep();
        createPersonCreep()
        createNaziCreep();
        createPersonCreep()
        createCreep();
        createPersonCreep()
        createPersonCreep()
        createNaziCreep();
        createPersonCreep()
        createCreep();
        createNaziCreep();
        createCreep();
        createNaziCreep();
    }
    
    function Wave4(LevelStartingPositions) {
        // 20 total creeps
        var temp = delayStartTimes;
        
        createDragonCreep();
        createDragonCreep();
        createCreep();
        createCreep();
        createNaziCreep();
        createCreep();
        createPersonCreep()
        createNaziCreep();
        createPersonCreep()
        createCreep();
        createPersonCreep()
        createPersonCreep()
        createNaziCreep();
        createPersonCreep()
        createCreep();
        createDragonCreep();
        createDragonCreep();
        createNaziCreep();
        createCreep();
        createNaziCreep();
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function displayCreepScore(spec) {
        var that = {
          score : spec.score,
          x : spec.x,
          y : spec.y,
          time : 0,  
        };
        
        that.update = function(elapsedTime) {
            if(that.time <= 3000){
                that.time += elapsedTime;
                that.render();
            }else {
                that.time = undefined;
            }
        }
        
        that.render = function() {
           graphics.popUpScore({
                x: that.x,
                y: that.y,
                score : that.score.toString(),
           }); 
        }
        
        return that;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
        
    function updatePlaying(elapsedTime) {
        if( count < 1 && count <=2) {
        //     createCreep();
            // createPersonCreep();
        //     // createCreep();
        //     createDragonCreep();
        //     // createNaziCreep();
        //     // createBossCreep();
            Wave1(creepStartingPostitionsLevel1);
            count++;
        }
        
        // Update each tower
        for(var i = 0; i < towers.length; i++) {
            towers[i].tower.update(elapsedTime, gameGrid, creeps, bullets, particleSystems); // need to create up date function to change rotation of tower pic based on creeps
        }
        
        for(var i = 0; i < bullets.length; i++) {
            if(bullets[i].hitCreep !== true){
                bullets[i].update(creeps, particleSystems);
            }else{
              var index = bullets.indexOf(bullets[i]);
              bullets.splice(index, 1);
            }
        }
        
        // Update each creep
        for(var i = 0; i < creeps.length; i++) {

            creeps[i].update(elapsedTime, gameGrid); // need to create update fuction to update creep movement, life, sprite postion
        }
        
        if(displayArray.length > 0) {
            for(var i = 0; i < displayArray.length; i++) {
                displayArray[i].update(elapsedTime);
                if(displayArray[i].time === undefined) {
                    var index = displayArray.indexOf(displayArray[i]);
                    displayArray.splice(index, 1);
                }
            }
        }
        
        if(particleSystems.length > 0) {
            for(var i = 0; i < particleSystems.length; i++) {
                particleSystems[i].update(elapsedTime);
                // for(var j = 0; j < 10; j++){
                //     particleSystems[i].create();
                // }
                
                // particleSystems[i].update(elapsedTime);
            }
        }
        
        
        // Create update for score based on creeps killed/ creeps pass to other side
    }
    
    function renderPlaying(elapsedTime) {
        gameGrid.render(graphics);
        var deathx;
        var deathy;
        var score;
        

        for(var i = 0; i < towers.length; i++) {
            if (towers[i].tower.base) {                  
               towers[i].base.render(graphics);
               towers[i].tower.render(graphics);
            }
            if (towers[i].tower.tower) {
               towers[i].tower.render(graphics);
               towers[i].roof.render(graphics);
            }
            if (towers[i].tower.nonBase) {
                towers[i].tower.render(graphics);
            }
        }
        
        if(bullets.length > 0) {
            for(var i = 0; i < bullets.length; i++) {
                bullets[i].render();
            }
        }

        for (var i = 0; i < creeps.length; i++) {
            creeps[i].render(graphics);
           if(creeps[i].x >= 41 || creeps[i].dead === true ) {
                deathx = creeps[i].x;
                deathy = creeps[i].y;
                var dead = creeps[i].dead;
                score = 5;
                
                if(dead === true) {
                    creepIsDead = true;
                    var display = displayCreepScore({
                        x: deathx,
                        y : deathy,
                        score : '+' + score,
                    });
                    
                    money += creeps[i].moneyGained;
                    score += creeps[i].point;
                    displayArray.push(display);

                }
                
                var index = creeps.indexOf(creeps[i]);
                    creeps.splice(index, 1);
            }
        }
        
        
        if(displayArray.length > 0) {
            for(var i = 0; i < displayArray.length; i++) {
                displayArray[i].render();
            }
        }
        
        for(var i = 0; i < particleSystems.length; i++) {
                particleSystems[i].render();
        }
        
        

        document.getElementById('moneyLabel').innerHTML = 'Money = $' + money;
    }

    function processInputGeneral(elapsedTime) {
        modelKeyboard.update(elapsedTime);
        GeneralMouse.update(elapsedTime);
    }

    function processInput(elapsedTime) {
        // keyboard.update(elapsedTime);
        // mouse.update(elapsedTime);
        for (var i = 0; i < mouseArray.length; i++) {
            mouseArray[i].update(elapsedTime);
        }
    } // End processInput

    function update(elapsedTime) {
        internalUpdate(elapsedTime);
    } // End update

    function render(elapsedTime) {
        internalRender(elapsedTime);        
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
       processInputGeneral : processInputGeneral,
       update : update,
       render : render,
       upgrade : upgrade,
       sell : sell,
   }
    
}(towerDefense.components, towerDefense.graphics, towerDefense.input, towerDefense.sound, towerDefense.controls));