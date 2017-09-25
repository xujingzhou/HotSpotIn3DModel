/*!
 * 3D Roam Demo 
 * Johnny Xu(徐景周) - v1.0.0 (2017-08-30)
 * https://github.com/xujingzhou | Released under MIT license
 */

// Assets
var models = [{
		name: "1",
		prototype: "11.obj",
		minimap: "11_0.05.obj",
//		babylonLoader: "babylonLoader.html?filename=",
		babylonLoader: "babylonLoader.html",
		video:"video.html",
		raineffect: "water/index.html",
		position: {x: 11, y: -5.5/2, z: -5},
		rotation: {x: -Math.PI/2, y: 0, z: -Math.PI/2},
		scaling: {x: 0.05, y: 0.05, z: 0.05},
		spherePosition: [{x: 12.5, y: -1.9, z: -5}, {x: 11, y: -0.7, z: -4.8}, {x: 10.3, y: -2, z: -5}],
		tooltip: ["主轴转速:490r/min", "气量:150m3/min", "主轴温度:31.9"],
		texture: "../../Assets/sand.jpg",
		meshLabel: [{label:void 0}, {label:void 0}, {label:void 0}],
		meshLine: [{line:void 0}, {line:void 0}, {line:void 0}],
		meshEndRound: [{endRound:void 0}, {endRound:void 0}, {endRound:void 0}],
		hasAlpha: false,
		visible: true,
		isPickable: false
	}, 
	{
		name: "2",
		prototype: "12.obj",
		minimap: "12_0.05.obj",
//		babylonLoader: "babylonLoader_2.html?filename=",
		babylonLoader: "babylonLoader_2.html",
		video:"video.html",
		raineffect: "water/index.html",
		position: {x: 11, y: -5.5/2, z: 0},
		rotation: {x: -Math.PI/2, y: 0, z: -Math.PI/2},
		scaling: {x: 0.05, y: 0.05, z: 0.05},
		spherePosition: [{x: 12.5, y: -1.9, z: 5}, {x: 11, y: -0.7, z: 5.2}, {x: 10.3, y: -2, z: 5}],
		tooltip: ["主轴转速:490r/min", "气量:150m3/min", "主轴温度:31.9"],
		texture: "../../Assets/sand.jpg",
		meshLabel: [{label:void 0}, {label:void 0}, {label:void 0}],
		meshLine: [{line:void 0}, {line:void 0}, {line:void 0}],
		meshEndRound: [{endRound:void 0}, {endRound:void 0}, {endRound:void 0}],
		hasAlpha: false,
		visible: true,
		isPickable: false
	}, 
	{
		name: "3",
		prototype: "13.obj",
		minimap: "13_0.05.obj",
//		babylonLoader: "babylonLoader_3.html?filename=",
		babylonLoader: "babylonLoader_3.html",
		video:"video.html",
		raineffect: "water/index.html",
		position: {x: 11, y: -5.5/2, z: 5},
		rotation: {x: -Math.PI/2, y: 0, z: -Math.PI/2},
		scaling: {x: 0.05, y: 0.05, z: 0.05},
		spherePosition: [{x: 12.5, y: -1.9, z: 15}, {x: 11, y: -0.7, z: 15.2}, {x: 10.3, y: -2, z: 15}],
		tooltip: ["主轴转速:490r/min", "气量:150m3/min", "主轴温度:31.9"],
		texture: "../../Assets/sand.jpg",
		meshLabel: [{label:void 0}, {label:void 0}, {label:void 0}],
		meshLine: [{line:void 0}, {line:void 0}, {line:void 0}],
		meshEndRound: [{endRound:void 0}, {endRound:void 0}, {endRound:void 0}],
		hasAlpha: false,
		visible: true,
		isPickable: false
	}
];

 var configureFur = function (mesh) {
	var fur = new BABYLON.FurMaterial("fur", scene);
	fur.furLength = 0;
	fur.furAngle = 0;
	fur.furColor = new BABYLON.Color3(2, 2, 2);
	fur.diffuseTexture = mesh.material.diffuseTexture;
	fur.furTexture = BABYLON.FurMaterial.GenerateTexture("furTexture", scene);
	fur.furSpacing = 6;
	fur.furDensity = 20;
	fur.furSpeed = 300;
	fur.furGravity = new BABYLON.Vector3(0, -1, 0);

	mesh.material = fur;

	var quality = 30; // It is enougth
	var shells = BABYLON.FurMaterial.FurifyMesh(mesh, quality);

	// Special for bunny (ears)
	for (var i = 0; i < shells.length; i++) {
		shells[i].material.backFaceCulling = false;
	}
}

var createMesh = function (name, width, depth, isPickable, scene, updatable) {
	var plane = new BABYLON.Mesh(name, scene);

	var indices = [];
	var positions = [];
	var normals = [];
	var uvs = [];

	// Vertices
	var halfWidth = width / 2.0;
	var halfDepth = depth / 2.0;

	positions.push(-halfWidth, -halfDepth, 0);
	normals.push(0, 0, -1.0);
	uvs.push(0.0, 0.0);

	positions.push(halfWidth, -halfDepth, 0);
	normals.push(0, 0, -1.0);
	uvs.push(1.0, 0.0);

	positions.push(halfWidth, halfDepth, 0);
	normals.push(0, 0, -1.0);
	uvs.push(1.0, 1.0);

	positions.push(-halfWidth, halfDepth, 0);
	normals.push(0, 0, -1.0);
	uvs.push(0.0, 1.0);

	// Indices
	indices.push(0);
	indices.push(1);
	indices.push(2);

	indices.push(0);
	indices.push(2);
	indices.push(3);

	plane.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions, updatable);
	plane.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals, updatable);
	plane.setVerticesData(BABYLON.VertexBuffer.UVKind, uvs, updatable);
	plane.setIndices(indices);
	plane.isPickable = isPickable;

	return plane;
};

