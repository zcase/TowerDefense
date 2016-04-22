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
    
    function drawImage(spec) {
        ctx.save();
        
        ctx.translate(spec.center.x, spec.center.y);
        ctx.rotate(spec.rotation);
        ctx.translate(-spec.center.x, -spec.center.y);
        
        ctx.drawImage(
            spec.image,
            spec.center.x - spec.size/2,
            spec.center.y - spec.size/2,
            spec.size,
            spec.size
        );
        
        ctx.restore();
    }
    
    //------------------------------------------------------------------
	//
	// Simple sprite, one image in the texture.
	//
	//------------------------------------------------------------------
	function TowerSprite(spec) {
		var that = {},
			image = new Image();

		//
		// Load the image, set the ready flag once it is loaded so that
		// rendering can begin.
		image.onload = function() {
			//
			// Our clever trick, replace the draw function once the image is loaded...no if statements!
			that.draw = function(updateSpec) {
                spec = updateSpec;
                var divisor = 8;
				ctx.save();

				ctx.translate(spec.center.x, spec.center.y);
				ctx.rotate(spec.rotation);
				ctx.translate(-spec.center.x, -spec.center.y);

				//
				// Pick the selected sprite from the sprite sheet to render
				ctx.drawImage(
					image,
					spec.center.x - (image.width/divisor) / 2,
					spec.center.y - (image.height/divisor) / 2,
					image.width/divisor, image.height/divisor);

				ctx.restore();
			};
			//
			// Once the image is loaded, we can compute the height and width based upon
			// what we know of the image and the number of sprites in the sheet.
			spec.height = image.height;
			spec.width = image.width / spec.spriteCount;
		};
		image.src = spec.sprite;

		that.rotateRight = function(angle) {
			spec.rotation += angle;
		};

		that.rotateLeft = function(angle) {
			spec.rotation -= angle;
		}

		//------------------------------------------------------------------
		//
		// Render the correct sprint from the sprite sheet
		//
		//------------------------------------------------------------------
		that.draw = function(updateSpec) {
            
            spec = updateSpec;
			//
			// Starts out empty, but gets replaced once the image is loaded!
		};

		//
		// The other side of that hack job
		that.drawArc = function(angle) {
			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			ctx.beginPath();
			ctx.moveTo(spec.center.x, spec.center.y);
			ctx.arc(spec.center.x, spec.center.y, 100, spec.rotation - angle / 2, spec.rotation + angle / 2);
			ctx.lineTo(spec.center.x, spec.center.y);
			ctx.fill();
		}

		return that;
	}
    
    

    //************************************************************
    //                    Creep Graphics Area
    //************************************************************
    function drawCreepBasic(spec) {
        ctx.save();

        ctx.translate(spec.x, spec.y);
        // ctx.rotate(spec.rotation);
        ctx.translate(-spec.x, -spec.y);

        ctx.drawImage (
            spec.image,
            // spec.width * spec.sprite,
            spec.x - spec.width/2,
            spec.y - spec.height/2,
            // spec.y - 10,
            spec.width,
            spec.height);

        ctx.restore();
    }
    
    // Draws the moving creeps
    function drawCreep(spec) {
        var that = {},
            image = new Image();
            console.log("Width: ", spec.width, " Height: ", spec.height);

        //
        // Initialize the animation of the spritesheet
        spec.sprite = 0;		// Which sprite to start with
        spec.elapsedTime = 0;	// How much time has occured in the animation
        // spec.percent_of_size = 1;
        
        //
        // Load the image, set the ready flag once it is loaded so that
        // rendering can begin.
        image.onload = function() {
            //
            // Our clever trick, replace the draw function once the image is loaded...no if statements!
            that.draw = function() {
                ctx.save();

                ctx.translate(spec.center.x, spec.center.y);
                ctx.rotate(spec.rotation);
                ctx.translate(-spec.center.x, -spec.center.y);

                //
                // Pick the selected sprite from the sprite sheet to render
                ctx.drawImage(
                    image,
                    spec.width * spec.sprite, 0,	// Which sprite to pick out
                    spec.width, spec.height,		// The size of the sprite
                    spec.center.x - spec.width / 2,	// Where to draw the sprite
                    spec.center.y - spec.height / 2,
                    spec.width, spec.height);

                ctx.restore();
            };
            console.log("Graphics: ", spec.width);
            //
            // Once the image is loaded, we can compute the height and width based upon
            // what we know of the image and the number of sprites in the sheet.
            spec.height = image.height;
            spec.width = image.width / spec.spriteCount;
            console.log("checking size: ",image.width);
        };
        image.src = spec.spriteSheet;

        //------------------------------------------------------------------
        //
        // Update the animation of the sprite based upon elapsed time.
        //
        //------------------------------------------------------------------
        that.update = function(elapsedTime, forward) {
            spec.elapsedTime += elapsedTime;
            //
            // Check to see if we should update the animation frame
            if (spec.elapsedTime >= spec.spriteTime[spec.sprite]) {
                //
                // When switching sprites, keep the leftover time because
                // it needs to be accounted for the next sprite animation frame.
                spec.elapsedTime -= spec.spriteTime[spec.sprite];
                //
                // Depending upon the direction of the animation...
                if (forward === true) {
                    spec.sprite += 1;
                    //
                    // This provides wrap around from the last back to the first sprite
                    spec.sprite = spec.sprite % spec.spriteCount;
                } else {
                    spec.sprite -= 1;
                    //
                    // This provides wrap around from the first to the last sprite
                    if (spec.sprite < 0) {
                        spec.sprite = spec.spriteCount - 1;
                    }
                }
            }
        };

        //------------------------------------------------------------------
        //
        // Render the correct sprint from the sprite sheet
        //
        //------------------------------------------------------------------
        that.draw = function() {
            //
            // Starts out empty, but gets replaced once the image is loaded!
        };

        return that;
    }
    
    function popUpScore(spec) {
        // ctx.save();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'rgba(0,0,255,1)';
        ctx.fillText (spec.score, spec.x*20, spec.y*20);
    }
    
    function drawHealthBar(spec){
        // ctx.save()
        ctx.beginPath();
        if (spec.healthColor === 'green'){
            ctx.fillStyle = 'rgba(80,80,80,0.4)';
            ctx.fillRect(spec.x, spec.y, 50, 8);
            ctx.fillStyle = 'rgba(0, 255, 0, 1)';
            ctx.fillRect(spec.x, spec.y, 50*spec.percent, 8);
            ctx.strokeStyle = 'rgba(80,80,80,1)';
        }
        else if (spec.healthColor === 'yellow'){
            ctx.fillStyle = 'rgba(80,80,80,0.4)';
            ctx.fillRect(spec.x, spec.y, 50, 8);
            ctx.fillStyle = 'rgba(255,255,0,1)';
            ctx.fillRect(spec.x, spec.y, 50*spec.percent, 8);
            ctx.strokeStyle = 'rgba(80,80,80,1)';
        }
        else if (spec.healthColor === 'red'){
            ctx.fillStyle = 'rgba(80,80,80,0.4)';
            ctx.fillRect(spec.x, spec.y, 50, 8);
            ctx.fillStyle = 'rgba(255, 0, 0, 1)';
            ctx.fillRect(spec.x, spec.y, 50*spec.percent, 8);
            ctx.strokeStyle = 'rgba(80,80,80,1)';
        }
        else if (spec.healthColor === 'visiable'){
            ctx.fillStyle = 'rgba(80,80,80,0)';
            ctx.fillRect(spec.x, spec.y, 50, 8);
            ctx.fillStyle = 'rgba(0,0,0,0)';
            ctx.fillRect(spec.x, spec.y, 50*spec.percent, 8);
            ctx.strokeStyle = 'rgba(80,80,80,0)';
        }
  
        ctx.fillRect(spec.x, spec.y, spec.healthBar, 8);
        ctx.strokeRect(spec.x, spec.y, 50, 8);
        ctx.fill();
        // ctx.closePath();
        // ctx.restore();
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

        if (spec.positionColor === 'red') {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // Red, Green, Blue, Alpha  
        } else {
            ctx.fillStyle = 'rgba(0, 0, 255, 0.3)'; // Red, Green, Blue, Alpha
        }

        ctx.arc(spec.x, spec.y, spec.attackDistance, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }


    /**
     * 
     * Draws a Tower location
     * 
     */
    function drawTowerLocation(spec) {
        ctx.beginPath();

        if (spec.positionColor === 'red') {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Red, Green, Blue, Alpha
        }
        else if (spec.positionColor === 'green') {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)'; // Red, Green, Blue, Alpha
        }

        ctx.fillRect(spec.x - spec.width / 2, spec.y - spec.height / 2, spec.width, spec.height);
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

        if (spec.isSelected === true) {
            drawTowerRange(spec);
            drawTowerLocation(spec);
        }
        
        ctx.save();

        ctx.translate(spec.x, spec.y);
        ctx.rotate(spec.rotation);
        ctx.translate(-spec.x, -spec.y);

        ctx.drawImage(
            spec.image,
            spec.x - (spec.width * spec.scalar) / 2 + 1,
            spec.y - ((spec.height * spec.scalar) / 2) - 1,
            spec.width * spec.scalar,
            spec.height * spec.scalar);

        ctx.restore();
    }
    
    function drawArc(spec, angle) {
			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
			ctx.beginPath();
			ctx.moveTo(spec.center.x, spec.center.y);
			ctx.arc(spec.center.x, spec.center.y, 100, spec.rotation - angle / 2, spec.rotation + angle / 2);
			ctx.lineTo(spec.center.x, spec.center.y);
			ctx.fill();
		}


    function drawCircleBullet(spec) {
        ctx.clearRect(spec.x-spec.radius + 10, spec.y-spec.radius/2 + 10, spec.radius, spec.radius)
        ctx.fillStyle = spec.color;
        ctx.beginPath();
        ctx.arc(spec.x, spec.y, spec.radius, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    
    


    //************************************************************
    //                    Grid Graphics Area
    //************************************************************

    /**
     * Draws the grid of game
     */
    function drawGrid(spec) {
        for (var i = 0; i < spec.width; i++) {
            for (var j = 0; j < spec.height; j++) {
                var tile = spec.grid[i][j];

                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.1)';
                    }
                    else {
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.5)';
                    }

                } else {
                    if (j % 2 === 0) {
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.5)';
                    }
                    else {
                        ctx.fillStyle = 'rgba(235, 235, 235, 0.1)';
                    }

                }
                
                // ctx.fillStyle = 'red';
                // ctx.fillRect(i*tile.row, j*tile.col, spec.tilesize, spec.tilesize);
                ctx.fillRect(i*spec.tilesize, j*spec.tilesize, spec.tilesize, spec.tilesize);
                // ctx.strokeRect(i* spec.tilesize*2, j * spec.tilesize*2, spec.tilesize*2, spec.tilesize*2);
            }
        }
    }



    //************************************************************
    //                    Return Area
    //************************************************************
    return {
        clear: clear,
        drawTower: drawTower,
        width: width,
        height: height,
        drawGrid: drawGrid,
        drawCreep: drawCreep,
        drawCreepBasic : drawCreepBasic,
        drawHealthBar : drawHealthBar,
        TowerSprite : TowerSprite,
        drawArc : drawArc,
        popUpScore : popUpScore,
        drawCircleBullet : drawCircleBullet,
        drawImage : drawImage,
        
    }

} ());