


console.log("start module");

var app =angular.module('skippy', ['ngMaterial', 'ngMdIcons']);

app.controller('ctrl', function ($scope, $mdSidenav, $timeout) {
	scope = $scope;
	$scope.toggle = function(navID) {
		$mdSidenav(navID).toggle();
	}	
	
	$scope.close = function(navID) {
		$mdSidenav(navID).close();
	}
	
	this.openMenu = function($mdOpenMenu, ev) {
		$mdOpenMenu(ev);
    };
});

console.log("start babylon");

var dim = {
	diameter12:     12,
	diameterStone:  1,
	width:          16,
	center:         8,
	length:         150,
	man:            6,
	offset:         6,
	hack1:          0,   //6
	back1:          6,   //12,
	tee1:           12,  //18,
	hog1:           33,  //39,
	hog2:           105, //111,
	tee2:           126, //132,
	back2:          132, //138,
	hack2:          138  //144,
};

var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene = new BABYLON.Scene(engine);
var assetsManager = new BABYLON.AssetsManager(scene);
var cameraPos = new BABYLON.Vector3(0,dim.man/3,dim.back2);
var camera = new BABYLON.FreeCamera("camera1", cameraPos, scene);
//var camera = new BABYLON.StereoscopicFreeCamera("camera1", cameraPos, 0.01, true, scene);

scene.clearColor = new BABYLON.Color3(0.6, 0.6, 0.9);

camera.setTarget(new BABYLON.Vector3(0,0,0));
camera.attachControl(canvas, false);
//camera.fov = 0.5;

var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 3), scene);

var ground = BABYLON.Mesh.CreateGround("ground", dim.width, dim.length, 0, scene);
ground.material = new BABYLON.StandardMaterial("ground", scene);
ground.position = new BABYLON.Vector3(0,0,dim.length/2-dim.offset);

assetsManager.addTextureTask("", "images/rink.png").onSuccess = function(task) {
    ground.material.diffuseTexture = task.texture;
}
	
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
	prototypeStone = task.loadedMeshes[0];
	
	var bi = prototypeStone.getBoundingInfo();
	var diameter = bi.maximum.x - bi.minimum.x;
	var scale = dim.diameterStone/diameter;	
	
	prototypeStone.scaling = new BABYLON.Vector3(scale,scale,scale);
	prototypeStone.material = new BABYLON.StandardMaterial("stone", scene);
	prototypeStone.material.diffuseTexture = new BABYLON.Texture("images/stone.png", scene);
	prototypeStone.material.backFaceCulling = false;
	prototypeStone.isVisible = false;

	prototypeYellowHandle = task.loadedMeshes[1];
	prototypeYellowHandle.scaling = new BABYLON.Vector3(scale,scale,scale);
	prototypeYellowHandle.material = new BABYLON.StandardMaterial("yellow", scene);
	prototypeYellowHandle.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
	prototypeYellowHandle.isVisible = false;

	prototypeRedHandle = task.loadedMeshes[1].clone("prototypeRedHandle");
	prototypeRedHandle.material = new BABYLON.StandardMaterial("red", scene);
	prototypeRedHandle.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
	prototypeRedHandle.isVisible = false;
	
	for (var i=0;i<16;i++) {
		stones[i] = new Stone(i);
	}
	
	var lastMove = BABYLON.Tools.Now;
	scene.registerBeforeRender(function() {	 
		animate();
		
		var now = BABYLON.Tools.Now;
		var sec = (now-lastMove)/1000.0;
		for (var i=0;i<16;i++) {
			stones[i].move(sec);
		}
		lastMove = now;
	});
}


var prototypeRedHandle;
var prototypeYellowHandle;
var prototypeStone;
var stones = [];
var idCount = 0;
var rotationDelta = 0.0005;
var speedDelta = 0.008;
var curlDelta = 0;//0.001;
var rotationTakeover = 0.4;

