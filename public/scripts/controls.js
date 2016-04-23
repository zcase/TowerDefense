towerDefense.controls = (function(input, screens, gameModel) {
    var keys = [];
    // var controls = input.Keyboard();
    var captureInfo = {};
    var shortcuts = {upgrade : [KeyEvent.DOM_VK_U], sell : [KeyEvent.DOM_VK_S], start : [KeyEvent.DOM_VK_G]};
    
    function capture(shortcutKind) {
        
        captureInfo.startCapture = true;
        captureInfo.shortcut = shortcutKind;
        captureInfo.shortcutControls = shortcuts;
    }
    
    function setShortCutControls(spec){
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
        setShortCutControls : setShortCutControls,
        // keyPressCapture : keyPressCapture,
        // keyReleaseCapture : keyReleaseCapture,
    }

}(towerDefense.input, towerDefense.screens, towerDefense.model));