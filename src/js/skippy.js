
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
	scene.clearColor = new BABYLON.Color3(0.6, 0.6, 0.9);
	
	var cameraPos = new BABYLON.Vector3(0,dim.man/3,dim.back2);
	var camera = new BABYLON.FreeCamera("camera1", cameraPos, scene);
	camera.setTarget(new BABYLON.Vector3(0,0,0));
	camera.attachControl(canvas, false);
    //camera.fov = 0.5;
    
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 10, 0), scene);
	
	var ground = BABYLON.Mesh.CreateGround("ground", dim.width, dim.length, 0, scene);
	ground.material = new BABYLON.StandardMaterial("ground", scene);
	ground.material.diffuseTexture = new BABYLON.Texture("images/rink.png", scene);
    ground.position = new BABYLON.Vector3(0,0,dim.length/2-dim.offset);
		
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
	
	BABYLON.SceneLoader.ImportMesh(undefined, "images/", "stone.babylon", scene, function (newMeshes) {
		prototypeStone = newMeshes[0];
		
        var bi = prototypeStone.getBoundingInfo();
		var diameter = bi.maximum.x - bi.minimum.x;
		var scale = dim.diameterStone/diameter;	
        
		prototypeStone.scaling = new BABYLON.Vector3(scale,scale,scale);
        prototypeStone.material = new BABYLON.StandardMaterial("stone", scene);
		prototypeStone.material.diffuseTexture = new BABYLON.Texture("images/stone.png", scene);
        prototypeStone.material.diffuseTexture.vOffset = -0.05;
        prototypeStone.material.backFaceCulling = false;
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
        camera.lockedTarget = new BABYLON.Vector3.Zero();

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
            cameraPos.x += dx*.02;
			cameraPos.y += dy*.02;
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

