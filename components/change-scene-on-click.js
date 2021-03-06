AFRAME.registerComponent('scene', {
    schema: {
        sceneNum: {default: 0}
    },

    init: function () {
              
        this.el.addEventListener('click', clickFunction);

        function clickFunction() {            
            var data = this.components.scene.data;
            var sky = document.querySelector('a-sky');

            var scene = scenelist[data.sceneNum];
            sky.setAttribute('src', scene.sceneref);
            sky.setAttribute('phi-start', scene.sceneyrot);
            //Set sky yaw.
            loadPois(scene.tooltips, data);
            loadPorts(scene.transports);

            // Clear captions
            document.querySelector("#captions").setAttribute('value', "");
            clearInterval(sceneTimerControl);
            captionIndex = 0;

            // Stop old sound
            document.querySelector('#sceneNarration').components.sound.stopSound();
            
            globalScene = data.sceneNum;
            globalData = data;
            if (scenePlayed[data.sceneNum] != true)
            {
                scenePlayed[data.sceneNum] = true;
                startNarration(scene.narration);
                loadCaptions();
            }
        }

        function startNarration(narration){
            var narrScene = document.querySelector('#sceneNarration');
            narrScene.setAttribute('sound', {
                'src': narration
            });
            narrScene.components.sound.playSound();
            console.log("THIS IS NARRATION " + narration);
        }
    
        function loadPois(tooltips, data){
            var circles = document.querySelectorAll('a-circle');
            var scene = scenelist[data.sceneNum];
            var pois = document.querySelectorAll('.vidpanel');
            //this is printing out an empty list
            console.log(pois);
            for (var i=0; i< circles.length; i++){
                //circle positions
                circles[i].setAttribute('position', tooltips[i].pos);
                circles[i].setAttribute(('scale'), tooltips[i].scale);
                //vid pannel positions    
                pois[i].setAttribute('position', scene.tooltips[i].vidPos);
                pois[i].setAttribute('material', {
                    src: tooltips[i].videoAsset
                });
                pois[i].setAttribute('sound', {
                    src: tooltips[i].poiNarration
                });
            }
        }
    
        function loadPorts(transports) {
            var boxes = document.querySelectorAll('.model');
            for (var i=0; i< boxes.length; i++){
                //I think we can reuse the same two/three box port objects and just set their data appropriately.
                //As long as we have exactly the same number of boxes in every scene, we need no additional logic.
                boxes[i].setAttribute('position', transports[i].pos);
                boxes[i].setAttribute('scene', 
                    "sceneNum: " + transports[i].sceneIndex);
            }
        }

        function loadCaptions(){
            var text = document.querySelector("#captions");
            var scene = scenelist[globalData.sceneNum];

            // If at end of list
            if (scene.captions.length == captionIndex)
            {
                text.setAttribute('value', "");
                clearInterval(sceneTimerControl);
                captionIndex = 0;
                return;
            }

            text.setAttribute('value', scene.captions[captionIndex].text);
            clearInterval(sceneTimerControl);
            sceneTimerControl = setInterval(loadCaptions, scene.captions[captionIndex].time);
            ++captionIndex;
        }

    }
});