var createText = function (text, textureWidth, backgroundColor, scene) {
	var dynamicTexture = new BABYLON.DynamicTexture('dynamic texture', 1024, scene, true);
	dynamicTexture.uScale = 0.7;
	dynamicTexture.vScale = 0.054;
	dynamicTexture.vOffset = -9;
	dynamicTexture.uOffset = 0.25;
	dynamicTexture.hasAlpha = true;
	dynamicTexture.drawText(text, 3, 26, '23pt', 'white', backgroundColor);

	return dynamicTexture;
};

var createTextMesh = function (name, text, width, height, textureWidth, position, backgroundColor, scene) {
	var textMesh = createMesh(name, width, height, true, scene);

	textMesh.position.x = position.x;
	textMesh.position.y = position.y;
	textMesh.position.z = position.z;

	var textMaterial = new BABYLON.StandardMaterial(name + '-material', scene);
	textMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
	textMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
	textMaterial.diffuseTexture = createText(text, textureWidth, backgroundColor, scene);
	textMaterial.useAlphaFromDiffuseTexture = true;

	textMesh.material = textMaterial;
	return textMesh;
};

var createTextMesh = function(text_mesh, scene){

	text_mesh = BABYLON.Mesh.CreatePlane("Text", 1.0, scene);
	text_mesh.scaling.x = 4.0;
	text_mesh.scaling.y = 0.5;
	text_mesh.position.y = 2.1;
	text_mesh.material = new BABYLON.StandardMaterial("Text", scene);
	text_mesh.material.diffuseTexture = new BABYLON.DynamicTexture("Test", {width: 512, height: 64}, scene, true);
	text_mesh.material.diffuseTexture.hasAlpha = true;
	text_mesh.material.useAlphaFromDiffuseTexture = true;
	text_mesh.material.specularColor = BABYLON.Color3.Black();
	text_mesh.material.emissiveColor = BABYLON.Color3.White();
	text_mesh.material.alpha = 0.0;
	text_mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
}

var drawText = function(text_mesh, text){

	var tex = text_mesh.material.diffuseTexture;
	var tex_size = tex.getSize();

	tex._context.clearRect(0, 0, tex_size.width, tex_size.height);

	var words = text.split(' ');

	function appendWord(line_obj, word) {

		var line_width = tex._context.measureText(line_obj.line + ' ' + word).width;

		if(line_width > tex_size.width){
			return false;
		}

		line_obj.line += ' ' + word;
		return true;
	}

	var word_index = 0;
	var line_obj = {
		line: ''
	};
	while(word_index < words.length && appendWord(line_obj, words[word_index])){
		word_index++;
	}
	var line_a = line_obj.line;

	line_obj = {
		line: ''
	};
	while(word_index < words.length && appendWord(line_obj, words[word_index])){
		word_index++;
	}
	var line_b = line_obj.line;

	if(line_b){
		tex.drawText(line_a, null, 24, "24px arial", "white", null);
		tex.drawText(line_b, null, 48, "24px arial", "white", null);
	} else {
		tex.drawText(line_a, null, 48, "24px arial", "white", null);
	}

}

var getUrlParameter = function (sParam) {
	var sPageURL = window.location.search.substring(1);
	var sURLVariables = sPageURL.split('&');

	for (var i = 0; i < sURLVariables.length; i++) {
		var sParameterName = sURLVariables[i].split('=');
		if (sParameterName[0] === sParam) {
			return sParameterName[1];
		}
	}
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function GetRandomNum(Min, Max) {   

	var Range = Max - Min;   
	var Rand = Math.random();   
	return (Min + Math.round(Rand * Range));   
}   

var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
function generateMixed(n) {

     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*35);
         res += chars[id];
     }
     return res;
}

var turnOffAllTooltipInfo = function (meshInfo) {

	var j;
	for (j = 0; j < meshInfo.meshLabel.length; j++)
	{
		meshInfo.meshLabel[j].label.alpha = 0;
	}

	for (j = 0; j < meshInfo.meshLine.length; j++)
	{
		meshInfo.meshLine[j].line.alpha = 0;
	}

//	for (j = 0; j < meshInfo.meshEndRound.length; j++)
//	{
//		meshInfo.meshEndRound[j].endRound.alpha = 0;
//	}
};

var turnOnAllTooltipInfo = function (meshInfo) {

	var j;
	for (j = 0; j < meshInfo.meshLabel.length; j++)
	{
		meshInfo.meshLabel[j].label.alpha = 0.6;
	}

	for (j = 0; j < meshInfo.meshLine.length; j++)
	{
		meshInfo.meshLine[j].line.alpha = 0.6;
	}

	for (j = 0; j < meshInfo.meshEndRound.length; j++)
	{
		meshInfo.meshEndRound[j].endRound.alpha = 0.6;
	}
};

var turnOffAssignTooltipInfo = function (label, line, endRound) {

	label.alpha = 0;
	line.alpha = 0;
//	endRound.alpha = 0;
};

var turnOnAssignTooltipInfo = function (label, line, endRound) {

	label.alpha = 0.6;
	line.alpha = 0.6;
//	endRound.alpha = 0.6;
};

var setTimer = function (expression, milliseconds, isRepeat) {

	var isLoop = arguments[2] ? arguments[2] : true;
	if(isLoop) {
		return setInterval(expression, milliseconds);
	}
	else {
		return setTimeout(expression, milliseconds);
	}

};

var clearTimer = function (timerID, isRepeat) {

	var isLoop = arguments[1] ? arguments[1] : true;
	if(isLoop) {
		clearInterval(timerID);
	}
	else {
		clearTimeout(timerID);
	}
}

