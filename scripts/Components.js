towerDefense.components = (function() {
    
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
        };
        return that;
    }
    
    
    function Grid(GridWidth, GridHeight) {
        
        var that = {
            
            numberofCells : 0,
            width : (GridWidth/20) - 1,
            height : GridHeight/20,
            layout : new Array(GridWidth/2),
            filledSpots : [],
            tileSize : 20,
            
        };
        
        for(var i = 0; i < that.width; i++) {
            that.layout[i] = new Array(that.height/2);
            for(var j = 0; j < that.width; j++ ) {
                var cell = gridCell(i, j);
                that.layout[i][j] = cell;
                that.numberofCells++;
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
    //   that.placed = false;
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
      
      that.solveGrid = function(){
          
      };
      
      that.update = function(elapsedTime) {
          that.moveRight(elapsedTime);
      };
        
        
        return that;
    }
    
    
    return {
        Tower : Tower,
        Grid : Grid,
        Creep : Creep,
    }
}());