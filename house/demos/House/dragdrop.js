/*!
 * 3D Roam Demo 
 * Johnny Xu(徐景周) - v1.0.0 (2017-08-30)
 * https://github.com/xujingzhou | Released under MIT license
 */

var CreateDragDropTestScene = function (engine) {

    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(20, 100, 250));

//    camera.lowerBetaLimit = 0.1;
//    camera.upperBetaLimit = (Math.PI / 2) * 0.99;
//    camera.lowerRadiusLimit = 150;


    // Light
    var light = new BABYLON.PointLight("omni", new BABYLON.Vector3(500, 500, 500), scene);

    // Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene, false);
	var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
	groundMaterial.diffuseTexture = new BABYLON.Texture("../../Assets/grass.jpg", scene);
	groundMaterial.diffuseTexture.uScale = 4;
	groundMaterial.diffuseTexture.vScale = 4;
	groundMaterial.backFaceCulling = true;
	ground.material = groundMaterial;

    // Meshes
	BABYLON.SceneLoader.ImportMesh("", "../../model/", "111.obj", scene, function(newMeshes, particleSystems) {

			camera.target = newMeshes[0];

			newMeshes[0].scaling = new BABYLON.Vector3(0.08, 0.08, 0.08);
			newMeshes[0].rotation = new BABYLON.Vector3(-Math.PI/2, -Math.PI/2, -Math.PI);
			newMeshes[0].setPosition(new BABYLON.Vector3(20, 100, 20));
		});


    // Events
    var canvas = engine.getRenderingCanvas();
    var startingPoint;
    var currentMesh;

    var getGroundPosition = function (evt) {
        // Use a predicate to get position on the ground
        var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
        if (pickinfo.hit) {
            return pickinfo.pickedPoint;
        }

        return null;
    }

    var onPointerDown = function (evt) {
        if (evt.button !== 0) {
            return;
        }

        // check if we are under a mesh
        var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh !== ground; });
        if (pickInfo.hit) {
            currentMesh = pickInfo.pickedMesh;
            startingPoint = getGroundPosition(evt);

            if (startingPoint) { // we need to disconnect camera from canvas
                setTimeout(function () {
                    camera.detachControl(canvas);
                }, 0);
            }
        }
    }

    var onPointerUp = function () {
        if (startingPoint) {
            camera.attachControl(canvas);
            startingPoint = null;
            return;
        }
    }

    var onPointerMove = function (evt) {
        if (!startingPoint) {
            return;
        }

        var current = getGroundPosition(evt);

        if (!current) {
            return;
        }

        var diff = current.subtract(startingPoint);
        currentMesh.position.addInPlace(diff);

        startingPoint = current;

    }

    canvas.addEventListener("pointerdown", onPointerDown, false);
    canvas.addEventListener("pointerup", onPointerUp, false);
    canvas.addEventListener("pointermove", onPointerMove, false);

    scene.onDispose = function () {
        canvas.removeEventListener("pointerdown", onPointerDown);
        canvas.removeEventListener("pointerup", onPointerUp);
        canvas.removeEventListener("pointermove", onPointerMove);
    }

    return scene;
};