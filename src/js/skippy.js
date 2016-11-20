


console.log("start module");

var app = angular.module('skippy', ['ngMaterial', 'ngMdIcons']);

app.controller('ctrl', function ($scope, $mdSidenav, $timeout) {
	scope = $scope;
	$scope.toggleDraw = function() {
		$mdSidenav('draw').toggle();
	}	
	
	//$scope.close = function(navID) {
	//	$mdSidenav(navID).close();
	//}

	$scope.drawOpen = false;
    $scope.settingsOpen = false;
    
    $scope.draw = draw;
	$scope.testDraw = testDraw;
	$scope.startup = startup;
	
	$scope.open = function(what) {
        console.log("open "+what+" ...");
    }
	
	this.openMenu = function($mdOpenMenu, ev) {
		$mdOpenMenu(ev);
    };
});

app.config(['ngMdIconServiceProvider',function(ngMdIconServiceProvider) {
    // inkscape:
    // Dokumenteneinstellungen: Seitengrösse 24x24 px
    // Save As... -> Type: Optimiertes Inkscape-SVG (Metadaten entferen)
    // Achtung: in ".svg" File den viewBox="0 0 24 24" von Hand editieren! 
    // -> danach neu öffnen und platzieren.
    // 
    // Grösse in button ändern: md-icon size=32 style="width=32px; height=32px" style="fill:white" ...
    ngMdIconServiceProvider.addShapes({
        'curling_draw':`
 <path d="m19.969 17.046 0.14912 0.18798h0.94268 0.93736l0.17044 0.22557 0.1651 0.23095-1.0226 0.02685-1.0172 0.02685-0.13847 0.17186-0.13315 0.17724h1.5285c0.83616 0 1.5232-0.01134 1.5232-0.02685 0-0.01134-0.1651-0.28465-0.36216-0.60153l-0.36216-0.58004-1.2676-0.01614-1.2622-0.01134 0.14912 0.18798z"/>
 <path d="m19.853 18.492c-0.20238 0.09126-0.53792 0.4404-0.60715 0.63912-0.14912 0.39207 0 0.99361 0.29293 1.2031 0.37813 0.27391 0.46868 0.28465 2.0825 0.28465h1.5126l0.29826-0.13964c0.21836-0.1074 0.33553-0.20409 0.45271-0.39207 0.13847-0.2202 0.15445-0.28465 0.13847-0.60153-0.02137-0.41355-0.15446-0.6606-0.48999-0.89692l-0.20771-0.14501-1.6563-0.01134c-1.3102-0.01135-1.6883 0-1.8161 0.05912z"/>
 <path d="m15.698 3.6681c-0.66574 0.16112-1.3475 0.7197-1.6723 1.3641-0.68704 1.375 0.05325 3.0506 1.5499 3.5072 0.6977 0.21483 1.5179 0.069833 2.0931-0.37058 0.34618-0.26317 0.72965-0.77878 0.87877-1.1762 0.68171-1.8261-0.99062-3.7811-2.8493-3.3245z"/>
 <path d="m13.771 8.7489c-0.42074 0.096682-0.61248 0.2954-1.2676 1.289-2.7801 4.2001-6.7053 6.9875-11.184 7.9489-0.51128 0.1074-0.54324 0.12353-0.80954 0.3867-0.66574 0.66062-0.6391 1.3964 0.074624 2.0302 0.29293 0.2578 0.20238 0.2578 1.5339-0.03756 2.615-0.58005 4.4897-1.3588 6.3113-2.621 0.3089-0.20946 0.9054-0.63377 1.3261-0.92916l0.77226-0.54782h1.8535c1.0172 0 1.8535 0.01135 1.8535 0.02685 0 0.01614-0.56454 0.95064-1.2516 2.0785l-1.257 2.057 2.466 0.01613 2.466 0.01614 0.18107-0.20409c0.41542-0.47263 0.53792-1.0473 0.31956-1.5038-0.13315-0.27391-0.35683-0.46189-0.82551-0.68748l-0.34086-0.16649 0.66574-1.0956c0.48998-0.811 0.68171-1.1762 0.72431-1.3911 0.06387-0.31151 0.02663-0.6982-0.0905-0.92379-0.11712-0.23094-0.48998-0.51559-0.8415-0.64449-0.30357-0.11282-0.43139-0.12353-1.8321-0.14501l-1.5072-0.01614 0.13315-0.24705c0.07462-0.13427 0.39412-0.61227 0.70835-1.0688 0.54324-0.79489 0.56988-0.8271 0.68171-0.75192 1.7628 1.1655 3.8399 2.1 5.3739 2.4169 0.41542 0.09126 0.65508 0.06983 0.89475-0.06441 0.26097-0.15039 0.33553-0.54782 0.15977-0.84323-0.06925-0.11282-1.0066-0.74654-3.1582-2.143-1.684-1.0906-3.175-2.0359-3.324-2.1057-0.32-0.145-0.581-0.1827-0.81-0.129z"/>
        `,'curling_stone':`
 <path d="m6.9506 4.9798c-0.5838 0.2879-0.848 0.7006-0.7619 1.1894 0.079889 0.48338 0.57766 0.95047 1.1922 1.1188 0.13519 0.038019 1.2598 0.076037 2.9989 0.097762l2.79 0.038019 0.11675 0.13035c0.15977 0.18466 0.28883 0.57028 0.31341 0.89615l0.0123 0.27156-3.3431 0.038019c-4.9172 0.0542-4.6284 0.0379-5.0832 0.2552-0.4425 0.2064-1.143 0.8202-1.1123 0.9668 0.018436 0.092331 0.41174 0.097758 7.3252 0.11405 5.3464 0.0054 7.3252-0.0054 7.3866-0.04888 0.142-0.103 0.098-0.1899-0.265-0.5375-0.405-0.3911-0.712-0.5594-1.209-0.6736-0.198-0.0488-0.376-0.0923-0.382-0.1031-0.012-0.0109-0.068-0.2226-0.117-0.4779-0.251-1.1841-0.712-2.0911-1.394-2.7374-0.265-0.2498-0.536-0.4454-0.745-0.5377l-0.33185-0.14121h-3.5581l-3.5581 0.00543-0.27654 0.13578z"/>
 <path d="m3.0423 11.063c-0.09218 0.13578-0.25196 0.46165-0.35028 0.71692-0.16592 0.41278-0.1905 0.56485-0.21508 1.2112-0.024581 0.63002-0.00615 0.80382 0.10447 1.1949 0.35643 1.2112 1.2414 2.2268 2.4458 2.8026 0.61453 0.29872 1.0877 0.43449 1.7391 0.5051 0.71901 0.07604 8.8676 0.07061 9.5068-0.0054 1.9972-0.24441 3.6073-1.5479 4.105-3.3348 0.29497-1.0482 0.14135-2.1182-0.44246-3.0632l-0.16592-0.277h-8.2839-8.2778l-0.16592 0.24984z"/>',
        `,'curling_stone_moving':`
 <path d="m10.45 4.9798c-0.5835 0.2879-0.8477 0.7006-0.7616 1.1894 0.079889 0.48338 0.57766 0.95047 1.1922 1.1188 0.13519 0.038019 1.2598 0.076037 2.9989 0.097762l2.79 0.038019 0.11675 0.13035c0.15977 0.18466 0.28883 0.57028 0.31341 0.89615l0.0123 0.27156-3.3431 0.038019c-4.9172 0.0542-4.6284 0.0379-5.0832 0.2552-0.4425 0.2064-1.143 0.8202-1.1123 0.9668 0.018436 0.092331 0.41174 0.097758 7.3252 0.11405 5.3464 0.0054 7.3252-0.0054 7.3866-0.04888 0.142-0.103 0.098-0.1899-0.265-0.5375-0.405-0.3911-0.712-0.5594-1.209-0.6736-0.198-0.0488-0.376-0.0923-0.382-0.1031-0.012-0.0109-0.068-0.2226-0.117-0.4779-0.251-1.1841-0.712-2.0911-1.394-2.7374-0.265-0.2498-0.536-0.4454-0.745-0.5377l-0.33185-0.14121h-3.5581l-3.5581 0.00543-0.27654 0.13578z"/>
 <path d="m6.542 11.063c-0.09218 0.13578-0.25196 0.46165-0.35028 0.71692-0.16592 0.41278-0.1905 0.56485-0.21508 1.2112-0.024581 0.63002-0.00615 0.80382 0.10447 1.1949 0.35643 1.2112 1.2414 2.2268 2.4458 2.8026 0.61453 0.29872 1.0877 0.43449 1.7391 0.5051 0.71901 0.07604 8.8676 0.07061 9.5068-0.0054 1.9972-0.24441 3.6073-1.5479 4.105-3.3348 0.29497-1.0482 0.14135-2.1182-0.44246-3.0632l-0.16592-0.277h-8.2839-8.2778l-0.16592 0.24984z"/>
 <path d="m0.44961 9.4993 7.0943-0.306-0.5313 0.5277z"/>
 <path d="m0.23925 11.142 5.939-0.321-0.356 0.629z"/>
 <path d="m0.16734 14.386 5.3264-0.451 0.2774 0.739z"/>
 <path d="m0.1461 12.581 5.4659-0.423l-0.0935 0.761z"/>
 <path d="m0.68864 16.468 5.7735-0.372 0.5088 0.647z"/>
        `
    });
  
}]);

	 
console.log("start babylon");