// Load
var addModel = function (meshInfo, scene) {
		
		var ground = scene.getNodeByName("ground");

		var assetsManager = new BABYLON.AssetsManager(scene);
        var meshTask = assetsManager.addMeshTask("task", "", "../../model/", meshInfo.minimap);
		
        meshTask.onSuccess = function (task) {

			task.loadedMeshes[0].scaling = new BABYLON.Vector3(meshInfo.scaling.x, meshInfo.scaling.y, meshInfo.scaling.z);
			task.loadedMeshes[0].rotation = new BABYLON.Vector3(meshInfo.rotation.x, meshInfo.rotation.y, meshInfo.rotation.z);
            task.loadedMeshes[0].position = new BABYLON.Vector3(meshInfo.position.x, meshInfo.position.y, meshInfo.position.z);

			// Reflection shadow
			ground.material.reflectionTexture = new BABYLON.MirrorTexture("mirror", 1024, scene, true);
			ground.material.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1.0, 0, -2.0);
			ground.material.reflectionTexture.renderList = [task.loadedMeshes[0]];
			ground.material.reflectionTexture.level = 0.5;

			// Hightlight
//			var highLight = new BABYLON.HighlightLayer("hl", scene);
//			highLight.addMesh(task.loadedMeshes[0], BABYLON.Color3.White());

			var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene);
			light.diffuse = BABYLON.Color3.Black();
			light.state = "on";

			var texture = new BABYLON.Texture(meshInfo.texture, scene);
//			texture.uScale = 5.0; 
//			texture.vScale = 5.0;
			var Mat = new BABYLON.StandardMaterial("ground", scene);
			Mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			Mat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
			Mat.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0.4); 
			Mat.diffuseTexture = texture;
//			Mat.bumpTexture = new BABYLON.Texture("../../Assets/dirt.jpg", scene);
			Mat.backFaceCulling = true;
			

			// Fresnel
//			Mat.reflectionFresnelParameters = new BABYLON.FresnelParameters();
//			Mat.reflectionFresnelParameters.bias = 0.1;
//			Mat.emissiveFresnelParameters = new BABYLON.FresnelParameters();
//			Mat.emissiveFresnelParameters.bias = 0.2;
//			Mat.emissiveFresnelParameters.leftColor = BABYLON.Color3.White();
//			Mat.emissiveFresnelParameters.rightColor = BABYLON.Color3.Black();
//
//			Mat.opacityFresnelParameters = new BABYLON.FresnelParameters();
//			Mat.opacityFresnelParameters.power = 4;
//			Mat.opacityFresnelParameters.leftColor = BABYLON.Color3.White();
//			Mat.opacityFresnelParameters.rightColor = BABYLON.Color3.Black();

			if (meshInfo.hasAlpha) {
				Mat.opacityTexture = texture;
			}
			
			if (!meshInfo.visible) {
				task.loadedMeshes[0].visibility = false;
			}

			task.loadedMeshes[0].material = Mat;

//			var generateSatelliteMaterial = function (root, color, others) {
//				var material = new BABYLON.StandardMaterial("satelliteMat" + root.name, scene);
//				material.diffuseColor = color;
//				var probe = new BABYLON.ReflectionProbe("satelliteProbe" + root.name, 512, scene);
//				for (var index = 0; index < others.length; index++) {
//					probe.renderList.push(others[index]);
//				}
//
//				material.reflectionTexture = probe.cubeTexture;
//
//				material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
//				material.reflectionFresnelParameters.bias = 0.02;
//
//				root.material = material;
//				probe.attachToMesh(root);
//			}
//			generateSatelliteMaterial(task.loadedMeshes[0], BABYLON.Color3.Green(), [ground]);


//			var frontWalle = scene.getMeshByName("wall");
//			frontWalle.material.wireframe = true;
//			var rearWallnb1 = scene.getMeshByName("rearWallnb1");
//			rearWallnb1.material.wireframe = true;
//			var rearWallnb2 = scene.getMeshByName("rearWallnb2");
//			rearWallnb2.material.wireframe = true;
//			var sideWallnb1 = scene.getMeshByName("sideWallnb1");
//			sideWallnb1.material.wireframe = true;
//			var sideWallnb2 = scene.getMeshByName("sideWallnb2");
//			sideWallnb2.material.wireframe = true;
//			var sideWallnb3 = scene.getMeshByName("sideWallnb3");
//			sideWallnb3.material.wireframe = true;
//			var roof1 = scene.getMeshByName("roof1");
//			roof1.material.wireframe = true;
//			var roof2 = scene.getMeshByName("roof2");
//			roof2.material.wireframe = true;
//			var roof3 = scene.getMeshByName("roof3");
//			roof3.material.wireframe = true;
//			var stairs = scene.getMeshByName("stairs");
//			stairs.material.wireframe = true;
//			var floor = scene.getMeshByName("floor");
//			floor.material.wireframe = true;
//			var groundFloor = scene.getMeshByName("groundFloor");
//			groundFloor.material.wireframe = true;
//			var ceiling = scene.getMeshByName("ceiling");
//			ceiling.material.wireframe = true;
//			var innerWallnb1 = scene.getMeshByName("innerWallnb1");
//			innerWallnb1.material.wireframe = true;
//			var innerWallnb2 = scene.getMeshByName("innerWallnb2");
//			innerWallnb2.material.wireframe = true;
//			var bathroomWall = scene.getMeshByName("bathroomWall");
//			bathroomWall.material.wireframe = true;
//			var bedroom1Wall = scene.getMeshByName("bedroom1Wall");
//			bedroom1Wall.material.wireframe = true;
//			var bannisterWall = scene.getMeshByName("bannisterWall");
//			bannisterWall.material.wireframe = true;
//			var bannister1 = scene.getMeshByName("bannister1");
//			bannister1.material.wireframe = true;
//			var bannister2 = scene.getMeshByName("bannister2");
//			bannister2.material.wireframe = true;
//			var window1 = scene.getMeshByName("window");
//			window1.material.wireframe = true;
//			var door = scene.getMeshByName("door");
//			door.material.wireframe = true;


			var prepareButton = function (mesh, color, light) {

				var goToColorAction = new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, light, "diffuse", color, 1000, null, true);

				mesh.actionManager = new BABYLON.ActionManager(scene);
				
				mesh.actionManager.registerAction(
					new BABYLON.InterpolateValueAction(BABYLON.ActionManager.OnLeftPickTrigger, light, "diffuse", BABYLON.Color3.Black(), 1000))
					.then(new BABYLON.CombineAction(BABYLON.ActionManager.NothingTrigger, [ // Then is used to add a child action used alternatively with the root action. 
						goToColorAction,                                                 // First click: root action. Second click: child action. Third click: going back to root action and so on...   
						new BABYLON.SetValueAction(BABYLON.ActionManager.NothingTrigger, mesh.material, "wireframe", false)
					]));
				
				mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnLeftPickTrigger, mesh.material, "wireframe", true))
					.then(new BABYLON.DoNothingAction());
				mesh.actionManager.registerAction(new BABYLON.SetStateAction(BABYLON.ActionManager.OnLeftPickTrigger, light, "off"))
					.then(new BABYLON.SetStateAction(BABYLON.ActionManager.OnLeftPickTrigger, light, "on"));

				mesh.actionManager.registerAction(
					new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, (function(mesh) { window.open (meshInfo.babylonLoader) }).bind(this, mesh))); 
