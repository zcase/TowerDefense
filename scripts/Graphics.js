towerDefense.graphics = (function() {
    
    //************************************************************
    //                    Canvas Area
    //************************************************************
    
    /**
     *  Canvas elements
     */
    var canvas = document.getElementById('myCanvas'),
        ctx = canvas.getContext('2d');
    
    /**
     * Returns the width of canvas
     */
    function width() {
        return canvas.width;
    }
    
    /**
     * Returns height of canvas
     */
    function height() {
        return canvas.height;
    }
    
    /**
     * 
     *  Creates a prototype that allows us to use clear as a fuction
     * 
     */    
    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, canvas.width, canvas.height);
        this.restore();
    };
    
    /**
     *  clears the canvas
     */
    function clear() {
        ctx.clear();
    }
    
    //************************************************************
    //                    Creep Graphics Area
    //************************************************************
    function drawCreep(spec) {
        ctx.save();
        
        ctx.translate(spec.x, spec.y);
        // ctx.rotate(spec.rotation);
        ctx.translate(-spec.x, -spec.y);
        
        ctx.drawImage (
            spec.image,
            spec.x - spec.width/2,
            spec.y - spec.height/2,
            spec.width,
            spec.height);
        
        ctx.restore();
    }
    
    
    //************************************************************
    //                    Tower Graphics Area
    //************************************************************
    
    /**
     * 
     *  Draws the attack area
     * 
     */
    function drawTowerRange(spec) {
        ctx.beginPath();
        
        if(spec.positionColor === 'red'){
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Red, Green, Blue, Alpha  
        }else {
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Red, Green, Blue, Alpha
        }
        
        
      
        ctx.arc(spec.x, spec.y, spec.attackDistance, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    
    
    /**
     * 
     * Draws a Tower location
     * 
     */
    function drawTowerLocation(spec){
        ctx.beginPath();
        
        if(spec.positionColor === 'red'){
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red, Green, Blue, Alpha
        }
        else if(spec.positionColor === 'green') {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Red, Green, Blue, Alpha
        }
        
        ctx.fillRect(spec.x- spec.width/2, spec.y-spec.height/2, spec.width, spec.height);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    
    /**
     * 
     * Draws a Tower
     * 
     */
    
    function drawTower(spec) {
        
        if(spec.isSelected === true){
            drawTowerRange(spec);
            drawTowerLocation(spec);
        }
        
        
        ctx.save();
        
        ctx.translate(spec.x, spec.y);
        ctx.rotate(spec.rotation);
        ctx.translate(-spec.x, -spec.y);
        
        ctx.drawImage (
            spec.image,
            spec.x - spec.width/2,
            spec.y - spec.height/2,
            spec.width,
            spec.height);
        
        ctx.restore();
    }
    
    
    
    //************************************************************
    //                    Grid Graphics Area
    //************************************************************
    
    /**
     * Draws the grid of game
     */
    function drawGrid(spec) {
        for(var i = 0; i < spec.width; i++) {
            for(var j = 0; j < spec.height; j++){
                var tile = spec.grid[i][j];
                
                if(i % 2 === 0){
                    if (j % 2 === 0){
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.1)';
                    }
                    else{
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.5)';
                    }
                    
                }else {
                    if (j % 2 === 0){
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.5)';
                    }
                    else{
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.1)';
                    }
                    
                }
                
                ctx.fillRect(i*spec.tilesize, j*spec.tilesize, spec.tilesize, spec.tilesize);
                ctx.strokeRect(i* spec.tilesize*2, j * spec.tilesize*2, spec.tilesize*2, spec.tilesize*2);
            }
        }
    }
    
    
    
    //************************************************************
    //                    Return Area
    //************************************************************
    return {
        clear : clear,
        drawTower : drawTower,
        width : width,
        height : height,
        drawGrid : drawGrid,
        drawCreep : drawCreep,
    }
    
}());