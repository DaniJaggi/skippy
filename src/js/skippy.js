


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
	$scope.testDraw = testDraw;
	$scope.startup = startup;
	
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

var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 100, -100), scene);

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
    var direction = Math.PI+Math.atan(-targetPos.x/(dim.hackD-targetPos.z));
    var rotation = skills.rotation*drawHandle;
	
    speed = gauss(skills.deviate.speed,speed);
    direction = gauss(skills.deviate.direction,direction);
    rotation = gauss(skills.deviate.rotation,rotation);
    
    // for testing
    speed = .06; // feed/timestep
    direction = Math.PI-Math.atan(-targetPos.x/(stones[currentStoneId].position.z-targetPos.z));
    //direction = Math.PI;
    
    console.log("DRAW: handle="+drawHandle+" len="+drawLength+" ->  dir="+direction+" speed="+speed+" rotation="+rotation);

    stones[currentStoneId].push(speed,direction,rotation);
    
    animate(100,ease.cubicOut,function(a) {
        if (a.init) {
            a.tl = targetLeft.visiblity;
            a.tr = targetRight.visiblity;
            a.tb = targetBroom.visibility;
        } else {
            var v = 1-a.progress;
            targetLeft.visibility = a.tl*v;
            targetRight.visibility = a.tr*v;
            targetBroom.visibility = a.tb*v;
            if (a.done) {
                targetLeft.isVisible = false;
                targetRight.isVisible = false;
                targetBroom.isVisible = false;
                targetLeft.visibility = a.tl;
                targetRight.visibility = a.tr;
                targetBroom.visibility = a.tb;
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
   
    
 	/* OK */
    stones[0].setPosition(0,8/*dim.hackD*/);
	stones[1].setPosition(1.414/2,-1.414/4);
    
  //  stones[2].setPosition(-2,-1.5);
  //  stones[3].setPosition(-4,0);
  
    //    stones[2].setPosition(1.1,dim.teeT);
    //    stones[3].setPosition(0,-3);
	
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


function testDraw() {
    startup();
    
    targetLeft.isVisible = false;
    targetRight.isVisible = false;
    targetBroom.isVisible = false;
    
    for (var i=0;i<stones.length;i++) {
        stones[i].setVisible(false);
        stones[i].impulse = new Impulse();
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
    
    stones[currentStoneId].push(0.2,Math.PI,skills.rotation);
    
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
    this.x = -Math.sin(this.d)*this.s;
    this.z = Math.cos(this.d)*this.s;
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

var collisionCount = 0;

function Stone(id,prototypeStone,prototypeHandle,prototypeShadow) {
	stones[id] = this;
    var that = this;
	this.id = id; 
	this.position = new BABYLON.Vector3(0,0.001*(id+1),0);
    this.impulse = new Impulse();
    this.visible = false;
	
    this.body = prototypeStone.createInstance("b"+id);
	this.body.position = that.position;
	
	this.handle = prototypeHandle.createInstance("h"+id);
	this.handle.position = that.position;
	
	this.shadow = prototypeShadow.createInstance("s"+id);
	this.shadow.position = that.position;
    
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
  	this.removing = undefined;
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
        
        if (this.removing) return;
    
        // check for bounds
        if (this.position.x<-7.5 // -dim.width/2 + diameterStone/2
            ||this.position.x>7.5 // dim.width/2 - diameterStone/2
            ||this.position.z<-6.5) { // -dim.diameter12/2
    		this.removing = true;
            this.remove(500);
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
                    collisionCount++;
                    
                    if (collisionCount==2) {
                        console.log("XXX");
                    }
                    
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
            return Math.PI/2;
        } else {
            return -Math.PI/2;
        }
    } else if (dz>0) {
        return -Math.atan(dx/dz);
    } else { // dz<0
        if (dx>0) {
            return -Math.PI-Math.atan(dx/dz);
        } else {
            return Math.PI-Math.atan(dx/dz);
        }
    }
}
    
/*    
function testDir(dx,dz,exp) {
    console.log("  "+dx+"/"+dz+" -> "+getDirection(dx,dz).toFixed(2)+" ("+exp+")");
}

testDir(     0,     -1,  3.14);    
testDir(-0.707, -0.707,  2.36);    
testDir(    -1,      0,  1.57);    
testDir(-0.707,  0.707,  0.79);    
testDir(     0,      1,  0   );    
testDir( 0.707,  0.707, -0.79);    
testDir(     1,      0, -1.57);    
testDir( 0.707, -0.707, -2.36);    
*/
    
    
    
    