//					new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnRightPickTrigger, (function(mesh) { window.open (meshInfo.babylonLoader + meshInfo.prototype) }).bind(this, mesh))); 
				mesh.actionManager.registerAction(
					new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnCenterPickTrigger, (function(mesh) { window.open (meshInfo.raineffect) }).bind(this, mesh))); 
				mesh.actionManager.registerAction(
					new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLongPressTrigger, (function(mesh) { window.open (meshInfo.video) }).bind(this, mesh))); 
			}
			prepareButton(task.loadedMeshes[0], BABYLON.Color3.White(), light);

			var makeOverOut = function (mesh) {
				mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOutTrigger, mesh.material, "emissiveColor", mesh.material.emissiveColor));
				mesh.actionManager.registerAction(new BABYLON.SetValueAction(BABYLON.ActionManager.OnPointerOverTrigger, mesh.material, "emissiveColor", BABYLON.Color3.Gray()));
//				mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (function(mesh) { turnOffAllTooltipInfo(meshInfo) }).bind(this, mesh)));
//				mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (function(mesh) { turnOnAllTooltipInfo(meshInfo) }).bind(this, mesh)));
			}
			makeOverOut(task.loadedMeshes[0]);

//			scene.actionManager = new BABYLON.ActionManager(scene);
//			// Animations
//			var rotate = function (mesh) {
//				scene.actionManager.registerAction(new BABYLON.IncrementValueAction(BABYLON.ActionManager.OnEveryFrameTrigger, mesh, "rotation.y", -0.01));
//			}
//			rotate(task.loadedMeshes[0]);
			
			// Shadows
			var light1 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(100, -100, -50), scene);			 
			var shadowGenerator = new BABYLON.ShadowGenerator(512, light1);
			shadowGenerator.getShadowMap().renderList.push(task.loadedMeshes[0]);
			shadowGenerator.useExponentialShadowMap = true;
			ground.receiveShadows = true;

			// GUI
//			var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(generateMixed(6));
//			var createLabel = function(mesh, name) {
//				var label = new BABYLON.GUI.Rectangle("label" + name);
//				label.background = "black"
//				label.height = "30px";
//				label.alpha = 0.5;
//				label.width = "100px";
//				label.cornerRadius = 20;
//				label.thickness = 1;
//				label.linkOffsetY = -90;
//				advancedTexture.addControl(label); 
//				label.linkWithMesh(mesh);
//
//				var text1 = new BABYLON.GUI.TextBlock();
//				text1.text = name;
//				text1.color = "white";
//				label.addControl(text1);  
//			}  
//			createLabel(task.loadedMeshes[0], "瓦斯抽放泵");

			var sphereMaterial = new BABYLON.GradientMaterial("grad", scene);
			sphereMaterial.topColor = BABYLON.Color3.Green(); // Set the gradient top color
			sphereMaterial.bottomColor = BABYLON.Color3.Blue(); // Set the gradient bottom color
			sphereMaterial.offset = 0.25;
			sphereMaterial.emissiveColor = BABYLON.Color3.Red();
			var sphere1 = BABYLON.Mesh.CreateSphere(generateMixed(6), 10, 0.4, scene);
			var sphere2 = BABYLON.Mesh.CreateSphere(generateMixed(6), 10, 0.4, scene);
			var sphere3 = BABYLON.Mesh.CreateSphere(generateMixed(6), 10, 0.4, scene);
			sphere1.material = sphereMaterial;
			sphere2.material = sphereMaterial;
			sphere3.material = sphereMaterial;
//			sphere1.position = new BABYLON.Vector3(task.loadedMeshes[0].position.x + 1.5, task.loadedMeshes[0].position.y + 0.9, 0);
//			sphere2.position = new BABYLON.Vector3(task.loadedMeshes[0].position.x - 0.1, task.loadedMeshes[0].position.y + 2.5, 0);
//			sphere3.position = new BABYLON.Vector3(task.loadedMeshes[0].position.x - 0.6, task.loadedMeshes[0].position.y + 0.7, 0);
			sphere1.position = new BABYLON.Vector3(meshInfo.spherePosition[0].x, meshInfo.spherePosition[0].y, meshInfo.spherePosition[0].z);
			sphere2.position = new BABYLON.Vector3(meshInfo.spherePosition[1].x, meshInfo.spherePosition[1].y, meshInfo.spherePosition[1].z);
			sphere3.position = new BABYLON.Vector3(meshInfo.spherePosition[2].x, meshInfo.spherePosition[2].y, meshInfo.spherePosition[2].z);
			sphere1.isVisible = false;
			sphere2.isVisible = false;
			sphere3.isVisible = false;


