towerDefense.sound = (function() {

    function initialize() {
        
    }
    
    function sound(src) {
        var that = {};
        that.sound = document.createElement("audio");
        that.sound.src = src;
        that.sound.setAttribute("preload", "auto");
        that.sound.setAttribute("controls", "none");
        that.sound.style.display = "none";
        document.body.appendChild(that.sound);
        
        that.play = function(){
            that.sound.play();
        }
        that.stop = function(){
            that.sound.pause();
        }
        
        return that;
    }
    
    return {
        initialize : initialize,
        sound : sound,
        
    }

}());