var dim = {
	diameter12:     12,
	diameterStone:  1,
	width:          16,
	length:         150,

	man:            6,

	hackD:          114+12, 
	hogT:           21,
	teeT:           0, 
	backT:          -6, 
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
scene.clearColor = new BABYLON.Color3(0.6, 0.6, 0.9);

var cameraPos = new BABYLON.Vector3(0,dim.man,0);
var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, 1.3, 20, cameraPos, scene);

camera.upperBetaLimit = 1.52;
camera.lowerRadiusLimit = 2;
camera.setTarget(new BABYLON.Vector3(0,0,0));
camera.attachControl(canvas);
//camera.fov = 0.5;

var assetsManager = new BABYLON.AssetsManager(scene);

var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1,0), scene);
//light.diffuse = new BABYLON.Color3(1, 1, 1);
light.specular = new BABYLON.Color3(0.3, 0.3, 0.3);

var rinkT = BABYLON.Mesh.CreateGround("rinkT", dim.width, 40, 0, scene);
rinkT.material = new BABYLON.StandardMaterial("rinkT", scene);
rinkT.position = new BABYLON.Vector3(0,0,2);
assetsManager.addTextureTask("", "images/rink1.png").onSuccess = function(task) {
    rinkT.material.diffuseTexture = task.texture;
}