//			var prepareSphere = function (mesh) {
//
//				mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, (function(mesh) { turnOffAllTooltipInfo(meshInfo) }).bind(this, mesh)));
//				mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, (function(mesh) { turnOnAllTooltipInfo(meshInfo) }).bind(this, mesh)));
//			}
//			prepareSphere(sphere1);
//			prepareSphere(sphere2);
//			prepareSphere(sphere3);

			var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(generateMixed(6));
			var createLabelWithLine = function(mesh, name, meshLabel, meshLine, meshEndRound, labelOffsetX, labelOffsetY, lineOffsetX, lineOffsetY, lineY2, endRoundOffsetX, endRoundOffsetY) {
				meshLabel.label = new BABYLON.GUI.Rectangle(generateMixed(6) + name);
				meshLabel.label.background = "black"
				meshLabel.label.height = "30px";
				meshLabel.label.alpha = 0.6;
				meshLabel.label.width = "150px";
				meshLabel.label.cornerRadius = 10;
				meshLabel.label.thickness = 1;
				meshLabel.label.linkOffsetX = labelOffsetX;
				meshLabel.label.linkOffsetY = labelOffsetY;
				meshLabel.label.top = "10%";
				meshLabel.label.zIndex = 5;
				meshLabel.label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP; 
				advancedTexture.addControl(meshLabel.label); 
				meshLabel.label.linkWithMesh(mesh);

				var text = new BABYLON.GUI.TextBlock();
				text.text = name;
				text.color = "white";
				meshLabel.label.addControl(text);  

				meshLine.line = new BABYLON.GUI.Line();
				meshLine.line.alpha = 0.5;
				meshLine.line.color = "white";
				meshLine.line.lineWidth = 2;
				meshLine.line.y2 = lineY2;
				meshLine.line.linkOffsetX = lineOffsetX;
				meshLine.line.linkOffsetY = lineOffsetY;
//				meshLine.line.dash = [5, 10];
				advancedTexture.addControl(meshLine.line); 
				meshLine.line.linkWithMesh(mesh);
				meshLine.line.connectedControl = meshLabel.label;

				meshEndRound.endRound = new BABYLON.GUI.Ellipse();
				meshEndRound.endRound.width = "10px";
				meshEndRound.endRound.background = "black";
				meshEndRound.endRound.height = "10px";
				meshEndRound.endRound.color = "white";
				meshEndRound.endRound.linkOffsetX = endRoundOffsetX;
				meshEndRound.endRound.linkOffsetY = endRoundOffsetY;
				advancedTexture.addControl(meshEndRound.endRound);
				meshEndRound.endRound.linkWithMesh(mesh);

				meshEndRound.endRound.onPointerEnterObservable.add(function() {
//					document.body.style.cursor = 'help';
					turnOnAssignTooltipInfo(meshLabel.label, meshLine.line, meshEndRound.endRound);
				});

				meshEndRound.endRound.onPointerOutObservable.add(function() {
//					document.body.style.cursor = 'default';
					turnOffAssignTooltipInfo(meshLabel.label, meshLine.line, meshEndRound.endRound);
				});
			}  
			createLabelWithLine(sphere1, meshInfo.tooltip[0], meshInfo.meshLabel[0], meshInfo.meshLine[0], meshInfo.meshEndRound[0], sphere1.position.x + 20, sphere1.position.y - 90, 0, 0, 14, 0, 0);
			createLabelWithLine(sphere2, meshInfo.tooltip[1], meshInfo.meshLabel[1], meshInfo.meshLine[1], meshInfo.meshEndRound[1], sphere2.position.x - 80, sphere2.position.y - 70, 0, 0, 15, 0, 0);
			createLabelWithLine(sphere3, meshInfo.tooltip[2], meshInfo.meshLabel[2], meshInfo.meshLine[2], meshInfo.meshEndRound[2], sphere3.position.x - 80, sphere3.position.y + 70, 0, 0, -15, 0, 0);

			// Close tooltip
			turnOffAllTooltipInfo(meshInfo);

			var waterMaterial = scene.getMaterialByID("waterMaterial");
			waterMaterial.addToRenderList(task.loadedMeshes[0]);


			// Events -- drop
//			var canvas = engine.getRenderingCanvas();
//			var startingPoint;
//			var currentMesh;
//
//			var getGroundPosition = function (evt) {
//				// Use a predicate to get position on the ground
//				var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
//				if (pickinfo.hit) {
//				  return pickinfo.pickedPoint;
//				}
//
//				return null;
//			}
//
//			var onPointerDown = function (evt) {
//				if (evt.button !== 0) {
//				  return;
//				}
//
//				// check if we are under a mesh
//				var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) { return mesh == ground; });
//				if (pickInfo.hit) {
//					currentMesh = pickInfo.pickedMesh;
//					startingPoint = getGroundPosition(evt);
//
//					if (startingPoint) { // we need to disconnect camera from canvas
//					  setTimeout(function () {
//					  camera.detachControl(canvas);
//						}, 0);
//					}
//				}
//			}
//
//			var onPointerUp = function () {
//				if (startingPoint) {
//				   camera.attachControl(canvas);
//				  startingPoint = null;
//				  return;
//				}
//			}
//
//			var onPointerMove = function (evt) {
//				if (!startingPoint) {
//					return;
//				}
//
//				var current = getGroundPosition(evt);
//
//				if (!current) {
//					return;
//				}
//
//				var diff = current.subtract(startingPoint);
//				currentMesh.position.addInPlace(diff);
//
//				startingPoint = current;
//
//			}
//
//			canvas.addEventListener("pointerdown", onPointerDown, false);
//			canvas.addEventListener("pointerup", onPointerUp, false);
//			canvas.addEventListener("pointermove", onPointerMove, false);
//
//			scene.onDispose = function () {
//				canvas.removeEventListener("pointerdown", onPointerDown);
//				canvas.removeEventListener("pointerup", onPointerUp);
//				canvas.removeEventListener("pointermove", onPointerMove);
//			}
		}

        assetsManager.onTaskError = function (task) {
            console.log("加载失败：" + task.name);
        }

		assetsManager.onFinish = function (tasks) {
            engine.runRenderLoop(function () {
                scene.render();
            });

			ArcAnimation(-Math.PI/9, Math.PI/2, 25, camera.position, scene, camera);
        };

		assetsManager.load();
}

