towerDefense.components = (function() {
    var IN = 0;
    var FRONTIER = 1;
    var VISITED = 2;
    
    function reverse(a) {
        var temp = [];
        var count = 0;
        for(var i = a.length-1; i > -1; i--) {
            temp[count] = a[i];
            count++;
        }
        
        return temp;
    }
    
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
                //   return queue.push(that.solveGrid({y : newLocation.distTop, x : newLocation.distLeft}, gameGridObj));
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
    //                    Tower Component Area
    //************************************************************
    function Tower(spec) {
        var that = {},
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
      
      that.rotateRight = function(elapsedTime) {
          spec.rotation += spec.rotateRate * (elapsedTime / 1000);
      };
      
      that.rotateLeft = function(elapsedTime) {
          spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
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
      
      that.image = image,
      that.image2 = image2,
      that.image3 = image3,
      that.strength = spec.strength;
      that.placed = false;
      that.x = spec.x;
      that.y = spec.y;
      that.width = spec.width;
      that.height = spec.height;
      that.attackDistance = spec.attackDistance;
      that.isSelected = true;
      that.rangeColor = 'blue';
      that.inScreen = false;
      that.positionColor = 'green';
      that.cost = spec.cost;
      that.level = spec.level;
      that.inCanvas = spec.inCanvas;
      that.blocking = false;
      that.creepDone = false;
      that.upgradeCost = spec.upgradeCost;
      that.shotX = spec.mx;
      that.shotY = spec.my;
      
      that.update = function(elapsedTime, gameGridObj, creeps, spec) {
          var blocking;
          
          var xPos = Math.floor(that.x);
          var yPos = Math.floor(that.y);
          
          var tempGridPosition = {x : xPos, y : yPos};
         
         if(that.inCanvas === true && xPos >=0 && yPos >= 0 && xPos <= gameGridObj.width && yPos <= gameGridObj.height) { 
            for(var i = 0; i < creeps.length; i++) {
                blocking = creeps[i].checkBlockingPath(gameGridObj, tempGridPosition);
            }
                
            if(blocking === false && creeps.length > 0) {
                // that.positionColor = 'red';
                that.blocking = true;
            } else {
                that.blocking = false;
            }
         }
         
         
         var radian = Math.atan2(that.shotX, that.shotY);
         
         spec.rotateLeft = that.shotX - 20 * Math.cos(radian); 
         spec.rotateLeft = that.shotY - 20 * Math.cos(radian);
      }
  
      that.render = function(graphics) {
          if(ready) {
              graphics.drawTower({
                  image : that.image,
                  x: spec.center.x,
                  y: spec.center.y,
                  width: spec.width,
                  height: spec.height,
                  rotation: spec.rotation,
                  moveRate : spec.moveRate,
                  rotateRate : spec.roatateRate,
                  isSelected : that.isSelected,
                  attackDistance : that.attackDistance,
                  rangeColor : that.rangeColor,
                  positionColor : that.positionColor,
              });
          }
      }
      
      console.log("Components: ",spec.width);
      return that;
    };

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
      
      that.rotateRight = function(elapsedTime) {
          spec.rotation += spec.rotateRate * (elapsedTime / 1000);
      };
      
      that.rotateLeft = function(elapsedTime) {
          spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
      };
      
      that.moveLeft = function(elapsedTime) {
          spec.center.x -= spec.moveRate * (elapsedTime / 1000);
        //   spec.center.x -= spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveRight = function(elapsedTime) {
        spec.center.x += spec.moveRate * (elapsedTime / 1000);
        //   spec.center.x += spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveUp = function(elapsedTime) {
          spec.center.y -= Math.ceil(spec.moveRate * (elapsedTime / 1000))+20;
        // spec.center.y -= spec.moveRate;
        that.x = spec.center.x/20;
        that.y = spec.center.y/20;
      };
      
      that.moveDown = function(elapsedTime) {
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
      that.health = 100;
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
         
   
         if(that.reachedGoal !== true) {
            that.movementStack = solveGrid({x : xGrid, y : yGrid}, tempGameObj);
         
            // TODO reverse array and then pop off end value
            moveStack = reverse(that.movementStack);
            
            if(moveStack !== false){
                var nextMove = moveStack.pop();
                if(nextMove === 'North') {
                    that.moveUp(elapsedTime);
                    // that.moveTo({ x: ((xGrid)*20), y : ((yGrid-1)*20)});
                } else if(nextMove === 'East') {
                    that.moveRight(elapsedTime);
                    // that.moveTo({ x: ((xGrid+1)*20), y : ((yGrid)*20)});
                } else if(nextMove === 'South') {
                    that.moveDown(elapsedTime);
                    // that.moveTo({ x: ((xGrid)*20), y : ((yGrid+1)*20)});
                } else if(nextMove === 'West') {
                    that.moveLeft(elapsedTime);
                    // that.moveTo({ x: ((xGrid-1)*20), y : ((yGrid)*20)});
                } 
            }
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
        

		that.update = function(elapsedTime, gameGridObj) {
            
            var xGrid = Math.floor(spec.center.x/ 20);
         
            var yGrid = Math.floor(spec.center.y / 20); 
         
            var tempGameObj = reset(gameGridObj);

            var moveStack = [];
            
            // console.log("CREEP X: " + xGrid);
            // console.log("CREEP Y: " + yGrid);
            // console.log("\n");
   
            if(that.reachedGoal !== true) {
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
        Grid : Grid,
        Creep : Creep,
        AnimatedMoveModel : AnimatedMoveModel,
        AnimatedModel : AnimatedModel,
        reset : reset,
    }
}());