var rinkM = BABYLON.Mesh.CreateGround("rinkM", dim.width, 70, 0, scene);
rinkM.material = new BABYLON.StandardMaterial("rinkM", scene);
rinkM.position = new BABYLON.Vector3(0,0,57);
assetsManager.addTextureTask("", "images/rink2.png").onSuccess = function(task) {
    rinkM.material.diffuseTexture = task.texture;
}

var rinkD = BABYLON.Mesh.CreateGround("rinkD", dim.width, 40, 0, scene);
rinkD.material = new BABYLON.StandardMaterial("rinkD", scene);
rinkD.position = new BABYLON.Vector3(0,0,112);
assetsManager.addTextureTask("", "images/rink3.png").onSuccess = function(task) {
    rinkD.material.diffuseTexture = task.texture;
}

function showAxis() {
    
    var axisLen = 6;
    var axisWeight = 0.05;
    var xAxis = BABYLON.MeshBuilder.CreateBox("x", { height: axisWeight, width: axisLen, depth: axisWeight }, scene);
    var yAxis = BABYLON.MeshBuilder.CreateBox("y", { height: axisLen, width: axisWeight, depth: axisWeight }, scene);
    var zAxis = BABYLON.MeshBuilder.CreateBox("z", { height: axisWeight, width: axisWeight, depth: axisLen }, scene);

    xAxis.position.x = axisLen/2;
    yAxis.position.y = axisLen/2;
    zAxis.position.z = axisLen/2;

    xAxis.material = new BABYLON.StandardMaterial("x", scene);
    xAxis.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
    xAxis.material.backFaceCulling = false;

    yAxis.material = new BABYLON.StandardMaterial("y", scene);
    yAxis.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
    yAxis.material.backFaceCulling = false;

    zAxis.material = new BABYLON.StandardMaterial("z", scene);
    zAxis.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
    zAxis.material.backFaceCulling = false;

    cursor = BABYLON.MeshBuilder.CreateSphere("cursor", {diameter: .2}, scene);
    cursor.position.x = 0;
    cursor.position.y = 0;
    cursor.position.z = 0;
    cursor.material = new BABYLON.StandardMaterial("cursor", scene);
    cursor.material.diffuseColor = new BABYLON.Color3(1,1,0);
}

