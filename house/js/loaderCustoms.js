/*!
 * 3D Roam Demo 
 * Johnny Xu(徐景周) - v1.0.0 (2017-08-30)
 * https://github.com/xujingzhou | Released under MIT license
 */

var canvas = document.getElementById("renderCanvas");

// UI
var controlPanel = document.getElementById("controlPanel");
var status = document.getElementById("status");
var fullscreen = document.getElementById("fullscreen");

var sceneChecked;
var sceneLocation = "../../Scenes/";

// Babylon
var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene;

var previousPickedMesh;
var loadCustomScene = function (demoConstructor, then) {
    BABYLON.SceneLoader.ShowLoadingScreen = false;
    engine.displayLoadingUI();

    setTimeout(function () {
        scene = demoConstructor(engine);

        if (scene.activeCamera) {
            scene.activeCamera.attachControl(canvas, false);
        }

        scene.executeWhenReady(function () {
            canvas.style.opacity = 1;
            engine.hideLoadingUI();
            BABYLON.SceneLoader.ShowLoadingScreen = true;
            if (then) {
                then(scene);
            }

//            for (var index = 0; index < scene.cameras.length; index++) {
//                var camera = scene.cameras[index];
//                var option = new Option();
//                option.text = camera.name;
//                option.value = camera;
//
//                if (camera === scene.activeCamera) {
//                    option.selected = true;
//                }
//
//                //camerasList.appendChild(option);
//            }
        });
    }, 15);

    return;
};

// Render loop
var renderFunction = function () {

    // Render scene
    if (scene) {
        if (!sceneChecked) {
            var remaining = scene.getWaitingItemsCount();
            engine.loadingUIText = "正在处理... " + (remaining ? (remaining + "个") : "");

            if (remaining === 0) {
                sceneChecked = true;
            }            
        }

        if (scene.activeCamera) {
            scene.render();
        }

        // Streams
        if (scene.useDelayedTextureLoading) {
            var waiting = scene.getWaitingItemsCount();
            if (waiting > 0) {
                status.innerHTML = "正在处理... " + waiting;
            } else {
                status.innerHTML = "";
            }
        }
    }
};

// Launch render loop
engine.runRenderLoop(renderFunction);

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

// UI
var panelIsClosed = true;
var cameraPanelIsClosed = true;
var aboutIsClosed = true;
document.getElementById("clickableTag").addEventListener("click", function () {
    if (panelIsClosed) {
        panelIsClosed = false;
        controlPanel.style.webkitTransform = "translateY(0px)";
        controlPanel.style.transform = "translateY(0px)";
    } else {
        panelIsClosed = true;
        controlPanel.style.webkitTransform = "translateY(70px)"; // "translateY(100px)";
        controlPanel.style.transform = "translateY(70px)"; // "translateY(100px)";
    }
});

document.getElementById("notSupported").addEventListener("click", function () {
    document.getElementById("notSupported").className = "hidden";
});

fullscreen.addEventListener("click", function () {
    if (engine) {
        engine.switchFullscreen(true);
    }
});

// Check support
if (!BABYLON.Engine.isSupported()) {
    document.getElementById("notSupported").className = "";
} else {
    loadCustomScene(demo.constructor, demo.onload);
};