var demo = {
    constructor: createScene,
    onload: function () {
		
		'use strict';

		// Skybox
		var skybox = BABYLON.Mesh.CreateBox("skyBox", 5000.0, scene);
		var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
		skyboxMaterial.backFaceCulling = false;
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("../../Assets/skybox/TropicalSunnyDay", scene);
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
		skyboxMaterial.disableLighting = true;
		skybox.material = skyboxMaterial;

		// Ground
		var ground = BABYLON.Mesh.CreateGround("ground", 60, 60, 1, scene, false);
		var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
		groundMaterial.diffuseTexture = new BABYLON.Texture("../../Assets/cube.jpg", scene);
		groundMaterial.diffuseTexture.uScale = 4;
		groundMaterial.diffuseTexture.vScale = 4;
		groundMaterial.backFaceCulling = true;
		ground.material = groundMaterial;
		ground.position = new BABYLON.Vector3(-5.5/2, -5.5/2, 0);
		ground.receiveShadows = true;
		
		// Water material
		var waterMaterial = new BABYLON.WaterMaterial("waterMaterial", scene, new BABYLON.Vector2(512, 512));
		waterMaterial.id = "waterMaterial";
		waterMaterial.bumpTexture = new BABYLON.Texture("../../Assets/waterbump.png", scene);
		waterMaterial.windForce = -10;
		waterMaterial.waveHeight = 0.4;
		waterMaterial.bumpHeight = 0.1;
		waterMaterial.waveLength = 0.1;
		waterMaterial.waveSpeed = 30.0;
		waterMaterial.colorBlendFactor = 0;
		waterMaterial.windDirection = new BABYLON.Vector2(-1, 1);

		// Water mesh
		var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, scene, false);
		waterMesh.material = waterMaterial;
		waterMesh.position = new BABYLON.Vector3(0, -7, 0);

		// Configure water material
		waterMaterial.addToRenderList(skybox);
		waterMaterial.addToRenderList(ground);


		// Fog
//		scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
//		scene.fogColor = BABYLON.Color3.White();
//		scene.fogStart = 50.0;
//		scene.fogEnd = 100.0;

		// cellShading
//		var light = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene);
//		var torus = BABYLON.Mesh.CreateTorus("Sphere2", 1, 0.5, 32, scene);
//
//		var cellShadingMaterial = new BABYLON.ShaderMaterial("cellShading", scene, "../../Assets/shaders/cellShading",
//		{
//			uniforms: ["world", "viewProjection"],
//			samplers: ["textureSampler"]
//		});
//		cellShadingMaterial.setTexture("textureSampler", new BABYLON.Texture("../../Assets/Ground.jpg", scene))
//						   .setVector3("vLightPosition", light.position)
//						   .setFloats("ToonThresholds", [0.95, 0.5, 0.2, 0.03])
//						   .setFloats("ToonBrightnessLevels", [1.0, 0.8, 0.6, 0.35, 0.01])
//						   .setColor3("vLightColor", light.diffuse);
//		
//		torus.material = cellShadingMaterial;
//		torus.position = new BABYLON.Vector3(-10, 0, 0);
//		
//		// Animations
//		var alpha = 0;
//		scene.registerBeforeRender(function () {
//		  
//			torus.rotation.y = alpha;
//			torus.rotation.x = alpha;
//
//			alpha += 0.05;
//		});


		// Environment Texture
		var sphereMetal = BABYLON.Mesh.CreateSphere("sphereMetal", 40, 0.3, scene);
		sphereMetal.translate(new BABYLON.Vector3(-30, -30, 0), -100);
		var metal = new BABYLON.PBRMaterial("metal", scene);
		metal.directIntensity = 0.3;
		metal.environmentIntensity = 0.7;
		metal.cameraExposure = 0.55;
		metal.cameraContrast = 1.6;
		metal.microSurface = 0.96;
		metal.reflectivityColor = new BABYLON.Color3(0.9, 0.9, 0.9);
		metal.albedoColor = new BABYLON.Color3.Red();
		metal.rotation = new BABYLON.Vector3(0, 0, 0);
        metal.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, -1);
        metal.scaling = new BABYLON.Vector3(1, 1, 1);
		sphereMetal.material = metal;
		var hl = new BABYLON.HighlightLayer("hl", scene);
		hl.addMesh(sphereMetal, BABYLON.Color3.White());

		var particleSystem = new BABYLON.ParticleSystem("New Particle System", 512, scene);
        particleSystem.emitter = sphereMetal;
        particleSystem.name = "New Particle System";
        particleSystem.renderingGroupId = 0;
        particleSystem.emitRate = 200;
        particleSystem.manualEmitCount = -1;
        particleSystem.updateSpeed = 0.005;
        particleSystem.targetStopDuration = 0;
        particleSystem.disposeOnStop = false;
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0.3;
        particleSystem.minLifeTime = 0.2;
        particleSystem.maxLifeTime = 0.5;
        particleSystem.minSize = 0.05;
        particleSystem.maxSize = 0.8;
        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = 6.283185307179586;
        particleSystem.layerMask = 268435455;
        particleSystem.blendMode = 0;
        particleSystem.forceDepthWrite = false;
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
        particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
        particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
        particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
        particleSystem.color1 = new BABYLON.Color3(0.7, 0.8, 0.5465114353377606);
        particleSystem.color2 = new BABYLON.Color3(0.6707185797327061, 0.5, 0.23185333620389842);
        particleSystem.colorDead = new BABYLON.Color3(0.2980971465478694, 0, 0.3312190517198549);
        particleSystem.textureMask = new BABYLON.Color4(1, 1, 1, 1);
        particleSystem.id = "New Particle System";
        particleSystem.particleTexture = BABYLON.Texture.CreateFromBase64String("data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdENzY1NjNCQjk0RjExRTU5OEQ4QkJFMENFNjYwODI0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdENzY1NjNDQjk0RjExRTU5OEQ4QkJFMENFNjYwODI0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0Q3NjU2MzlCOTRGMTFFNTk4RDhCQkUwQ0U2NjA4MjQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0Q3NjU2M0FCOTRGMTFFNTk4RDhCQkUwQ0U2NjA4MjQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAgICAgICAgICAgIDAwMDAwMDAwMDAQEBAQEBAQIBAQICAgECAgMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCACAAIADAREAAhEBAxEB/8QBogAAAAYCAwEAAAAAAAAAAAAABwgGBQQJAwoCAQALAQAABgMBAQEAAAAAAAAAAAAGBQQDBwIIAQkACgsQAAIBAwQBAwMCAwMDAgYJdQECAwQRBRIGIQcTIgAIMRRBMiMVCVFCFmEkMxdScYEYYpElQ6Gx8CY0cgoZwdE1J+FTNoLxkqJEVHNFRjdHYyhVVlcassLS4vJkg3SThGWjs8PT4yk4ZvN1Kjk6SElKWFlaZ2hpanZ3eHl6hYaHiImKlJWWl5iZmqSlpqeoqaq0tba3uLm6xMXGx8jJytTV1tfY2drk5ebn6Onq9PX29/j5+hEAAgEDAgQEAwUEBAQGBgVtAQIDEQQhEgUxBgAiE0FRBzJhFHEIQoEjkRVSoWIWMwmxJMHRQ3LwF+GCNCWSUxhjRPGisiY1GVQ2RWQnCnODk0Z0wtLi8lVldVY3hIWjs8PT4/MpGpSktMTU5PSVpbXF1eX1KEdXZjh2hpamtsbW5vZnd4eXp7fH1+f3SFhoeIiYqLjI2Oj4OUlZaXmJmam5ydnp+So6SlpqeoqaqrrK2ur6/9oADAMBAAIRAxEAPwD5/wD7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xunrb1AcnmKShVdRn+4sLXv46WeX6f4eP37r3Xtw0BxmYq6EjSYPt7i1reSlgm+n/Tz37r3TL7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuhY6OxRzfaO18YE1/c/xr0Wvfw7ey1R9P+nXv3Xuvd44o4TtHdGMKFDTfwX0EWI823cTUfT/AFpffuvdBP7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XujU/CjCPuD5NdaYkRNIKv++XAUsCIOv8AddTf6EceH37r3XfzWwb7f+TPZeKMTxil/ub6dJAHn6/2rU/0/wCb3v3Xuiq+/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunHH4yqyMgSBGIJsWsbf7D37r3Qy7a6oq68xs8DuWtyVJ+v+w49+691aP8Ayz+g5q35ldMwvRkrIOwiR47309U75e30/qPfuvdZ/wCZb0DNR/MruaJKMqqDrzgR2HPVOxmP4/q3v3Xuqwdy9RVVFrZad1K3NwpH/EfQe/de6BLK4SsxcjLNG2gEjVb6W/1X49+690ze/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XunHGY+TI1SQICQWGoj+l/p7917o43VfVbVzU/wDk976P7H09+691ZP1h8fmq0p/8iJuE/wB1/wCt+LX9+691dN/LL+Nn2ny96crHoLLEu/8AkxWtr6t3rGPxxy/v3Xupv8yz41/efL3uKtSguJV2BYiL/jn1bsiL+n9U9+691Td2X8eWpI5/8hIsG/3X/h/Qj37r3Vbfa3UrUJqP8m02Lf2Lf14+nv3XuiP53Dy4mreJlITUQLj9JB+n+tf37r3TH7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuh26o20a+rgdo9Rd1J4v9SP969+691cR8fusEq2ov8nBuY/7H+tb8f19+691eF0R0RHVx0f+Rg3Ef+6/9b/D6+/de6vN+CPQEWE7466zRogn2ibr9Xjtp+52PuSlH44v57e/de6dfnD8fY853v2JmRRB/u02tZvHe/2+yNt031tbjwe/de6pQ7y6DjpIqv8AyIAAP/uv+n9ePfuvdUh/IPqtKNq21OBbX/Yt9L/4f09+691TL3DtP7KoqSsenSzWNrWsbg/19+690WMggkH6gkH/AFx7917rr37r3Xvfuvde9+691737r3TzQbey+TKiipPMWtb/ACilivf6f56eMD37r3S/xXR/aOaKjGbY+5L203zW3YL3+n/AjLQ29+690KOE+FHya3A8QxXWn3YkZQv+/wAtgQXDEf8AKzuqG3Hv3XurFOg/5Z/zKrZqN4emRIpMdiewuql4Nvw++AffuvdXz/Gz+WX8vaT7B6zpxYlHiJP9/wDq17Wt+I96v7917q+noD4I98YSKiOa66Sk0CPVfdWyKm1rX4pdyTXt/hf37r3VxnQnQud2RncNmcxhkofsErQzCtxlSVNRjaujAAo6uoJBNRbi/wBffuvdPHdnReW3pm8vl8ViY6xq9KMKfu8fTljTY2kpP+UqpgPBp7c29+691Ul318He7c3FWnC9fpV6xIUI3Psym1A3sf8AKtwwWvf8+/de6of+Sf8ALQ+W9cK96Hp9JlPkIP8Af7q+P+tv87vSP37r3VB/yC/llfMyllrHfpgIoaTn/SH1STYXJ4XfJP09+691WLuP4NfKLb1TUjKdX/arHI1/9/r15PYX/pTbtmJ59+690E2V6D7awmoZTaf2un9X+53bU1rfX/gPmZb+/de6D7IbWzuLJFfQ+Ar9R9zRyW/6k1En9PfuvdMBBBIP1Bsf9ce/de669+6909UO4cxjSDRVngK/T/J6WS3+wlgkB9+690vsV3j2jhdP8M3R9to/T/uF29Na3/URiZb/AOx9+690KWD+a/yawEkRxXZf2vjdCP8Afm9fzkAEfmp2pN+B7917qxroH+Zb8yqOajSHuUIqmMAf6POqT9LH+1sZr29+691fb8a/5lny8rfsEre4llU+IEf3A6tj+tv+OWyEt7917q/H4+/OHvfORUQzPYiVeoJqH91tkU972v8A8BttwW49+691cf0X3Zmt6ZbE4rMZdK9q2Oquoo8bTFjBj6mqv/kdJARYwX4/p7917p57m7myezsnlMZjMpHRSUUdMQDTUFQQaigpqr/lKppiSTNfn37r3VR3fvzV7swUVaMLv9KMIJAg/uzsyosBe3/Arb05NvfuvdUMfJT+ZN8t6AV6UPcCwqPJpA2F1hJb62sZdlSE8e/de6oJ+Qn8zH5mVMtaj9zh1LSD/mXnVA4Nx9V2KpP09+691V9uX5yfKLcFVVfxTtD7tXka4/uV15Bfnn/gNtKG1z7917oJcr3721m9Rym7PutV9X+4LbUN7/X/AID4aK3v3Xug+yG6c9lCxr67zljc/wCS0cVyfqf2aeO3v3XumAkkkn6k3P8Arn37r3XXv3Xuve/de697917r3v3XujDdRbl+yqqdWfSVdQbn+hH+2Hv3Xurmvjz2XHSNQ/vgWMf9of4Ee/de6vT6D7yipI6L/KwABH/bt/Tn37r3V6Pwd76izfdvX+FNaH+7Tc40GS+r7bZm4arkXP08F/fuvdOvzV79iwXdm/8ACitCCjTbNkElgPuNmbeqvpcWv5/fuvdUnd797xVcVZ/lgNxJ/uy973/x+vv3XuqMvkR2hHVmutUA38n9r+t7f7x7917qlTubdS1dRVASBrs9rH/E/Qj37r3RUGJZix+rEk/65N/fuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de6ecJlZMXWRzKxCahqsbW/2r/be/de6PH1L2saFqb/KCNOj+1/S3059+691Z31X8g2o0px97awT+3b6W/xt7917q63+Wh8kxW/Lfp+hevusyb+uDJ9fH1fvSX+p/wCOfv3Xup38yb5KCg+W/cFClfZYV2FZRJ9PL1hsqa1r/kye/de6po7Q+RBq46gffXuG/wB2X/3i9vfuvdVkduduGuNT/lJNy/8Ab+v1/wAfp7917oge587JmKyRtZaMOT9eCb3/AN4Pv3Xukv7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6fMPnavEyq0TtoBBsCQV/1vzb37r3Rgdp9w1FF41NSy6bXGoi1v6g/wCPv3XurV/5ZXyClpfmZ0u71pCoOwwbycXPVO+VH1P9T7917qT/ADMfkHLU/Mzud0rWKsOvLWc246p2Kv4P+0+/de6qy3V3NUVayAVTHUCLaz/rEfX37r3Rd87ueszEj6pHEbE/Um5H+x5Hv3Xukv7917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XuuwSDcEg/1BsffuvdG5+DW46nb3yi6vygqZI1pf763OsgDz9ebtpvqTx/nvfuvde+cm5KrcHyi7Pyn3UjrVf3K51fXwdd7Spvr+beH37r3RRizMbsSx/qSSf8Aeffuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6GHoPKnCds7TyYbQab+O+r6W822szT/1H/HX37r3Xu/Mr/G+2t2ZPVr+5/gXqve/g21hqf6/9OffuvdA97917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3XulDtWvOLz1BXBtJg+6s39PLR1EP+8+T37r3XW6sgcpnq+uZtRn+19V738VHTwj/AHiP37r3Sf8Afuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+6914EjkEg/wBRx7917rskk3JJP9Tyffuvdde/de697917r3v3Xuve/de697917r3v3Xuve/de6//Z", "data:Part.jpg", scene);
        sphereMetal.attachedParticleSystem = particleSystem;
        particleSystem.start();

		var light001 = new BABYLON.PointLight("Omni001", new BABYLON.Vector3(10, 10, -10), scene);
		var light002 = new BABYLON.PointLight("Omni002", new BABYLON.Vector3(-10, -10, 10), scene);
		scene.getLightByName("Omni001").direction = null;
		scene.getLightByName("Omni002").direction = null;
		var shadowGenerator = new BABYLON.ShadowGenerator(512, light001);
        shadowGenerator.forceBackFacesOnly = true;
        shadowGenerator.bias = 0.01;
		shadowGenerator.getShadowMap().refreshRate = 0;