/* For Debugging */
var cursor = undefined;
//scene.debugLayer.show(true, camera);
//showAxis();



/*----------------------------------------*/      
        
var shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {size:1.5}, scene);
shadow.material = new BABYLON.StandardMaterial("shadow", scene);
shadow.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
shadow.material.backFaceCulling = false;
shadow.rotation.x = Math.PI/2;
shadow.isVisible = false;

assetsManager.addTextureTask("", "images/shadow.png").onSuccess = function(task) {
    shadow.material.opacityTexture = task.texture;
	shadow.material.opacityTexture.anisotropicFilteringLevel = 1;
}

assetsManager.addMeshTask("meshtask", "", "images/", "stone.babylon").onSuccess = function (task) {
	var prototypeStone = task.loadedMeshes[0];
	
	var bi = prototypeStone.getBoundingInfo();
	var diameter = bi.maximum.x - bi.minimum.x;
	var scale = dim.diameterStone/diameter;	
	var scaling = new BABYLON.Vector3(scale,scale,scale);
	
    prototypeStone.scaling = scaling;
    prototypeStone.material = new BABYLON.StandardMaterial("stone", scene);
	prototypeStone.material.diffuseTexture = new BABYLON.Texture("images/stone.png", scene);
	prototypeStone.material.backFaceCulling = false;
	prototypeStone.setEnabled(false);
	prototypeStone.isVisible = false;

	var yellowHandle = task.loadedMeshes[1];
	yellowHandle.scaling = scaling;
	yellowHandle.material = new BABYLON.StandardMaterial("yellow", scene);
	yellowHandle.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
    yellowHandle.setEnabled(false);
	yellowHandle.isVisible = false;
	
	var redHandle = yellowHandle.clone("redHandle");
    
	// http://www.html5gamedevs.com/topic/26312-side-effect-of-createinstance-on-a-clone/
	redHandle.makeGeometryUnique();
    
    redHandle.material = new BABYLON.StandardMaterial("red", scene);
	redHandle.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
  
	for (var i=0;i<16;i++) {
        if ((i%2)==0) {
            new Stone(i,prototypeStone,redHandle,shadow);
        } else {
            new Stone(i,prototypeStone,yellowHandle,shadow);
        }            
	}
    
	
    // we move in 10ms timesteps
    scene.registerBeforeRender(function() {	 
		var now = BABYLON.Tools.Now;

		processAnimations(now);
		
        var iterations = 0;
        while (timestep<now) {
            iterations++;
            timestep += timestepMillis;
            for (var i=0;i<stones.length;i++) {
                stones[i].tick();
            }
        }
        //console.log("executed "+iterations+" timesteps");
	});
}


var animations = [];

function processAnimations(now) {
    var i = animations.length;
    while (i--) {
		var a = animations[i];
		var duration = now-a.start;
		a.progress = a.easing(duration / a.millis);
        a.done = a.progress>=1;
        a.init = false;
        a.callback(a);
        if (a.done) {
            animations.splice(i,1);
        }
	}
}

