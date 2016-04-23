towerDefense.components = (function(graphics, sound, effects) {
    var IN = 0;
    var FRONTIER = 1;
    var VISITED = 2;
    var popTime = 1000;
    var moneyFromCreeps = 0;
    var pointsFromCreeps = 0;
    
    //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  HELPER Function  Area
    // 
    // 
    // 
    // 
    // 
    // 
    //         
    //************************************************************
    
    function getCreepMoney() {
        return moneyFromCreeps;
    }
    
    function getCreepPoints() {
        return pointsFromCreeps;
    }
    
    // This function reverses an array that isn't a number.
    // If trying to reverse a number just use .reverse() on array (built in function)
    function reverse(a) {
        var temp = [];
        var count = 0;
        for(var i = a.length-1; i > -1; i--) {
            temp[count] = a[i];
            count++;
        }
        
        return temp;
    }
    
    // This function is used to reset the sloved state back to the origial 
    // of when the grid was set up.
    function reset(a) {
        for(var i = 0; i < a.width; i++) {
            for(var j = 0; j < a.height; j++ ) {
                a.layout[i][j].solvedState = FRONTIER;
                if(i === 39 && j === 15) {
                    a.layout[i][j].end = true;
                    a.layout[i][j].solvedState = "Finished";
                }
            }
        }
        
        return a;
    }
    
    //------------------------------------------------------------------
	//
	// Returns the magnitude of the 2D cross product.  The sign of the
	// magnitude tells you which direction to rotate to close the angle
	// between the two vectors.
    //
    // Borrowed from C5410 instructor Dr. Dean Mathias
	//
	//------------------------------------------------------------------
	function crossProduct2d(v1, v2) {
		return (v1.x * v2.y) - (v1.y * v2.x);
	}
    
    //------------------------------------------------------------------
	//
	// Computes the angle, and direction (cross product) between two vectors.
    //
	// Borrowed from C5410 instructor Dr. Dean Mathias
	//------------------------------------------------------------------
	function computeAngle(rotation, ptCenter, ptTarget) {
		var v1 = {
				x : Math.cos(rotation),
				y : Math.sin(rotation)
			},
            
			v2 = {
				x : ptTarget.x - ptCenter.x,
				y : ptTarget.y - ptCenter.y
			},
			dp,
			angle;

		v2.len = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
		v2.x /= v2.len;
		v2.y /= v2.len;

		dp = v1.x * v2.x + v1.y * v2.y;
		angle = Math.acos(dp);

		// Get the cross product of the two vectors so we can know
		// which direction to rotate.
		cp = crossProduct2d(v1, v2);

		return {
			angle : angle,
			crossProduct : cp
		};
	}
    
    //------------------------------------------------------------------
	//
	// Simple helper function to help testing a value with some level of tolerance.
	//
    // Borrowed from C5410 instructor Dr. Dean Mathias
	//------------------------------------------------------------------
	function testTolerance(value, test, tolerance) {
		if (Math.abs(value - test) < tolerance) {
			return true;
		} else {
			return false;
		}
	}
    
    // Helps to see if the creep will be within attacking distance.
    function distanceCheck(object1, object2) {
        
        var x = object2.x - object1.x,
            y = object2.y - object1.y,
            distance  = Math.sqrt(x*x +y*y);
            collision = false;
            
       
        if( distance < object1.attackDistance/20 + object2.attackDistance/20) {
            collision = true;
        }
        
        return collision;
    }
    
    
    //************************************************************
    //                  PATH FINDER Area
    // Used information found at http://gregtrowbridge.com/a-basic-pathfinding-algorithm/
    // to help implenet this algo. The code is similar and used the pieces 
    // that where missing from the maze path finding algorithm from the fist
    // assignment.
    //************************************************************
    
    // This is the main function that is used for the Breath First Search Algo
    function solveGrid(startlocation, gameObj){
          var distFromTop = startlocation.y;
          var distFromLeft = startlocation.x;
          
          var position = {
              distTop : distFromTop,
              distLeft : distFromLeft,
              path : [],
              status : 'Start'
          };
          
          var queue = [position];
          
          while (queue.length > 0) {
              var currentLocation = queue.shift();
              
              var newLocation = exploreDirection(currentLocation, 'North', gameObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
              
              var newLocation = exploreDirection(currentLocation, 'East', gameObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
              
              var newLocation = exploreDirection(currentLocation, 'South', gameObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
              
              var newLocation = exploreDirection(currentLocation, 'West', gameObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
          }
          
          return false;
    }
    
    // This function is used in the BFS algo to determine the status
    // of the loctiaon. Whether it be a valid, Blocked, Invalid, or 
    // the end goal.
    function locationStatus(location, gameObj) {
          var gridSize = gameObj.layout.length;
          var diffFromTop = location.distTop;
          var diffFromLeft = location.distLeft;
          
          if(location.distLeft < 0 || location.distLeft >= gridSize || location.distTop < 0 || location.distTop >= gameObj.height ) {
              return 'Invalid";'
          } else if(gameObj.layout[diffFromLeft][diffFromTop].end === true) {
              return 'Goal';
          }else if(gameObj.layout[diffFromLeft][diffFromTop].taken === true || gameObj.layout[diffFromLeft][diffFromTop].solvedState !== FRONTIER) {
                return 'Blocked';              
          }else {
              return 'Valid';
          }
      };
      
      // This function is used in the BFS algo to eplore a direction that is
      // passed into the function. returns a locaton and all of the information
      // regarding the location like its status.
      function exploreDirection(currentLocation, direction, gameObj) {
          
          var newPath = currentLocation.path.slice();
          newPath.push(direction);
          
          var diffFromTop = currentLocation.distTop;
          var diffFromLeft = currentLocation.distLeft;
          
          if(direction === 'North') {
              diffFromTop -= 1;
          }else if(direction === 'East') {
              diffFromLeft +=1;
          }else if(direction === 'South') {
              diffFromTop += 1;
          }else if(direction === 'West') {
              diffFromLeft -= 1;
          }
          
          var newLocation = {
              distTop : diffFromTop,
              distLeft : diffFromLeft,
              path : newPath,
              status : '?'
          }
          
          newLocation.status = locationStatus(newLocation, gameObj);
          
          if(newLocation.status === 'Valid') {
              gameObj.layout[newLocation.distLeft][newLocation.distTop].solvedState = 'Visited';
          }
          
          return newLocation;
      };
          
    
        //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  GRID  Area
    // 
    // 
    // 
    // 
    // 
    // 
    //         
    //************************************************************
    function gridCell(row, col) {
        var that = {
            col: col, // y value
            row: row, // x value
            North: true, 
            South: true,
            East: true,
            West: true,
            end: false,
            start: false,
            taken: false,
            solvedState : FRONTIER,
        };
        return that;
    }
    
    
    function Grid(GridWidth, GridHeight) {
        
        var that = {
            
            numberofCells : 0,
            width : (GridWidth/20),
            height : (GridHeight/20),
            layout : new Array(GridWidth/20),
            filledSpots : [],
            tileSize : 20,
            
        };
        
        for(var i = 0; i < that.width; i++) {
            that.layout[i] = [];
            for(var j = 0; j < that.height; j++ ) {
                var cell = gridCell(i, j);
                that.layout[i][j] = cell;
                that.numberofCells++;
                if(i === 39 && j === 15) {
                    that.layout[i][j].end = true;
                }
            }
        }
        
        that.render = function(graphics) {
            graphics.drawGrid({
                grid : that.layout,
                width : that.width,
                height : that.height,
                filledSpots : that.filledSpots,
                tilesize : that.tileSize
            });
        }
        
        return that;
    }
    
    
    //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  TOWER COMPONENT  Area
    // 
    // 
    // 
    // 
    // 
    // 
    //         
    //************************************************************
    function Tower(spec) {
        var that = {
            center : spec.center
        },
        
            ready = false,
            image = new Image();
            image2 = new Image();
            image3 = new Image();
            
            
      image.onload = function () {
          ready = true;
        //   console.log('checking for tower...');
      };
      
      image.src = spec.image;
      image2.src = spec.image2;
      image3.src = spec.image3;
    
      that.rotateRight = function(angle) {
          spec.rotation += angle;
      };
      
      that.rotateLeft = function(angle) {
          spec.rotation -= angle;
      };
      
      that.moveTo = function(center) {
          var myCanvas = document.getElementById('myCanvas');
          spec.center = center;
      };
      
      spec.rotation = 89.8;
      that.shotsound = sound.sound(spec.sound);
      that.base = spec.base;
      that.tower = spec.tower;
      that.nonBase = spec.nonBase;
      that.center = spec.center;
      that.placed = spec.placed;
      that.target = spec.target;
      that.image = image,                   // The main image when at Level 1
      that.image2 = image2,                 // The image for Level 2 of tower.
      that.image3 = image3,                 // The image for level 3 of tower.
      that.strength = spec.strength;        // The Weapon stregth (damage inflicted to creep)
    //   that.placed = false;                  // Bool for telling if placed or not  (May need to look over to see if needed);
      that.x = spec.center.x;                      // The x value of the tower
      that.y = spec.center.y;                      // The y value of the tower
      that.width = spec.width;              // The width value of tower
      that.height = spec.height;            // The height value of tower
      that.attackDistance = spec.attackDistance; // Sets the attack radius of tower. (how close a creep has to come to get fired upon)
      that.isSelected = true;               // Bool to tell if the tower is selected or not.
      that.rangeColor = 'blue';             // The color to be displayed of the tower attack range
      that.inScreen = false;                // Bool to tell if the tower is in the canvas screen or not. (MAY NEED TO REMOVE)
      that.positionColor = 'green';         // The position color of the tower. (Red for invalid position, green for valid position).
      that.cost = spec.cost;                // The cost to buy and place tower.
      that.level = spec.level;              // The level the tower is at.
      that.inCanvas = spec.inCanvas;        // Same as inScreen (REMOVE ONE OR THE OTHER)
      that.blocking = undefined;                // Tells if the tower is blocking a path from creep entrance to creep exit.
      that.creepDone = false;               // MAY NEED TO REMVOE CHECK OTHER CODE FIRST
      that.upgradeCost = spec.upgradeCost;  // The cost to upgrade the tower.
      that.fireRate = 2000;
      that.timeSinceLastFire = 0;
      that.type = spec.type;
      
      
      that.checkBlockingPath2 = function(gameGridObj, towerPosition) {
          var xGrid = Math.floor(towerPosition.center.x/ 20);
         
         var yGrid = Math.floor(towerPosition.center.y / 20); 
         
         var tempGameObj = reset(gameGridObj);
         
         var isTakenInitial = tempGameObj.layout[xGrid][yGrid].taken;
         
         tempGameObj.layout[xGrid][yGrid].taken = true;
         var checkBlock = solveGrid({x : 0, y : 14}, tempGameObj);
         tempGameObj.layout[xGrid][yGrid].taken = isTakenInitial;
         return checkBlock;
      };
      
      
      
      
      // Updates the tower object.
      that.update = function(elapsedTime, gameGridObj, creeps, bullets, particleSystems) {
          var blocking;
          
          var xPos = Math.floor(that.x);
          var yPos = Math.floor(that.y);
          
          var tempGridPosition = {x : xPos, y : yPos};
         
         if(that.inCanvas === true && xPos >=0 && yPos >= 0 && xPos <= gameGridObj.width && yPos <= gameGridObj.height) {
            if(creeps.length === 0 && that.placed === false) {
                if(xPos == 0 && yPos == 14){
                    blocking = false;  // This really means it is blocking. Just using to match function output.
                }else
                
                if(xPos == 39 && yPos == 15){
                    blocking = false;  // This really means it is blocking. Just using to match function output.
                }else {
                  blocking = that.checkBlockingPath2(gameGridObj, {center :{x: xPos*20, y : yPos*20}});
                }
            } else{
               if(that.placed === false) {
                  for(var i = 0; i < creeps.length; i++) {
                    blocking = creeps[i].checkBlockingPath(gameGridObj, tempGridPosition);
                  }  
               }
               
            }

            // if(blocking === false && creeps.length > 0) {
            if(blocking === false) {
                that.blocking = true;
            } else {
                that.blocking = false;
            }
            
            var fire;
            if(that.placed === true) {
                fire = false;
                // Checks to see is a creep is with in the attack distance of the Tower
                for(var i = 0; i < creeps.length; i++) {
                    if(that.type === 'both' || creeps[i].type === that.type) {
                        if(distanceCheck(that, creeps[i])) {
                            that.setTarget(creeps[i].x*20, creeps[i].y*20);
                            fire = true;
                        } else {
                            that. setTarget(0, 300);
                            fire = false;
                        }
                    }
                }
                

                // This rotates the tower towards the position of the creep witin distance
                var result = computeAngle(spec.rotation, spec.center, that.target);
                if(testTolerance(result.angle, 180 , .01) == false) {
                    if(result.crossProduct > 0) {
                        // weaponSprite.rotateRight(spec.rotateRate);
                        that.rotateRight(spec.rotateRate);
                        spec.rotation += spec.rotateRate;
                    } else {
                        // weaponSprite.rotateLeft(spec.rotateRate);
                        that.rotateLeft(spec.rotateRate);
                        spec.rotation -= spec.rotateRate;
                    }
                }
                
                
                that.timeSinceLastFire += elapsedTime;
                if(fire === true && that.timeSinceLastFire >= that.fireRate){
                  that.fire(bullets, that.strength, particleSystems);
                  that.shotsound.play();
                  that.timeSinceLastFire = 0;
                }
            }
            
            
         }

      }; // END TOWER UPDATE FUNCTION
      
      
      that.fire = function(bullets, damage, particleSystems) {
          var newBullet = Bullet({
              x : that.x*20 + 10,
              y : that.y*20 + 10,
              speed : 100,
              radius : 3,
              color : 'black',
              targetX : that.target.x,
              targetY : that.target.y,
              rotation : that.rotation,
              damage : damage,
          });
          
          var xPos = ((that.x*20)+15);
          var yPos = ((that.y*20)+15);
          var gunSmoke = effects.ParticleSystem({
             image : 'images/smoke.png',
             center : {x : xPos, y : yPos},
             speed : {mean : 50, std : 25},
             rotation : spec.rotation,
             lifetime : {mean : 1, std: 0},
             usedFor : 'gun',
          }, graphics);
          
          var gunSpark = effects.ParticleSystem({
             image : 'images/fire.png',
             center : {x : xPos, y : yPos},
             speed : {mean : 50, std : 25},
             rotation : spec.rotation,
             lifetime : {mean : 1, std: 0},
             usedFor : 'spark',
          }, graphics);
          
          
          for(var j = 0; j < 10; j++){
             gunSmoke.create();
          }
          gunSpark.create();
          gunSpark.create();

          bullets.push(newBullet);
          particleSystems.push(gunSmoke);
          particleSystems.push(gunSpark);
          
          
      }
      
      // Function to set the were the target is located
      that.setTarget = function(x, y) {
          that.target = {
              x : x,
              y : y
          };
      };
      
  
      // Renders the Tower object
      that.render = function(graphics) {
          if (ready) {
              graphics.drawTower({
                  image: that.image,
                  x: spec.center.x,
                  y: spec.center.y,
                  width: spec.width,
                  height: spec.height,
                  rotation: spec.rotation,
                  moveRate: spec.moveRate,
                  rotateRate: spec.roatateRate,
                  isSelected: that.isSelected,
                  attackDistance: that.attackDistance,
                  rangeColor: that.rangeColor,
                  positionColor: that.positionColor,
                  scalar : spec.scalar,
              });
            // console.log('its ready for tower');
          }
        
      }; //END OF TOWER RENDERING
      
      return that;
    }; // END OF TOWER COMPONENT
        
    
    
    function Bullet(spec) {
        var that = {
            x : spec.x,
            y : spec.y,
            speed : spec.speed,
            radius : spec.radius,
            color : spec.color,
            targetX : spec.targetX,
            targetY : spec.targetY,
            damage : spec.damage,
            
            velocityX : 0,
            velocityY : 0,
            hitCreep : false,
            attackDistance : spec.radius,
        }
        
        that.update = function (creeps, particleSystems) {
            
            var targetX = that.targetX,
                targetY = that.targetY;
                
            var diffX = targetX - that.x,
                diffY = targetY - that.y,
                distance = Math.sqrt(targetX*targetX + targetY*targetY);
                
                
            that.velocityX = (diffX / distance) * that.speed;
            that.velocityY = (diffY / distance) * that.speed;
            
            if(distance > that.radius/2) {
                that.x += that.velocityX;
                that.y += that.velocityY;
            }
            
            that.x /=20; // Scale to the grid.
            that.y /=20; // Scale to the grid.
            for(var i = 0; i < creeps.length; i++) {
                if(distanceCheck(that, creeps[i])) {
                    creeps[i].health -= that.damage;
                    
                    var xPos = ((that.x*20));
                    var yPos = ((that.y*20));
                    var hitCreep = effects.ParticleSystem({
                        image : 'images/blood.png',
                        center : {x : xPos, y : yPos},
                        speed : {mean : 25, std : 25},
                        rotation : spec.rotation,
                        lifetime : {mean : 1, std: 1},
                        usedFor : 'creep',
                    }, graphics);
          
          
                    for(var j = 0; j < 10; j++){
                        hitCreep.create();
                    }
                    
                    particleSystems.push(hitCreep);

                    that.hitCreep = true;
                } 
            }
            that.x *=20; // Rescale to the canvas 
            that.y *=20; // Rescale to the canvas
            
            if(Math.round(targetX) === Math.round(that.x) && Math.round(targetY) === Math.round(that.y)) {
                that.hitCreep = true;
            }
        };
        
        that.render = function() {
            if(that.hitCreep !== true) {
                graphics.drawCircleBullet({
                    x : that.x,
                    y : that.y,
                    radius : that.radius,
                    color : that.color
                });
            
            }
        }
        
        return that;
    }
   
    function Base(spec){
        var that = {
            center: spec.center
        },

            ready = false,
            image = new Image(),
            image2 = new Image(),
            image3 = new Image();


        image.onload = function() {
            ready = true;
            // console.log('checking for base...');
        };

        that.update = function(elapsedTime, gameGridObj, creeps) {
            var blocking;

            var xPos = Math.floor(that.x);
            var yPos = Math.floor(that.y);

            var tempGridPosition = { x: xPos, y: yPos };

            if (that.inCanvas === true && xPos >= 0 && yPos >= 0 && xPos <= gameGridObj.width && yPos <= gameGridObj.height) {
                for (var i = 0; i < creeps.length; i++) {
                    blocking = creeps[i].checkBlockingPath(gameGridObj, tempGridPosition);
                }

                if (blocking === false && creeps.length > 0) {
                    that.blocking = true;
                } else {
                    that.blocking = false;
                }

            }
        }

        that.render = function(graphics) {
            if (ready) {
                graphics.drawTower({
                    image: that.image,
                    x: spec.center.x,
                    y: spec.center.y,
                    width: spec.width,
                    height: spec.height,
                });
                // console.log('its ready for base');
            }
        }
        that.image = image;
        that.image2 = image2;

        return that;
    }
    
    
    
    //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  CREEP  Area
    // 
    // 
    // 
    // 
    // 
    // 
    //
    //************************************************************
    function Creep(spec) {
        var that = {},
            ready = false,
            image = new Image();
            
       image.onload = function () {
          ready = true;
      };
      
      image.src = spec.image;
      
      that.rotateRight = function(elapsedTime, gameGridObj) {
          spec.rotation += spec.rotateRate * (elapsedTime / 1000);
      };
      
      that.rotateLeft = function(elapsedTime, gameGridObj) {
          spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
      };
      
      that.moveLeft = function(elapsedTime, gameGridObj) {
          spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        //   spec.center.x -= spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveRight = function(elapsedTime, gameGridObj) {
        spec.center.x += spec.moveRate * (elapsedTime / 1000);
        //   spec.center.x += spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveUp = function(elapsedTime, gameGridObj) {
        //   spec.rotation += 90;
          spec.center.y -= Math.ceil(spec.moveRate * (elapsedTime / 1000))+20;
        // spec.center.y -= spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveDown = function(elapsedTime, gameGridObj) {
          spec.center.y += Math.ceil(spec.moveRate * (elapsedTime / 1000))+20;
        //   spec.center.y += spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveTo = function(center) {
          var myCanvas = document.getElementById('myCanvas');
          
        //   center.x -= myCanvas.offsetLeft;
        //   center.y -= myCanvas.offsetTop;
          spec.center = center;
      };
      
      that.strength = 5;
      that.life = spec.life;
      that.gridSolutionPath = new Array();
      that.gridVisited = new Array();
      that.movementStack = [];
    //   that.placed = false;
      that.x = spec.center.x;
      that.y = spec.center.y;
      that.width = spec.width;
      that.height = spec.height;
      that.reachedGoal = false;
      that.attackDistance = 10;    // Used for distance checking DONT remove
      that.health = spec.life;
      that.dead = false;
      that.percent = that.health / that.life;
      that.startTime = spec.delayTime*1000;
      that.initialDelayTime = 0;
      that.type = spec.type;
      that.moneyGained = spec.moneyGained;
      that.point = spec.point;
  
      that.render = function(graphics) {
          if(ready) {
              graphics.drawCreepBasic({
                  image : image,
                  x: spec.center.x,
                  y: spec.center.y,
                  width: spec.width,
                  height: spec.height,
                  rotation: spec.rotation,
                  moveRate : spec.moveRate,
                  rotateRate : spec.roatateRate,
              });
              graphics.drawHealthBar({
                  x: spec.center.x - 25,
                  y: spec.center.y - 25,
                  healthColor : spec.healthColor,
                  healthBar : spec.healthBar,
                  percent : that.percent,
              });
          }
      };
      
    //   that.checkPosition = function(width, height, gridObj) {
    //     if(width < 0  || width >= gridObj.width || height < 0 || height >= gridObj.height){
    //         return null; // out of bounds
    //     }
    //     return gridObj.layout[width][height];
    //   };
      
    //   that.getNeighbors = function (Cell, gridObj) {
    //       var neighbors = {
    //             North: that.checkPosition(Cell.row, Cell.col-1, gridObj),
    //             South: that.checkPosition(Cell.row, Cell.col+1, gridObj),
    //             West: that.checkPosition(Cell.row-1, Cell.col, gridObj),
    //             East: that.checkPosition(Cell.row+1, Cell.col, gridObj)
    //         };
    
    //     return neighbors;
    //   };
      
      that.checkBlockingPath = function(gameGridObj, towerPosition) {
          var xGrid = Math.floor(spec.center.x/ 20);
         
         var yGrid = Math.floor(spec.center.y / 20); 
         
         var tempGameObj = reset(gameGridObj);
         
         var isTakenInitial = tempGameObj.layout[towerPosition.x][towerPosition.y].taken
         
         tempGameObj.layout[towerPosition.x][towerPosition.y].taken = true;
         var checkBlock = solveGrid({x : xGrid, y : yGrid}, tempGameObj);
         tempGameObj.layout[towerPosition.x][towerPosition.y].taken = isTakenInitial;
         return checkBlock;
      }
            
      that.update = function(elapsedTime, gameGridObj) {
          
         var xGrid = Math.floor(spec.center.x/ 20);
         
         var yGrid = Math.floor(spec.center.y / 20); 
         
         var tempGameObj = reset(gameGridObj);

         var moveStack = false;
         
        //  console.log("CREEP X: " + xGrid);
        //  console.log("CREEP Y: " + yGrid);
        //  console.log("\n");
         
         
   
         if(that.initialDelayTime >= that.startTime && that.reachedGoal !== true && that.type !== 'flying' && xGrid >= 0) {
             that.movementStack = solveGrid({ x: xGrid, y: yGrid }, tempGameObj);

             // TODO reverse array and then pop off end value
             moveStack = reverse(that.movementStack);

             // move healthbar stuff in here
             that.percent = that.health / that.life;
             
             if (that.health === spec.life){
                 spec.healthColor = "visiable";
             }
             else if (that.health < spec.life && that.health >= spec.life * 0.75) {
                 spec.healthColor = "green";
                //  spec.healthBar = 50;
                 //  creep.render(graphics);
                //  console.log("green");
             }
             else if (that.health < spec.life * 0.667 && that.health >= spec.life * 0.33) {
                 spec.healthColor = 'yellow';
                //  console.log("yellow");
             }
             else if (that.health < spec.life * 0.333 && that.health >= 1) {
                 spec.healthColor = 'red';
                //  console.log('red');
             }
             else {
                 that.dead = true; // change to that = undefined when moved to computent creep.update section
             }

             if (moveStack !== false ) {
                 var nextMove = moveStack.pop();
                 if (nextMove === 'North') {
                     that.moveUp(elapsedTime, tempGameObj);
                     // that.moveTo({ x: ((xGrid)*20), y : ((yGrid-1)*20)});
                 } else if (nextMove === 'East') {
                    that.moveRight(elapsedTime, tempGameObj);
                    // that.moveTo({ x: ((xGrid+1)*20), y : ((yGrid)*20)});
                } else if(nextMove === 'South') {
                    that.moveDown(elapsedTime, tempGameObj);
                    // that.moveTo({ x: ((xGrid)*20), y : ((yGrid+1)*20)});
                } else if(nextMove === 'West') {
                    that.moveLeft(elapsedTime, tempGameObj);
                    // that.moveTo({ x: ((xGrid-1)*20), y : ((yGrid)*20)});
                } 
            }
         }
         
         that.initialDelayTime += elapsedTime;
         
         if(that.type === 'flying') {
             that.moveRight(elapsedTime);
         }
         
         if(xGrid < 0 ) {
             that.moveRight(elapsedTime);
         }
         
         if(xGrid <= 41 && xGrid >=39)  {
        //  if(moveStack.length === 0 && xGrid < 41 && moveStack !==false) {
             that.reachedGoal = true;
             that.moveRight(elapsedTime);
         }
         
        
      };
        
        
        return that;
    };
    
    
    //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  AnimatedModel Area
    // 
    // 
    // 
    // 
    // 
    // 
    //         
    //************************************************************
    function AnimatedModel(spec, graphics) {
		var that = {},
			sprite = graphics.drawCreep(spec);
            lifeBar = graphics.drawHealthBar(spec);	// We contain a SpriteSheet, not inherited from, big difference
			//  console.log("Model: ",sprite.width);
             
        that.x = spec.center.x;
        that.y = spec.center.y;
             
		that.update = function(elapsedTime) {
			sprite.update(elapsedTime);
 
		};
		
		that.render = function() {
			sprite.draw();
            graphics.drawHealthBar({
                  x: spec.center.x- spec.rightBar,
                  y: spec.center.y - spec.topBar,
                  healthColor : spec.healthColor,
                  healthBar : spec.healthBar,
                  percent : that.percent,
              });
		};
		
		that.rotateRight = function(elapsedTime) {
			spec.rotation += spec.rotateRate * (elapsedTime);
            // spec.rotation += 10;
		};
		
		that.rotateLeft = function(elapsedTime) {
			spec.rotation -= spec.rotateRate * (elapsedTime);
            // spec.rotation -= 90;
		};
		that.moveForward = function(elapsedTime) {
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);

			spec.center.x += (vectorX * spec.moveRate * elapsedTime);
			spec.center.y += (vectorY * spec.moveRate * elapsedTime);
            
            that.x = spec.center.x/20;
            that.y = spec.center.y/20;
		};
        that.moveBackward = function(elapsedTime) {
			var vectorX = Math.cos(spec.rotation + spec.orientation),
				vectorY = Math.sin(spec.rotation + spec.orientation);
                
			spec.center.x -= (vectorX * spec.moveRate * elapsedTime);
			spec.center.y -= (vectorY * spec.moveRate * elapsedTime);
            
            that.x = spec.center.x/20;
            that.y = spec.center.y/20;
		};
        
        that.moveUp = function(elapsedTime) {
            // that.rotateLeft(elapsedTime);
            spec.center.y -= Math.ceil(spec.moveRate * (elapsedTime / 1000))+20;
            // that.rotateLeft(elapsedTime);
            // that.moveForward(elapsedTime);
            // that.rotateRight(elapsedTime);
        };
      
        that.moveDown = function(elapsedTime) {
            spec.center.y += Math.ceil(spec.moveRate * (elapsedTime / 1000))+20;
            //   spec.center.y += spec.moveRate;
        };
        
        that.checkBlockingPath = function(gameGridObj, towerPosition) {
          var xGrid = Math.floor(spec.center.x/ 20);
         
         var yGrid = Math.floor(spec.center.y / 20); 
         
         var tempGameObj = reset(gameGridObj);
         
         var isTakenInitial = tempGameObj.layout[towerPosition.x][towerPosition.y].taken
         
         tempGameObj.layout[towerPosition.x][towerPosition.y].taken = true;
         var checkBlock = solveGrid({x : xGrid, y : yGrid}, tempGameObj);
         tempGameObj.layout[towerPosition.x][towerPosition.y].taken = isTakenInitial;
         return checkBlock;
      };
      
		return that;
	}
    
    
    
    
    
    
    //************************************************************
    //
    // 
    // 
    // 
    // 
    // 
    //                  Animated Move Model Area
    // 
    // 
    // 
    // 
    // 
    // 
    //         
    //************************************************************
    function AnimatedMoveModel(spec, graphics) {
		var that = AnimatedModel(spec, graphics),	// Inherit from AnimatedModel
			base = {
				moveForward : that.moveForward,
				moveBackward : that.moveBackward,
				rotateRight : that.rotateRight,
				rotateLeft : that.rotateLeft,
				update : that.update,
                moveUp : that.moveUp,
                moveDown : that.moveDown,
                checkBlockingPath : that.checkBlockingPath,
			},
            didRotateLeft = false,
            didRotateRight = false,
			didMoveForward = false,
			didMoveBackward = false;
            
        that.health = spec.life;
        // that.health = spec.life - 20;
        that.armor = spec.armor;
        that.type = spec.type;
        that.health = spec.life;
        that.dead = false;
        that.percent = that.health / that.life;
        that.x = spec.center.x;
        that.y = spec.center.y;
        that.life = spec.life;
        that.width = spec.width;
        that.reachedGoal = false;
        that.attackDistance = 10;
        that.startTime = spec.delayTime*1000;
        that.initialDelayTime = 0;
        that.moneyGained = spec.moneyGained;
        that.point = spec.point;

        that.update = function(elapsedTime, gameGridObj) {
            
            var xGrid = Math.floor(spec.center.x/ 20);
         
            var yGrid = Math.floor(spec.center.y / 20); 
         
            var tempGameObj = reset(gameGridObj);

            var moveStack = false;
            
            // console.log("CREEP X: " + xGrid);
            // console.log("CREEP Y: " + yGrid);
            // console.log("\n");
   
            if (that.initialDelayTime >= that.startTime && that.reachedGoal !== true && that.type !== 'flying') {
                that.movementStack = solveGrid({ x: xGrid, y: yGrid }, tempGameObj);

                moveStack = reverse(that.movementStack);
                
                that.percent = that.health / that.life;

                // console.log("life: ", spec.life);
                if (that.health === spec.life){
                 spec.healthColor = "visiable";
                }
                else if (that.health < spec.life && that.health >= spec.life * 0.7) {
                    spec.healthColor = "green";
                    // spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log("green");
                }
                else if (that.health < spec.life * 0.7 && that.health >= spec.life * 0.45) {
                    spec.healthColor = 'yellow';
                    // spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log("yellow");
                }
                else if (that.health < spec.life * 0.45 && that.health >= 1) {
                    spec.healthColor = 'red';
                    // spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log('red');
                }
                else {
                    that.dead = true;
                }

                if (moveStack !== false) {
                    var nextMove = moveStack.pop();
                    if (nextMove === 'North') {
                        // that.rotateLeft(elapsedTime);
                        // didRotateLeft = true;
                        // that.moveForward(elapsedTime);
                        that.moveUp(elapsedTime);
                        // that.moveForward(elapsedTime);
                        // that.rotateRight(elapsedTime);
                        // that.rotateRight(elapsedTime);
                        // that.moveTo({ x: ((xGrid)*20), y : ((yGrid-1)*20)});
                    } else if (nextMove === 'East') {
                        // if(didRotateLeft === true) {
                        //     that.rotateRight(elapsedTime);
                        //     didRotateLeft = false;


                        // } else if (didRotateRight === true) {
                        //     that.rotateLeft(elapsedTime);
                        //     didRotateRight = false;
                        // }

                        that.moveForward(elapsedTime);
                        // that.moveTo({ x: ((xGrid+1)*20), y : ((yGrid)*20)});
                    } else if (nextMove === 'South') {
                        // that.rotateRight(elapsedTime);
                        // didRotateRight = true;
                        // that.moveForward(elapsedTime);
                        that.moveDown(elapsedTime);
                        // that.movseForward(elapsedTime);
                        // that.rotateLeft(elapsedTime);
                        // that.moveTo({ x: ((xGrid)*20), y : ((yGrid+1)*20)});
                    } else if (nextMove === 'West') {
                        // if(didRotateLeft === true) {
                        //     that.rotateRight(elapsedTime);
                        //     didRotateLeft = false;
                        // } else if (didRotateRight === true) {
                        //     that.rotateLeft(elapsedTime);
                        //     didRotateRight = false;
                        // }

                        that.moveBackward(elapsedTime);
                        // that.moveTo({ x: ((xGrid-1)*20), y : ((yGrid)*20)});
                    }
                }
            }

            if (that.initialDelayTime >= that.startTime && that.type === 'flying') {
                that.moveForward(elapsedTime);
                
                if (that.health == spec.life){
                    spec.healthColor = "visiable";
                }
                else if (that.health < spec.life && that.health >= spec.life * 0.7) {
                    spec.healthColor = "green";
                    spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log("green");
                }
                else if (that.health < spec.life * 0.7 && that.health >= spec.life * 0.45) {
                    spec.healthColor = 'yellow';
                    spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log("yellow");
                }
                else if (that.health < spec.life * 0.45 && that.health >= 1) {
                    spec.healthColor = 'red';
                    spec.healthBar = (that.health / spec.life) * 50;
                    //  console.log('red');
                }
                else {
                    that.dead = true;
                    
                     // change to that = undefined when moved to computent creep.update section
                }
            }


            if (xGrid >= 39 && xGrid <= 41) {
                that.reachedGoal = true;
                that.moveForward(elapsedTime);
            }

            
			if (didMoveForward === true) {
				base.update(elapsedTime, true);
			} else if (didMoveBackward === true) {
				base.update(elapsedTime, false);
			}

			
            
			didMoveForward = false;
			didMoveBackward = false;
            
            that.initialDelayTime += elapsedTime;
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
        
        that.moveUp = function(elapsedTime) {
            base.moveUp(elapsedTime);
        };
        
        that.moveDown = function(elapsedTime) {
            base.moveDown(elapsedTime);
        }
		
		return that;
	}
    
    
    return {
        Tower : Tower,
        Base : Base,
        Grid : Grid,
        Creep : Creep,
        AnimatedMoveModel : AnimatedMoveModel,
        AnimatedModel : AnimatedModel,
        reset : reset,
        Bullet : Bullet,
        getCreepMoney : getCreepMoney,
        getCreepPoints : getCreepPoints,
    }
}(towerDefense.graphics, towerDefense.sound, towerDefense.effects));