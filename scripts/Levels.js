towerDefense.levels = (function(components, gameModel) {
    
    
    // Level 1 Waves
    function Wave1(){
        
    }
    
    function Wave2(){
        
    }
    
    function Wave3(){
        
    }
    
    // Level 2 Waves
    function Wave4(){
        
    }
    
    function Wave5(){
        
    }
    
    function Wave6(){
        
    }
    
    // Level 3 Waves
    function Wave7(){
        
    }
    
    function Wave8(){
        
    }
    
    function Wave9(){
        
    }
    
    //********************************************
    //
    //
    //              LEVEL Section 
    //
    //
    //********************************************
    function level1() {
        var that = {};
        that.waitTilNextWave = 2000;
        waves = [];
        
        waves.push(3);
        waves.push(2);
        waves.push(1);
        
        that.update = function(elapsedTime) {
            if(that.waitTilNextWave < 0 && prevWaveCompleted === true) {
                var next = waves.pop();
                switch(next) {
                    case 1:
                        Wave1();
                        break;
                    case 2:
                        Wave2();
                        break;
                    case 3:
                        Wave3();
                        break;
                    default:
                        break;
                }
            } else if(prevWaveCompleted === true) {
                that.waitTilNextWave -= elapsedTime;
            }
        }
        
        return that;
    }
    
    function level2() {
        var that = {};
        that.waitTilNextWave = 2000;
        waves = [];
        
        waves.push(3);
        waves.push(2);
        waves.push(1);
        
        that.update = function(elapsedTime) {
            if(that.waitTilNextWave < 0 && prevWaveCompleted === true) {
                var next = waves.pop();
                switch(next) {
                    case 1:
                        Wave4();
                        break;
                    case 2:
                        Wave5();
                        break;
                    case 3:
                        Wave6();
                        break;
                    default:
                        break;
                }
            } else if(prevWaveCompleted === true) {
                that.waitTilNextWave -= elapsedTime;
            }
        }
        
        return that;
    }
    
    function level3() {
        var that = {};
        that.waitTilNextWave = 2000;
        waves = [];
        
        waves.push(3);
        waves.push(2);
        waves.push(1);
        
        that.update = function(elapsedTime) {
            if(that.waitTilNextWave < 0 && prevWaveCompleted === true) {
                var next = waves.pop();
                switch(next) {
                    case 1:
                        Wave7();
                        break;
                    case 2:
                        Wave8();
                        break;
                    case 3:
                        Wave9();
                        break;
                    default:
                        break;
                }
            } else if(prevWaveCompleted === true) {
                that.waitTilNextWave -= elapsedTime;
            }
        }
        
        return that;
    }



    return  {
        level1 : level1,
        level2 : level2,
        level3 : level3,
        Wave1 : Wave1,
        Wave2 : Wave2,
        Wave3 : Wave3,
        Wave4 : Wave4,
        Wave5 : Wave5,
        Wave6 : Wave6,
        Wave7 : Wave7,
        Wave8 : Wave8,
        Wave9 : Wave9,
    }


}(towerDefense.components, towerDefense.model));