function animate(millis,easing,callback) {
    var animation = {
        start: BABYLON.Tools.Now,
        millis: millis,
        easing: easing,
        callback: callback,
        progress: 0,
        done: false,
        init: true
    }
    callback(animation);
    animations.push(animation);
}



var targetPos = new BABYLON.Vector3(-4,0,0);
var targetLeft;
var targetRight;
var targetBroom;

assetsManager.addMeshTask("meshtask", "", "images/", "target.babylon").onSuccess = function(task) {
	targetLeft = task.loadedMeshes[0];
	targetRight = task.loadedMeshes[1];
	targetBroom = task.loadedMeshes[2];
	
	targetRight.material = new BABYLON.StandardMaterial("targetRight", scene);
	targetRight.material.diffuseColor = new BABYLON.Color3(0.7, 1, 0.7);
	targetRight.material.backFaceCulling = false;
	
	targetLeft.material = new BABYLON.StandardMaterial("targetLeft", scene);
	targetLeft.material.diffuseColor = new BABYLON.Color3(0.7, 1, 0.7);
	targetLeft.material.backFaceCulling = false;
	
	targetBroom.material = new BABYLON.StandardMaterial("targetBroom", scene);
	targetBroom.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
	targetBroom.material.backFaceCulling = false;
  
	targetBroom.position = targetPos;
	targetLeft.position = targetPos;
	targetRight.position = targetPos;
    
	var scale = 0.04;
	targetBroom.scaling = new BABYLON.Vector3(scale,scale,scale);
	targetLeft.scaling = new BABYLON.Vector3(scale,scale,scale);
	targetRight.scaling = new BABYLON.Vector3(scale,scale,scale);
    
	selectHandle(targetLeft,targetRight);	
};

function selectHandle(on,off) {
	on.material.diffuseColor = new BABYLON.Color3(1, 0.78125, 0.69141);
	on.visibility = 1;
	off.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	off.visibility = 0.2;
    drawHandle = (on==targetLeft)?-1:1;
}

assetsManager.onFinish = function (tasks) {
	console.log("on-finish");

	// remove splash 
	var splash = document.getElementById("splash");
	splash.parentElement.removeChild(splash);

	startup();
    engine.runRenderLoop(function () {
        scene.render();
    });
};

console.log("start loading");
assetsManager.useDefaultLoadingScreen = false;
assetsManager.load();

window.addEventListener("resize", function() {
	engine.resize();
});


var pointerMoves = 0;

window.addEventListener("pointerdown", function (evt) {
    pointerMoves=0;
});
window.addEventListener("pointermove", function (evt) {
    pointerMoves++;
});

window.addEventListener("pointerup", function (evt) {
    if (pointerMoves>1) {
        // end of moving
        return;
    }

    // adjust for canvas-coordinates
    var rect = canvas.getBoundingClientRect();
    var pickResult = scene.pick(evt.clientX-rect.left, evt.clientY-rect.top);
    if (pickResult.pickedMesh) {
        if (cursor) {
			cursor.position = pickResult.pickedPoint;
        }
		if (pickResult.pickedMesh==rinkT) {
            animate(500,ease.backOut,function(a) {
                if (a.init) {
                    a.sx = targetPos.x;
                    a.sz = targetPos.z;
                    a.tx = pickResult.pickedPoint.x;
                    a.tz = pickResult.pickedPoint.z;
                } else {
                    targetPos.x = a.sx + a.progress*(a.tx-a.sx);
                    targetPos.z = a.sz + a.progress*(a.tz-a.sz);
                }
            });
            if (pickResult.pickedPoint.x>0) {
				 selectHandle(targetRight,targetLeft);
			} else {
				 selectHandle(targetLeft,targetRight);
			}
        } else if (pickResult.pickedMesh==targetRight) {
            selectHandle(targetRight,targetLeft);
        } else if (pickResult.pickedMesh==targetLeft) {
            selectHandle(targetLeft,targetRight);
        } 
	}
});


var drawHandle = 1;
var drawLength = .5;
var currentStoneId = 0;


