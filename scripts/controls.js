towerDefense.controls = (function(input, screens, gameModel) {
    var keys = [];
    var controls = input.Keyboard();
    var captureInfo = {};
    var shortcuts = {upgrade : [KeyEvent.DOM_VK_U], sell : [KeyEvent.DOM_VK_S], start : [KeyEvent.DOM_VK_G]};
    
    function capture(shortcutKind) {
        
        captureInfo.startCapture = true;
        captureInfo.shortcut = shortcutKind;
        captureInfo.shortcutControls = shortcuts;
    }
    
    // function keyPressCapture(e) {
        
    //     var captureStuff = getCaptureInfo();
        
    //     if(captureStuff.startCapture = true) {
    //         keys.push(e.keyCode);
    //     }
    // }
    
    // function keyReleaseCapture(e) {
    //     for(var i = 0; i < keys.length; i++) {
    //        if(captureInfo.shortcut === 'upgrade'){
    //           if(keys[i] !== captureInfo.shortcutControls.upgrade) {
    //               captureInfo.shortcutControls.upgrade = keys;
    //               break;
    //           }
    //        }
               
    //        if(captureInfo.shortcut === 'sell'){
    //            if(keys[i] !== captureInfo.shortcutControls.sell) {
    //               captureInfo.shortcutControls.sell = keys;
    //               break;
    //            }
    //        }
               
    //        if(captureInfo.shortcut === 'start'){
    //           if(keys[i] !== captureInfo.shortcutControls.start) {
    //               captureInfo.shortcutControls.start = keys;
    //               break;
    //            }
    //        }
    //      }
         
    //      screens.showScreen('controlsScreen');
    // }
    
    function setControls(spec){
        shortcuts = spec;
    }
    
    function getControls() {
        return shortcuts;
    }
    
    function getCaptureInfo() {
        return captureInfo;
    }


    return {
        getControls : getControls,
        capture : capture,
        getCaptureInfo : getCaptureInfo,
        // keyPressCapture : keyPressCapture,
        // keyReleaseCapture : keyReleaseCapture,
    }

}(towerDefense.input, towerDefense.screens, towerDefense.model));