//		var shadowGenerator = scene.getLightByName("Omni001").getShadowGenerator();
//		shadowGenerator = scene.getLightByName("Omni002").getShadowGenerator();

		var alpha = 0, k = 0.0;
		scene.registerBeforeRender(function () {
			hl.blurHorizontalSize = 0.4 + Math.cos(alpha);
			hl.blurVerticalSize = 0.4 + Math.cos(alpha);

			sphereMetal.position.x = -30.0 * Math.sin(k);
			sphereMetal.position.z = 30.0 * Math.sin(k * 6.0);
			sphereMetal.position.y = 18.0 * Math.sin(k * 8.0);

			light001.position.x = -30.0 * Math.sin(k);
			light001.position.z = 30.0 * Math.sin(k * 6.0);
			light001.position.y = 18.0 * Math.sin(k * 8.0);

			light002.position.x = 150.0 * Math.sin(k * -5.0);
			light002.position.z = -150.0 * Math.sin(k * -6.0);
			light002.position.y = -118.0 * Math.sin(k * -8.0);

			setTimeout(k += 0.001, 10);
			alpha += 0.01;
		});

		// Collisions 
		ground.checkCollisions = true; 
		sphereMetal.checkCollisions = true; 
		waterMesh.checkCollisions = true; 
		
		// Load Assets
		BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
		for (var i = 0; i < models.length; i++) {
			setTimeout(addModel(models[i], scene), 100);
		}

		// Effects
//		engine.enableOfflineSupport = true;
//		var demoScheduler = new BABYLON.DEMO.Scheduler();
//		demoScheduler.run("roam/demo.json", engine);
    }
};