function draw() {
    var speed = speedmap(drawLength);
    var direction = Math.atan(targetPos.x/(dim.hackD-targetPos.z));
    var rotation = skills.rotation*drawHandle;
	
    speed = gauss(skills.deviate.speed,speed);
    direction = gauss(skills.deviate.direction,direction);
    rotation = gauss(skills.deviate.rotation,rotation);
    
    // for testing
    speed = .06; 
    direction = Math.atan(targetPos.x/(stones[currentStoneId].position.z-targetPos.z));
    
    console.log("DRAW: handle="+drawHandle+" len="+drawLength+" ->  dir="+direction+" speed="+speed+" rotation="+rotation);

    stones[currentStoneId].push(speed,direction,rotation);
    
    animate(100,ease.cubicOut,function(a) {
        if (a.init) {
            a.tl = targetLeft.visibility;
            a.tr = targetRight.visibility;
            a.tb = targetBroom.visibility;
        } else {
            var v = 1-a.progress;
            targetLeft.visibility = a.tl*v;
            targetRight.visibility = a.tr*v;
            targetBroom.visibility = a.tb*v;
            if (a.done) {
                targetLeft.visibility = a.tl;
                targetRight.visibility = a.tr;
                targetBroom.visibility = a.tb;
                targetLeft.isVisible = false;
                targetRight.isVisible = false;
                targetBroom.isVisible = false;
            }
        }
    });
}    

function startup() {
	//camera.lockedTarget = targetPos;
    //camera.setTarget(targetPos);
	targetLeft.isVisible = true;
    targetRight.isVisible = true;
    targetBroom.isVisible = true;
   
    for (var i=0;i<stones.length;i++) {
        stones[i].reset();
    }
  
 	/* OK */
    stones[0].setPosition(0,8/*dim.hackD*/);
	stones[1].setPosition(1.414/2,-1.414/4);
}


function testDraw() {
    startup();
    
    targetLeft.isVisible = false;
    targetRight.isVisible = false;
    targetBroom.isVisible = false;
    
    for (var i=0;i<stones.length;i++) {
        stones[i].reset();
    }
 
    speedDecrement = 0.00001; 
    
	/* OK */
	var x=1;
    stones[0].setPosition(x*0,8/*dim.hackD*/);
	stones[1].setPosition(x*1.414/2,-1.414/4);
    stones[2].setPosition(x*-1.5,-2.5);
    stones[3].setPosition(x*-4,-1.66);
    stones[4].setPosition(x*-5,1);
    stones[5].setPosition(x*-4.5,3);
    stones[6].setPosition(x*-3,4);
    stones[7].setPosition(x*1.5,3.5);
    
    stones[currentStoneId].push(0.2,0,skills.rotation);
    
}
    
var skills = {
    deviate: {
        direction:   0.001,   // angle/timestep
        speed:       0.01,    // feed/timestep
        rotation:    0.0001,  // angle/timestep
    },
    rotation:        0.015,    // angle/timestep 
}

var speedmap = createSpeedmap([5.0, 5.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 15.0, 27.0]);


function createSpeedmap(ys) {
	var len = ys.length;
	var xs = [];
	for (var i=0;i<len;i++) {
		xs[i] = i/len;
	}
	return createInterpolant(xs,ys);
}


function gauss(deviation,mean) {
	var q = 2;
	while (q == 0 || q>1) {
		u1 = 2 * Math.random() - 1;
		u2 = 2 * Math.random() - 1;
		q = u1 * u1 + u2 * u2;
	}
	q = Math.sqrt((-2 * Math.log(q)) / q);
	return (deviation * u1 * q)+mean;
}



