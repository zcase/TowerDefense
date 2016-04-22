window.addEventListener('load', function(){
    console.log('Loading....');
    Modernizr.load([
        {
            load : [
                'preload!scripts/AboutScreen.js',
                'preload!scripts/Components.js',
                'preload!scripts/ControlScreen.js',
                'preload!scripts/effects.js',
                'preload!scripts/GameScreen.js',
                'preload!scripts/Graphics.js',
                'preload!scripts/HighScoresScreen.js',
                'preload!scripts/input.js',
                'preload!scripts/MainMenuScreen.js',
                'preload!scripts/Model.js',
                'preload!scripts/random.js',
                'preload!scripts/screens.js',
                'preload!scripts/Sound.js',
                'preload!images/base1.png',
                'preload!images/base2.png',
                'preload!images/base3.png',
                'preload!images/blood.png',
                'preload!images/bossSprite.png',
                'preload!images/bullet.png',
                'preload!images/cannon.png',
                'preload!images/cannon1or2.png',
                'preload!images/cannon3.png',
                'preload!images/cannonBall.png',
                'preload!images/cannonBase1.png',
                'preload!images/cannonBase2.png',
                'preload!images/cannonBase3.png',
                'preload!images/drangonSprite.png',
                'preload!images/fire.png',
                'preload!images/gun.png',
                'preload!images/gun1.png',
                'preload!images/gun2.png',
                'preload!images/gun3.png',
                'preload!images/missile.png',
                'preload!images/missile1.png',
                'preload!images/missile2.png',
                'preload!images/missile3.png',
                'preload!images/tower.png',
                'preload!images/tower1.png',
                'preload!images/tower2or3.png',
                'preload!images/towerRoof1.png',
                'preload!images/towerRoof2.png',
                'preload!images/towerRoof3.png',
                'preload!images/naziSprite.png',
                'preload!images/personSprite.png',
                'preload!images/smoke.png',
                'preload!images/USU-Logo.png',
            ],
            complete: function(){
               console.log('All file request for loading...');
            }
        }
    ]);
}, false);

yepnope.addPerfix('preload', function(reso){
    console.log('preloading: ' + reso.url);
    towerDefense.status.preloadRequest += 1;
    var isImage = /.+\.(jpg|png|gif)$/i.test(reso.url);
    reso.noexec = isImage;
    // reso.
    
})
