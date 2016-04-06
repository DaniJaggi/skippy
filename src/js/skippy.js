
	var dim = {
		diameter12: 12,
		diameterStone: 1,
		width: 16,
		center: 8,
		length: 150,
		hack1: 6,
		back1: 12,
		tee1: 18,
		hog1: 39,
		hog2: 111,
		tee2: 132,
		back2: 138,
		hack2: 144,
		man: 6
	};
	
	for (var p in dim) {
		dim[p] = dim[p] * 1;
	}
	
	var canvas = document.getElementById("renderCanvas");
	var engine = new BABYLON.Engine(canvas, true);
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0.4, 0.4, 0.5);
	
	var cameraPos = new BABYLON.Vector3(0,dim.man,6-dim.length/2);
	var camera = new BABYLON.FreeCamera("camera1", cameraPos, scene);
	camera.setTarget(new BABYLON.Vector3(0,0,18-dim.length/2));
	camera.attachControl(canvas, false);

	var hLight = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 10, 0), scene);
	//hLight.intensity = 1;
	//var dLight = new BABYLON.DirectionalLight("dLight", new BABYLON.Vector3(0,-10,0), scene);
	//dLight.intensity = 0.9;
	
	var ground = BABYLON.Mesh.CreateGround("ground", dim.width, dim.length, 0, scene);
	ground.material = new BABYLON.StandardMaterial("ground", scene);
	ground.material.diffuseTexture = new BABYLON.Texture("images/rink.png", scene);
	
	var shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {size:1.5}, scene);
	shadow.material = new BABYLON.StandardMaterial("shadow", scene);
	shadow.material.opacityTexture = new BABYLON.Texture("images/shadow.png", scene);
	shadow.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
	shadow.material.opacityTexture.anisotropicFilteringLevel = 1;
	shadow.material.backFaceCulling = false;
	shadow.rotation.x = Math.PI/2;
	shadow.isVisible = false;

	//scene.debugLayer.show(true, camera);
	
	var prototypeRedHandle;
	var prototypeYellowHandle;
	var prototypeStone;
	var stones = [];
	var idCount = 0;
	var rotationDelta = 0.0005;
	var speedDelta = 0.008;
	var curlDelta = 0;//0.001;
	var rotationTakeover = 0.4;
	
    var t;
    var m;
    
	function Stone(id) {
		var that = this;
		that.id = id; 
		that.red = (id % 2)==0;
		that.position = new BABYLON.Vector3(0,0.001+0.001*id,0);
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
				that.position.x -= Math.sin(that.state.d)*that.state.s*sec;
				that.position.z -= Math.cos(that.state.d)*that.state.s*sec;
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
			if (dist<1) {
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
	
    var granit = "images/granit.png";
    //granit = "images/colors.png";
    
	BABYLON.SceneLoader.ImportMesh(undefined, "images/", "stone.babylon", scene, function (newMeshes) {
		prototypeStone = newMeshes[0];
		
		var bi = prototypeStone.getBoundingInfo();
		var diameter = bi.maximum.x - bi.minimum.x;
		var scale = dim.diameterStone/diameter;	
        console.log("caluclated scale: "+scale);
        
		prototypeStone.scaling = new BABYLON.Vector3(scale,scale,scale);
        prototypeStone.material = new BABYLON.StandardMaterial("stone", scene);
		prototypeStone.material.diffuseTexture = new BABYLON.Texture(granit, scene);
        prototypeStone.material.diffuseTexture.vScale = 10;
        prototypeStone.material.diffuseTexture.uScale = 10;
        prototypeStone.isVisible = false;
	
		prototypeYellowHandle = newMeshes[1];
		prototypeYellowHandle.scaling = new BABYLON.Vector3(scale,scale,scale);
		prototypeYellowHandle.material = new BABYLON.StandardMaterial("yellow", scene);
		prototypeYellowHandle.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
		prototypeYellowHandle.isVisible = false;
	
		prototypeRedHandle = newMeshes[1].clone("prototypeRedHandle");
		prototypeRedHandle.material = new BABYLON.StandardMaterial("red", scene);
		prototypeRedHandle.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
		prototypeRedHandle.isVisible = false;
		
		for (var i=0;i<16;i++) {
			stones[i] = new Stone(i);
		}
		
		var lastMove = BABYLON.Tools.Now;
		scene.registerBeforeRender(function() {	 
			var now = BABYLON.Tools.Now;
			var sec = (now-lastMove)/1000.0;
			for (var i=0;i<16;i++) {
				stones[i].move(sec);
			}
            lastMove = now;
		});
    
		startup();
	});
 
	engine.runRenderLoop(function () {
		scene.render();
	});
	
	function startup() {
        camera.lockedTarget = stones[0];

		stones[0].setPosition(0,dim.tee1+20-dim.length/2);
		stones[0].push(0/*dir*/,3.5/*fps*/,0.28);
		
		//stones[1].setPosition(-3,dim.tee1-3-dim.length/2);
		//stones[1].push(0.1/*dir*/,0.1/*fps*/,-0.05);
		stones[1].setPosition(.5,dim.tee1-3-dim.length/2);
	}

	 var mouse = new BABYLON.Vector3(0,0,0)
	
	 var onPointerDown = function (evt) {
		mouse.x = scene.pointerX;
		mouse.y = scene.pointerY;
		mouse.down = true;
	}

	var onPointerUp = function () {
		mouse.down = false;
		camera.attachControl(canvas);
	}

	var onPointerMove = function (evt) {
        if (mouse.down) {
			camera.detachControl(canvas);
	
			var dx = scene.pointerX-mouse.x;
			var dy = scene.pointerY-mouse.y;
            cameraPos.x -= dx*.01;
			cameraPos.y += dy*.01;
			if (cameraPos.y < 0.1) {
				cameraPos.y = 0.1;
			}
            mouse.x = scene.pointerX;
			mouse.y = scene.pointerY;
		}
        
	}
	
	canvas.addEventListener("pointerdown", onPointerDown, true);
	canvas.addEventListener("pointerup", onPointerUp, true);
	canvas.addEventListener("pointermove", onPointerMove, true);

