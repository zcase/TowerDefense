towerDefense.components = (function() {
    var IN = 0;
    var FRONTIER = 1;
    var VISITED = 2;
    
    
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
      };
      
      that.moveRight = function(elapsedTime) {
          spec.center.x += spec.moveRate * (elapsedTime / 1000);
      };
      
      that.moveUp = function(elapsedTime) {
          spec.center.y -= spec.moveRate * (elapsedTime / 1000);
      };
      
      that.moveDown = function(elapsedTime) {
          spec.center.x += spec.moveRate * (elapsedTime / 1000);
      };
      
      that.moveTo = function(center) {
          var myCanvas = document.getElementById('myCanvas');
          
        //   center.x -= myCanvas.offsetLeft;
        //   center.y -= myCanvas.offsetTop;
          spec.center = center;
      };
      
      that.strength = 5;
      that.placed = false;
      that.x = spec.x;
      that.y = spec.y;
      that.width = spec.width;
      that.height = spec.height;
      that.attackDistance = that.width * 2;
      that.isSelected = true;
      that.rangeColor = 'blue';
      that.inScreen = false;
      that.positionColor = 'green';
  
      that.render = function(graphics) {
          if(ready) {
              graphics.drawTower({
                  image : image,
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
      
      return that;
    };
    
    
    //************************************************************
    //                    Creep Component Area
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
      };
      
      that.moveRight = function(elapsedTime) {
          spec.center.x += spec.moveRate * (elapsedTime / 1000);
      };
      
      that.moveUp = function(elapsedTime) {
          spec.center.y -= spec.moveRate * (elapsedTime / 1000);
      };
      
      that.moveDown = function(elapsedTime) {
          spec.center.x += spec.moveRate * (elapsedTime / 1000);
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
      that.attackDistance = that.width * 2;
      that.isSelected = true;
      that.rangeColor = 'blue';
      that.inScreen = false;
      that.positionColor = 'green';
  
      that.render = function(graphics) {
          if(ready) {
              graphics.drawCreep({
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
      
      that.exploreDirection = function (currentLocation, direction, gameGridObj) {
          
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
          
          newLocation.status = that.locationStatus(newLocation, gameGridObj);
          
          if(newLocation.status === 'Valid') {
              gameGridObj.layout[newLocation.distLeft][newLocation.distTop].solvedState = 'Visited';
          }
          
          return newLocation;
      };
      
      // location = {y or col, x or row}
      that.solveGrid = function(startlocation, gameGridObj){
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
              
              var newLocation = that.exploreDirection(currentLocation, 'North', gameGridObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
                //   return queue.push(that.solveGrid({y : newLocation.distTop, x : newLocation.distLeft}, gameGridObj));
              }
              
              var newLocation = that.exploreDirection(currentLocation, 'East', gameGridObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
              
              var newLocation = that.exploreDirection(currentLocation, 'South', gameGridObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
              
              var newLocation = that.exploreDirection(currentLocation, 'West', gameGridObj);
              if(newLocation.status === 'Goal') {
                  return newLocation.path;
              }else if (newLocation.status === 'Valid') {
                  queue.push(newLocation);
              }
          }
          
          return false;
          
      }; // End of Solve Grid
      
      that.locationStatus = function(location, gameGridObj) {
          var gridSize = gameGridObj.layout.length;
          var diffFromTop = location.distTop;
          var diffFromLeft = location.distLeft;
          
          if(location.distLeft < 0 || location.distLeft >= gridSize || location.distTop < 0 || location.distTop >= gameGridObj.height ) {
              return 'Invalid";'
          } else if(gameGridObj.layout[diffFromLeft][diffFromTop].end === true) {
              return 'Goal';
          }else if(gameGridObj.layout[diffFromLeft][diffFromTop].taken === true || gameGridObj.layout[diffFromLeft][diffFromTop].solvedState !== FRONTIER) {
                return 'Blocked';              
          }else {
              return 'Valid';
          }
      };
            
      that.update = function(elapsedTime, gameGridObj) {
        //   that.moveRight(elapsedTime);
         var x = that.x;
         var xGrid = Math.floor(that.x/ 20);
         
         var yGrid = Math.floor(that.y / 20); 
         var y = that.y-20;
         
        //  that.moveTo({x : x, y: y});
        //  that.x = x + 1;
        //  that.y = that.y + 1;     
        
         that.movementStack = that.solveGrid({x : xGrid, y : yGrid}, gameGridObj);
         
         // TODO reverse array and then pop off end value
         
         var nextMove = that.movementStack[that.movementStack.length-1];
         if(nextMove === 'North') {
             spec.moveTo = { x: that.x, y : that.y-1};
         } else if(nextMove === 'East') {
             spec.moveTo = { x: that.x+1, y : that.y};
         } else if(nextMove === 'South') {
             spec.moveTo = { x: that.x, y : that.y+1};
         } else if(nextMove === 'West') {
             spec.moveTo = { x: that.x-1, y : that.y};
         }
      };
        
        
        return that;
    }
    
    
    return {
        Tower : Tower,
        Grid : Grid,
        Creep : Creep,
    }
}());