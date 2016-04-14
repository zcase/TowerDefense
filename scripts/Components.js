towerDefense.components = (function(graphics) {
    var IN = 0;
    var FRONTIER = 1;
    var VISITED = 2;
    
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
      };
      
      image.src = spec.image;
      image2.src = spec.image2;
      image3.src = spec.image3;
      
    //   that.rotateRight = function(elapsedTime) {
    //       spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    //   };
      
    //   that.rotateLeft = function(elapsedTime) {
    //       spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    //   };
    
      that.rotateRight = function(angle) {
          spec.rotation += angle;
      };
      
      that.rotateLeft = function(angle) {
          spec.rotation -= angle;
      };
      
    //   that.moveLeft = function(elapsedTime) {
    //       spec.center.x -= spec.moveRate * (elapsedTime / 1000);
    //   };
      
    //   that.moveRight = function(elapsedTime) {
    //       spec.center.x += spec.moveRate * (elapsedTime / 1000);
    //   };
      
    //   that.moveUp = function(elapsedTime) {
    //       spec.center.y -= spec.moveRate * (elapsedTime / 1000);
    //   };
      
    //   that.moveDown = function(elapsedTime) {
    //       spec.center.x += spec.moveRate * (elapsedTime / 1000);
    //   };
      
      that.moveTo = function(center) {
          var myCanvas = document.getElementById('myCanvas');
          
        //   center.x -= myCanvas.offsetLeft;
        //   center.y -= myCanvas.offsetTop;
          spec.center = center;
      };
      
      spec.rotation = 89.8;
      that.center = spec.center;
      spec.placed = false;
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
      that.blocking = false;                // Tells if the tower is blocking a path from creep entrance to creep exit.
      that.creepDone = false;               // MAY NEED TO REMVOE CHECK OTHER CODE FIRST
      that.upgradeCost = spec.upgradeCost;  // The cost to upgrade the tower.
      that.shotX = spec.mx;                 
      that.shotY = spec.my;
      
      // Updates the tower object.
      that.update = function(elapsedTime, gameGridObj, creeps) {
          var blocking;
          
          var xPos = Math.floor(that.x);
          var yPos = Math.floor(that.y);
          
          var tempGridPosition = {x : xPos, y : yPos};
         
         if(that.inCanvas === true && xPos >=0 && yPos >= 0 && xPos <= gameGridObj.width && yPos <= gameGridObj.height) { 
            for(var i = 0; i < creeps.length; i++) {
                blocking = creeps[i].checkBlockingPath(gameGridObj, tempGridPosition);
            }
                
            if(blocking === false && creeps.length > 0) {
                that.blocking = true;
            } else {
                that.blocking = false;
            }
            
            if(that.placed === true) {
                var inFrontTowerX,
                    behindTowerX,
                    aboveTowerY,
                    belowTowerY;
                for(var i = 0; i < creeps.length; i++) {
                    inFrontTowerX = (that.x - that.attackDistance/40);
                    behindTowerX = (that.x + that.attackDistance/40);
                    
                    aboveTowerY = (that.y - that.attackDistance/40);
                    belowTowerY = (that.x + that.attackDistance/40);
                    
                    if((creeps[i].x >= inFrontTowerX && creeps[i].x <= behindTowerX) || (creeps[i].y >= aboveTowerY && creeps[i].y <= belowTowerY) ){
                        that.setTarget(creeps[i].x*20, creeps[i].y*20);
                    } else {
                        that. setTarget(0, 300);
                    }
                }
                
                
                
                
                
                var result = computeAngle(spec.rotation, that.center, that.target);
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
            }
            
            
         }
         
         
        //  var radian = Math.atan2(that.shotX, that.shotY);
         
        //  spec.rotateLeft = that.shotX - 20 * Math.cos(radian); 
        //  spec.rotateLeft = that.shotY - 20 * Math.cos(radian);
      }; // END TOWER UPDATE FUNCTION
      
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
              });
          }

          that.image = image;                 // The main image when at Level 1
          that.image2 = image2;                 // The image for Level 2 of tower.
          that.image3 = image3;
          
        // weaponSprite.draw({
        //     image : spec.weaponSprite,
        //     center : spec.center,
        //     width : spec.width,
        //     height : spec.height,
        //     rotation : spec.rotation,
            
        // });
            // graphics.drawArc(spec, .4);
        
      }; //END OF TOWER RENDERING
      
      console.log("Components: ",spec.width);
      return that;
    }; // END OF TOWER COMPONENT
    
    function Base(spec){
        var that = {
            center: spec.center
        },

            ready = false,
            image = new Image(),
            image2 = new Image();
            // image3 = new Image();


        image.onload = function() {
            ready = true;
        };

        that.render = function(graphics) {
            if (ready) {
                graphics.drawTower({
                    image: that.image,
                    x: spec.center.x,
                    y: spec.center.y,
                    width: spec.width,
                    height: spec.height,
                });
            }
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
                  x: spec.center.x-10,
                  y: spec.center.y-10,
                  healthColor : spec.healthColor,
                  healthBar : spec.healthBar,
              });
          }
      };
      
      that.checkPosition = function(width, height, gridObj) {
        if(width < 0  || width >= gridObj.width || height < 0 || height >= gridObj.height){
            return null; // out of bounds
        }
        return gridObj.layout[width][height];
      };
      
      that.getNeighbors = function (Cell, gridObj) {
          var neighbors = {
                North: that.checkPosition(Cell.row, Cell.col-1, gridObj),
                South: that.checkPosition(Cell.row, Cell.col+1, gridObj),
                West: that.checkPosition(Cell.row-1, Cell.col, gridObj),
                East: that.checkPosition(Cell.row+1, Cell.col, gridObj)
            };
    
        return neighbors;
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
      }
            
      that.update = function(elapsedTime, gameGridObj) {
          
         var xGrid = Math.floor(spec.center.x/ 20);
         
         var yGrid = Math.floor(spec.center.y / 20); 
         
         var tempGameObj = reset(gameGridObj);

         var moveStack = [];
         
        //  console.log("CREEP X: " + xGrid);
        //  console.log("CREEP Y: " + yGrid);
        //  console.log("\n");
         
   
         if(that.reachedGoal !== true && that.flying !== true) {
            that.movementStack = solveGrid({x : xGrid, y : yGrid}, tempGameObj);
         
            // TODO reverse array and then pop off end value
            moveStack = reverse(that.movementStack);
            
            
            
            if(moveStack !== false){
                var nextMove = moveStack.pop();
                if(nextMove === 'North') {
                    that.moveUp(elapsedTime, tempGameObj);
                    // that.moveTo({ x: ((xGrid)*20), y : ((yGrid-1)*20)});
                } else if(nextMove === 'East') {
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
         
         if(that.flying === true) {
             that.moveRight(elapsedTime);
         }
         
         if(moveStack.length === 0 && xGrid < 41 && moveStack !==false) {
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
			sprite = graphics.drawCreep(spec);	// We contain a SpriteSheet, not inherited from, big difference
			 console.log("Model: ",sprite.width);
             
        that.x = spec.center.x;
        that.y = spec.center.y;
             
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
            
        that.health = 100;
        that.armor = spec.armor;
        that.flying = spec.flying;

		that.update = function(elapsedTime, gameGridObj) {
            
            var xGrid = Math.floor(spec.center.x/ 20);
         
            var yGrid = Math.floor(spec.center.y / 20); 
         
            var tempGameObj = reset(gameGridObj);

            var moveStack = [];
            
            // console.log("CREEP X: " + xGrid);
            // console.log("CREEP Y: " + yGrid);
            // console.log("\n");
   
            if(that.reachedGoal !== true && that.flying !== true) {
                that.movementStack = solveGrid({x : xGrid, y : yGrid}, tempGameObj);
            
                moveStack = reverse(that.movementStack);
                
                if(moveStack !== false){
                    var nextMove = moveStack.pop();
                    if(nextMove === 'North') {
                        // that.rotateLeft(elapsedTime);
                        // didRotateLeft = true;
                        // that.moveForward(elapsedTime);
                        that.moveUp(elapsedTime);
                        // that.moveForward(elapsedTime);
                        // that.rotateRight(elapsedTime);
                        // that.rotateRight(elapsedTime);
                        // that.moveTo({ x: ((xGrid)*20), y : ((yGrid-1)*20)});
                    } else if(nextMove === 'East') {
                        // if(didRotateLeft === true) {
                        //     that.rotateRight(elapsedTime);
                        //     didRotateLeft = false;
            
                            
                        // } else if (didRotateRight === true) {
                        //     that.rotateLeft(elapsedTime);
                        //     didRotateRight = false;
                        // }
                        
                        that.moveForward(elapsedTime);
                        // that.moveTo({ x: ((xGrid+1)*20), y : ((yGrid)*20)});
                    } else if(nextMove === 'South') {
                        // that.rotateRight(elapsedTime);
                        // didRotateRight = true;
                        // that.moveForward(elapsedTime);
                        that.moveDown(elapsedTime);
                        // that.movseForward(elapsedTime);
                        // that.rotateLeft(elapsedTime);
                        // that.moveTo({ x: ((xGrid)*20), y : ((yGrid+1)*20)});
                    } else if(nextMove === 'West') {
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
            
            if(that.flying === true) {
                that.moveForward(elapsedTime);
            }
            
            
            if(moveStack.length === 0 && xGrid <= 41) {
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
    }
}(towerDefense.graphics));