app.directive('weightSelector', ['$document', function($document) {
	return function(scope, element, attr) {
		var bar = document.createElement('div');
		bar.className = 'weightBar';
		element.append(bar);
        var startY;
		var maxValue = bar.parentElement.scrollHeight-bar.scrollHeight;
        var value = maxValue*drawLength;
        // use percentage because height isn't valid yet
	    bar.style.top = 'calc('+Math.round(100*drawLength)+'% - '+(bar.scrollHeight/2)+'px)';
        
        element.on('mousedown', function(event) {
			event.preventDefault();
			$document.on('mousemove', mousemove);
			$document.on('mouseup', mouseup);
			maxValue = bar.parentElement.scrollHeight-bar.scrollHeight;
			startY = event.pageY;
			if (event.target!=bar) {
				value = event.offsetY;
			}
			bar.style.top = value+'px';
    	});

		function mousemove(event) {
			event.preventDefault();
			var tmp = value + event.pageY - startY;
			startY = event.pageY;
			if (tmp>=0 && tmp<=maxValue) {
				value = tmp;
				bar.style.top = value+'px';
			}
    	}

		function mouseup() {
			$document.off('mousemove', mousemove);
			$document.off('mouseup', mouseup);
            if (value>=0) {
                drawLength = value/maxValue;
                console.log("drawLen: "+drawLength);
            }
		}
	};
}])



var rotationDecrement1 = 0.000005; // angle/timestep
var rotationDecrement2 = 0.00005; // angle/timestep
var speedDecrement = 0.00008;  // feed/timestep 

function Impulse(copy) {
    if (copy) {
        this.copy(copy);
    } else {
        this.reset();
    }
}

Impulse.prototype.copy = function(v) {
    this.s = v.s;
    this.d = v.d;
    this.r = v.r;
    this.x = v.x;
    this.z = v.z;
}

Impulse.prototype.reset = function() {
    this.s = 0;
    this.d = 0;
    this.x = 0;
    this.z = 0;
    this.r = 0;
}

Impulse.prototype.updateXZ = function() {
    this.x = Math.sin(this.d)*this.s;
    this.z = -Math.cos(this.d)*this.s;
}
    
Impulse.prototype.set = function(s,d,r) {
    this.s = s || 0;
    this.d = d || 0;
    this.r = r || 0;
    this.updateXZ();
}

Impulse.prototype.setSpeed = function(s) {
    this.s = s;
    this.updateXZ();
}

Impulse.prototype.mul = function(f) {
    this.s *= f;
    this.x *= f;
    this.z *= f;
}

Impulse.prototype.dotProduct = function(v) {
    return this.x*v.x+this.z*v.z;
}
    
Impulse.prototype.add = function(v) {
    this.x += v.x;
    this.z += v.z;
    this.s = Math.sqrt(this.x*this.x+this.z*this.z);
    this.d = getDirection(this.x,this.z);
}

Impulse.prototype.sub = function(v) {
    this.x -= v.x;
    this.z -= v.z;
    this.s = Math.sqrt(this.x*this.x+this.z*this.z);
    this.d = getDirection(this.x,this.z);
}

Impulse.prototype.curl = function(c) {
    this.d += c;
    this.updateXZ();
}

Impulse.prototype.tick = function() {
    this.moving = this.s>speedDecrement;
    var rot = rotationDecrement2;
    if (this.moving) {
        var a = (this.s-speedDecrement)/this.s;
        this.s *= a;
        this.x *= a;
        this.z *= a;
        rot = rotationDecrement1;
    }
    if (this.r>=0) {
        this.rotating = this.r>rot;
        if (this.rotating) {
            this.r -= rot;
        }
    } else {
        this.rotating = this.r<-rot;
        if (this.rotating) {
            this.r += rot;
        }
    }
}

Impulse.prototype.text = function() {
    return "["+this.x.toFixed(2)+","+this.z.toFixed(2)+"|"+this.s.toFixed(2)+"@"+(this.d*180/Math.PI).toFixed(0)+"]";
}





var stones = [];
var curlDelta = 0; 
var rotationTakeover = 0.4;
var timestepMillis = 10;
var timestep = Math.round(BABYLON.Tools.Now/timestepMillis)*timestepMillis;
var restitution = 0.99;
var penetrationCorrection = 0.2;

function Stone(id,prototypeStone,prototypeHandle,prototypeShadow) {
	stones[id] = this;
    var that = this;
	this.id = id; 
	this.position = new BABYLON.Vector3(0,0.001*(id+1),0);
    this.impulse = new Impulse();
    
    this.body = prototypeStone.createInstance("b"+id);
	this.body.position = that.position;
	
	this.handle = prototypeHandle.createInstance("h"+id);
	this.handle.position = that.position;
	
	this.shadow = prototypeShadow.createInstance("s"+id);
	this.shadow.position = that.position;
    
    this.reset();
}

