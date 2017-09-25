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
var engine = new BABYLON.Engine(canvas, true);
var scene;

var previousPickedMesh;
var onPointerDown = function (evt, pickResult) {
    if (!panelIsClosed) {
        panelIsClosed = true;
        controlPanel.style.webkitTransform = "translateY(100px)";
        controlPanel.style.transform = "translateY(100px)";
    }

    if (pickResult.hit) {
        if (evt.ctrlKey) {
            status.innerHTML = "Selected object: " + pickResult.pickedMesh.name + "(" + pickResult.pickedPoint.x + "," + pickResult.pickedPoint.y + "," + pickResult.pickedPoint.z + ")";

            if (previousPickedMesh) {
                previousPickedMesh.showBoundingBox = false;
            }

            pickResult.pickedMesh.showBoundingBox = true;

            // Emit particles
            var particleSystem = new BABYLON.ParticleSystem("particles", 400, scene);
            particleSystem.particleTexture = new BABYLON.Texture("Assets/Flare.png", scene);
            particleSystem.minAngularSpeed = -0.5;
            particleSystem.maxAngularSpeed = 0.5;
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
            particleSystem.minLifeTime = 0.5;
            particleSystem.maxLifeTime = 2.0;
            particleSystem.minEmitPower = 0.5;
            particleSystem.maxEmitPower = 1.0;
            particleSystem.emitter = pickResult.pickedPoint;
            particleSystem.emitRate = 400;
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
            particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
            particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
            particleSystem.direction1 = new BABYLON.Vector3(-1, -1, -1);
            particleSystem.direction2 = new BABYLON.Vector3(1, 1, 1);
            particleSystem.color1 = new BABYLON.Color4(1, 0, 0, 1);
            particleSystem.color2 = new BABYLON.Color4(0, 1, 1, 1);
            particleSystem.gravity = new BABYLON.Vector3(0, -5, 0);
            particleSystem.disposeOnStop = true;
            particleSystem.targetStopDuration = 0.1;
            particleSystem.start();

            previousPickedMesh = pickResult.pickedMesh;

        } else {
            var dir = pickResult.pickedPoint.subtract(scene.activeCamera.position);
            dir.normalize();
            pickResult.pickedMesh.applyImpulse(dir.scale(10), pickResult.pickedPoint);
            status.innerHTML = "";
        }
    }
};

var loadScene = function (name, incremental, sceneLocation, then) {
    sceneChecked = false;

    BABYLON.SceneLoader.ForceFullSceneLoadingForIncremental = true;

    engine.resize();

    var dlCount = 0;
    BABYLON.SceneLoader.Load(sceneLocation + name + "/", name + incremental + ".babylon", engine, function (newScene) {
        scene = newScene;
        scene.executeWhenReady(function () {
            canvas.style.opacity = 1;
            if (scene.activeCamera) {
                scene.activeCamera.attachControl(canvas);

                if (newScene.activeCamera.keysUp) {
                    newScene.activeCamera.keysUp.push(90); // Z
                    newScene.activeCamera.keysUp.push(87); // W
                    newScene.activeCamera.keysDown.push(83); // S
                    newScene.activeCamera.keysLeft.push(65); // A
                    newScene.activeCamera.keysLeft.push(81); // Q
                    newScene.activeCamera.keysRight.push(69); // E
                    newScene.activeCamera.keysRight.push(68); // D
                }
            }

            if (then) {
                then();
            }

        });

    }, function (evt) {
        if (evt.lengthComputable) {
            engine.loadingUIText = "正在载入，请稍等... " + (evt.loaded * 100 / evt.total).toFixed() + "%";
        } else {
            dlCount = evt.loaded / (1024 * 1024);
            engine.loadingUIText = "正在载入，请稍等... " + Math.floor(dlCount * 100.0) / 100.0 + "MB已经完成";
        }
    });

    canvas.style.opacity = 0;
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

        scene.render();

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
        controlPanel.style.webkitTransform = "translateY(100px)";
        controlPanel.style.transform = "translateY(100px)";
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
    if (window.location.hostname.indexOf("localhost") === -1 && !demo.forceLocal) {
        if (demo.doNotUseCDN) {
            
        }
        else {
            sceneLocation = "/Scenes/";
        }
    }

    var mode = "";

    if (demo.incremental) {
        mode = ".incremental";
    } else if (demo.binary) {
        mode = ".binary";
    }

    if (demo.offline) {
        engine.enableOfflineSupport = true;
    }
    else {
        engine.enableOfflineSupport = false;
    }

    loadScene(demo.scene, mode, sceneLocation, function () {
        BABYLON.StandardMaterial.BumpTextureEnabled = true;
        if (demo.collisions !== undefined) {
            scene.collisionsEnabled = demo.collisions;
        }

        if (demo.onload) {
            demo.onload();
        }

        for (var index = 0; index < scene.cameras.length; index++) {
            var camera = scene.cameras[index];
            var option = new Option();
            option.text = camera.name;
            option.value = camera;

            if (camera === scene.activeCamera) {
                option.selected = true;
            }

            //camerasList.appendChild(option);
        }
    });
};