function Stone(id) {
	var that = this;
	that.id = id; 
	that.red = (id % 2)==0;
	that.position = new BABYLON.Vector3(0,0.001*(id+1),0);
	that.visible = false;
	that.state = { s:0, d:0, r:0 }
	
	var body = prototypeStone.createInstance("b"+id);
	body.position = that.position;
	body.isVisible = false;
	
	var handle = (that.red?prototypeRedHandle:prototypeYellowHandle).createInstance("h"+id);
	handle.position = that.position;
	handle.isVisible = false;
	
	var shade = shadow.createInstance("s"+id);
	shade.position = that.position;
	shade.isVisible = false;
	
	that.setPosition = function(x,z) {
		that.position.x = x;
		that.position.z = z;
		that.visible = true;
		handle.isVisible = that.visible;
		body.isVisible = that.visible;
		shade.isVisible = that.visible;
	}
	
	that.move = function(sec) {
		if (!that.visible) return;
		
		if (that.state.r>rotationDelta) {
			handle.rotation.y += that.state.r;
			that.state.r -= rotationDelta;
			that.state.d += curlDelta;
		} else if (that.state.r<-rotationDelta) {
			handle.rotation.y += that.state.r;
			that.state.r += rotationDelta;
			that.state.d -= curlDelta;
		}
		body.rotation.y = handle.rotation.y;
		if (that.state.s>speedDelta) {
			that.position.x += Math.sin(that.state.d)*that.state.s*sec;
			that.position.z += Math.cos(that.state.d)*that.state.s*sec;
			that.state.s -= speedDelta;
		}
		for (var p=id+1;p<16;p++) {
			var impuls = stones[p].colision(that.position,that.state);
			if (impuls) {
				that.state.d = impuls.d;
				that.state.s = impuls.s;
				that.state.r = impuls.r; 
			}
		}
	}
			
	that.push = function(d,s,r) {
		that.state.d = d;
		that.state.s = s;
		that.state.r = r;
	}
	
	that.colision = function(p,s) {
		if (!that.visible) return;
		var dx = that.position.x-p.x;
		var dz = that.position.z-p.z;
		var dist = Math.sqrt(dx*dx+dz*dz);
		if (dist<=1) {
			var a1 = Math.atan(dx/dz);
			var a2 = a1-s.d;
			var ns1 = s.s*Math.sin(a2);
			var nd1 = a1-Math.PI/2;
			var nr1 = s.r*(1-rotationTakeover);
			
			var ns2 = s.s*Math.cos(a2);
			var nd2 = a1;
			var nr2 = 0-s.r*rotationTakeover;
			
			that.state.s = ns2;
			that.state.d = nd2;
			that.state.r = nr2;
			
			console.log("@@ nd1="+nd1+",   ns1="+ns1);
			return { d:nd1, s:ns1, r:nr1 };
		}
	}

	if (id==1) {
		m = body.material;
		t = body.material.diffuseTexture;
	}
	
}


function ease(t) {  return 1-(--t)*t*t*t };

function move(pos,x,z,millis) {
	var move = pos.move;
	if (!move) {
		move = { pos: pos };
		moves.push(move);
		pos.move = move;
	}
	move.start =  BABYLON.Tools.Now;
	move.sx = pos.x;
	move.sz = pos.z;
	move.tx = x;
	move.tz = z;
	move.millis = millis || 1000;
}

var moves = [];

function animate() {
	var i = moves.length;
	while (i--) {
		var move = moves[i];
		var duration = BABYLON.Tools.Now-move.start;
		var progress = duration / move.millis;
		if (progress>=1) {
			// done
			move.pos.x = move.tx;
			move.pos.z = move.tz;
			moves.splice(i,1);
			move.pos.move = undefined;
		} else {
			progress = ease(progress);
			move.pos.x = move.sx + progress*(move.tx-move.sx);
			move.pos.z = move.sz + progress*(move.tz-move.sz);
		}
	}
}

var targetPos = new BABYLON.Vector3(-4,0,dim.tee2);
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
	targetBroom.scaling = new BABYLON.Vector3(scale,scale,-scale);
	targetLeft.scaling = new BABYLON.Vector3(scale,scale,-scale);
	targetRight.scaling = new BABYLON.Vector3(scale,scale,-scale);
    
	selectHandle(targetLeft,targetRight);	
};

function selectHandle(on,off) {
	on.material.diffuseColor = new BABYLON.Color3(1, 0.78125, 0.69141);
	on.visibility = 1;
	off.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
	off.visibility = 0.3;
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

//scene.debugLayer.show(true, camera);
console.log("start loading");
assetsManager.useDefaultLoadingScreen = false;
assetsManager.load();

window.addEventListener("resize", function() {
	engine.resize();
});

window.addEventListener("click", function (evt) {
	var pickResult = scene.pick(evt.clientX, evt.clientY);
	if (pickResult.pickedMesh==targetRight) {
		selectHandle(targetRight,targetLeft);
	} else if (pickResult.pickedMesh==targetLeft) {
		selectHandle(targetLeft,targetRight);
	} else if (pickResult.pickedMesh==ground) {
		move(targetPos,pickResult.pickedPoint.x,pickResult.pickedPoint.z,800);
	}
});

function startup() {
	//camera.lockedTarget = new BABYLON.Vector3.Zero();

	/* OK */
	stones[0].setPosition(0,dim.hog2);
	stones[0].push(0/*dir*/,3.5/*fps*/,0.28);
	stones[1].setPosition(-0.5,dim.tee2);
	
	/* WRONG 
	stones[0].setPosition(2,dim.tee2);
	stones[0].push(-Math.PI/2,1.2,0.08);
	stones[1].setPosition(0,dim.tee2-.5);
	*/
	
	/* OK
	stones[0].setPosition(2,dim.tee2);
	stones[0].push(-Math.PI/2,1.2,0.08);
	stones[1].setPosition(0,dim.tee2+.5);
	*/

	/* WRONG
	stones[0].setPosition(2,dim.tee2);
	stones[0].push(-Math.PI/2,1.2,0.08);
	stones[1].setPosition(-2,dim.tee2);
	stones[1].push(Math.PI/2,1.2,0.08);
	*/
}

app.directive('weightSelector', ['$document', function($document) {
	return function(scope, element, attr) {
		var value = 200;
		var startY;       
		var bar = document.createElement('div');
		bar.className = 'weightBar';
		bar.style.top = value+'px';
		element.append(bar);
		var maxValue;
		
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
			console.log("Value: "+value+"  -> "+(value/maxValue));
		}
	};
}])