Stone.prototype.reset = function() {
	this.impulse.reset();
	this.setVisible(false);
}

Stone.prototype.setPosition = function(x,z) {
    this.position.x = x;
    this.position.z = z;
    this.position.y = 0.001*(this.id+1);
    this.setVisible(true);
}

Stone.prototype.setVisible = function(value) {
    this.visible = value;
    this.handle.isVisible = value;
    this.body.isVisible = value;
    this.shadow.isVisible = value;
}        

Stone.prototype.tick = function() {
    if (!this.visible) return;
    
    // slow down rotation and adjust direction
    this.impulse.tick();

    if (this.impulse.rotating) {
        this.handle.rotation.y += this.impulse.r;
        this.body.rotation.y += this.impulse.r;
    }

    if (this.impulse.moving) {
        this.position.x += this.impulse.x;
        this.position.z += this.impulse.z;
        
        // check for bounds
        if (this.position.x<-7.5 // -dim.width/2 + diameterStone/2
            ||this.position.x>7.5 // dim.width/2 - diameterStone/2
       	    ||this.position.z<-6.5) { // -dim.diameter12/2
			this.visible = false;
            this.remove(200);
            return;
        }
             
        // as we moved the stone we have to check for collisions
        for (var otherId=0;otherId<stones.length;otherId++) {
            if (otherId==this.id) continue;
            var other = stones[otherId];
            if (other.visible) {
                var dx = other.position.x-this.position.x;
                var dz = other.position.z-this.position.z;
                var dSquare = dx*dx+dz*dz;
                if (dSquare<=1) { // no need to do Math.sqrt now...
                    var dist = Math.sqrt(dSquare); // ... it's really needed.
                    var penetration = 1-dist;
                
                    var direction = getDirection(dx,dz);
                    var normal = new Impulse();
                    normal.set(1,direction,0);
                    
                    // relative velocity
                    var vel = new Impulse(other.impulse);
                    vel.sub(this.impulse);

                    var magnitude = vel.dotProduct(normal);
			        normal.setSpeed(-magnitude*restitution);
                    
                    this.impulse.sub(normal);
                    other.impulse.add(normal);
                }
            }
        }
    } 
}

Stone.prototype.push = function(s,d,r) {
    this.impulse.set(s,d,r);
}

Stone.prototype.remove = function(millis) {
    var stone = this;
    stone.shadow.isVisible = false;
    animate(millis,ease.quadIn,function(a) {
        stone.handle.position.y = -a.progress
        stone.body.position.y = -a.progress;
        if (a.done) {
            stone.setVisible(false);
        }
    });
}

function getDirection(dx,dz) {
    if (dz==0) {
        if (dx<0) {
            return -Math.PI/2;
        } else {
            return Math.PI/2;
        }
    } else if (dz>0) {
        if (dx<0) {
        	return Math.atan(-dx/dz)-Math.PI;
        } else {     
       	    return Math.atan(-dx/dz)+Math.PI;
        }
    } else { // dz<0
        return -Math.atan(dx/dz);
    }
}
    
  
function testDir(id,dx,dz,exp) {
	var v = getDirection(dx,dz);
    console.log("  "+id+": "+dx+"/"+dz+" -> "+v.toFixed(2)+" ("+exp+") = "+(Math.abs(exp-v)<0.1?"ok":"ERROR"));
}

function testDirs() {
testDir(1,     0,     -1,  0   );    
testDir(2,-0.707, -0.707, -0.79);    
testDir(3,    -1,      0, -1.57);    
testDir(4,-0.707,  0.707, -2.36);    
testDir(5,     0,      1,  3.14);    
testDir(6, 0.707,  0.707,  2.36);    
testDir(7,     1,      0,  1.57);    
testDir(8, 0.707, -0.707,  0.79);    
}
 
    
    
    