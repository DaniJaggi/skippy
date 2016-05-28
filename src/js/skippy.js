


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
    
    $scope.draw = draw;
	
	this.openMenu = function($mdOpenMenu, ev) {
		$mdOpenMenu(ev);
    };
});

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

camera.upperBetaLimit = 1.57;
camera.lowerRadiusLimit = 2;
camera.setTarget(new BABYLON.Vector3(0,0,0));
camera.attachControl(canvas);
//camera.fov = 0.5;

var assetsManager = new BABYLON.AssetsManager(scene);

var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 3), scene);

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

/* For Debugging */
if (false) {
    //scene.debugLayer.show(true, camera);

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

    var cursor = BABYLON.MeshBuilder.CreateSphere("cursor", {diameter: .2}, scene);
    cursor.position.x = 0;
    cursor.position.y = 0;
    cursor.position.z = 0;
    cursor.material = new BABYLON.StandardMaterial("cursor", scene);
    cursor.material.diffuseColor = new BABYLON.Color3(1,1,0);
}

dim.hackD = 21;

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
		var now = BABYLON.Tools.Now;

		processAnimates(now);
		
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
var rotationDelta = 0.000005;
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

function move(pos,x,z,millis,easing) {
    console.log("move: "+x+"/"+z);
	var move = pos.move;
	if (!move) {
		move = { pos: pos };
		animatedMoves.push(move);
		pos.move = move;
	}
	move.start =  BABYLON.Tools.Now;
	move.sx = pos.x;
	move.sz = pos.z;
	move.tx = x;
	move.tz = z;
	move.millis = millis || 1000;
    move.ease = easing || ease.quadOut;
}

function hide(mesh,millis,easing) {
    console.log("hide");
	var hide = mesh.hide;
	if (!hide) {
		hide = { mesh: mesh };
		animatedHides.push(hide);
		mesh.hide = hide;
	}
	hide.start =  BABYLON.Tools.Now;
    hide.sv = mesh.visibility;
	hide.millis = millis || 1000;
    hide.ease = easing || ease.quadOut;
}

var animatedMoves = [];
var animatedHides = [];

function processAnimates(now) {
	var i = animatedMoves.length;
	while (i--) {
		var move = animatedMoves[i];
		var duration = now-move.start;
		var progress = duration / move.millis;
		if (progress>=1) {
			// done
			move.pos.x = move.tx;
			move.pos.z = move.tz;
			animatedMoves.splice(i,1);
			move.pos.move = undefined;
		} else {
			progress = move.ease(progress);
			move.pos.x = move.sx + progress*(move.tx-move.sx);
			move.pos.z = move.sz + progress*(move.tz-move.sz);
		}
	}
    i = animatedHides.length;
    while (i--) {
		var hide = animatedHides[i];
		var duration = now-hide.start;
		var progress = duration / hide.millis;
		if (progress>=1) {
			// done
			hide.mesh.visibility = 0;
			hide.mesh.isVisible = false;
            animatedHides.splice(i,1);
			hide.hide = undefined;
		} else {
            progress = hide.ease(progress);
			hide.mesh.visibility = hide.sv*(1-progress);
		}
	}
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
            move(targetPos,pickResult.pickedPoint.x,pickResult.pickedPoint.z,500,ease.backOut);
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


var drawHandle = 0;
var drawLength = .5;
var currentStoneId = 0;

function draw() {
    var direction = Math.PI-Math.atan(targetPos.x/(dim.hackD-targetPos.z));
    var speed = interpolate(drawLength,skills.speedmap);
    var rotation = skills.rotation*drawHandle;
	
    direction = gauss(skills.deviate.direction,direction);
    speed = gauss(skills.deviate.speed,speed);
    rotation = gauss(skills.deviate.rotation,rotation);
    
    console.log("DRAW: handle="+drawHandle+" len="+drawLength+" ->  dir="+direction+" speed="+speed+" rotation="+rotation);

    stones[0].push(direction,speed,rotation);
    
    hide(targetLeft,200,ease.outCubic);
    hide(targetRight,200,ease.outCubic);
    hide(targetBroom,200,ease.outCubic);
}    

function startup() {
	//camera.lockedTarget = targetPos;
    //camera.setTarget(targetPos);

	/* OK */
	stones[0].setPosition(0,dim.hackD);
	stones[1].setPosition(0,dim.teeT);
   // stones[2].setPosition(-0.5,dim.hogT);
	//stones[2].push(Math.PI/*dir*/,3.0/*fps*/,0.1);
	
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
var skills = {
    deviate: {
        direction:   0.001,
        speed:       0.01,
        rotation:    0.0001,
    },
    rotation:           0.1,
    speedmap: [5.0, 5.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 15.0, 27.0],
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

function interpolate(ratio,map) {
    if (ratio>=1) {
        return map[map.length-1];
    } else if (ratio<=0) {
        return map[0];
    }
    var offset = (map.length-1)*ratio;
    var index = Math.floor(offset);
    var v1 = map[index];
    var step = 1/(map.length-1);
    var delta = (ratio-(index*step))/step;
    var v2 = (map[index+1]-map[index])*delta;
    return v1+v2;
}


var ease = {
    linear: function (t) { return t },
    quadIn: function (t) { return t*t },
    quadOut: function (t) { return t*(2-t) },
    quadInOut: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    quartIn: function (t) { return t*t*t*t },
    quartOut: function (t) { return 1-(--t)*t*t*t },
    quartInOut: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    quintIn: function (t) { return t*t*t*t*t },
    quintOut: function (t) { return 1+(--t)*t*t*t*t },
    quintInOut: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
    circIn: function (t) { return -1 * (Math.sqrt(1 - t*t) - 1); },
    circOut: function (t) { return Math.sqrt(1 - (t=t-1)*t); },
    circInOut: function (t) { if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1); return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1); },
    cubicIn: function (t) { return t*t*t },
    cubicOut: function (t) { return (--t)*t*t+1 },
    cubicInOut: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    sineIn: function (t) { return 1-Math.cos(t * (Math.PI/2)); },
    sineOut: function (t) { return Math.sin(t * (Math.PI/2)); },
    sineInOut: function (t) { return 1/2 * (1-Math.cos(Math.PI*t)); },
    expoIn: function (t) { return (t==0) ? 0 : Math.pow(2, 10 * (t - 1)); },
    expoOut: function (t) { return (t==1) ? 1 : 1-Math.pow(2, -10 * t); },
    expoInOut: function (t) {
        if (t==0) return 0;
        if (t==1) return 1;
        if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
        return 1/2 * (-Math.pow(2, -10 * --t) + 2);
    },
    elasticIn: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
    },
    elasticOut: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t-s)*(2*Math.PI)/p ) + 1;
    },
    elasticInOut: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p )*.5 + 1;
    },
    backOut: function (t) {
        var s = 1.1;//1.70158;
        t = ( t / 1 ) - 1;
        return (t*t*((s+1)*t+s)) + 1;
	},
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

