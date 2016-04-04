
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
    var actionStone;
    
    var cameraPos = new BABYLON.Vector3(0,dim.man,6-dim.length/2);
    var camera = new BABYLON.FreeCamera("camera1", cameraPos, scene);
    //var camera = new BABYLON.ArcRotateCamera("ArcRotateCamera", 1, 0.8, 10, cameraPos, scene);
    camera.setTarget(new BABYLON.Vector3(0,0,18-dim.length/2));
    camera.attachControl(canvas, false);

	var hLight = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 10, 0), scene);
	//hLight.intensity = 1;
	//var dLight = new BABYLON.DirectionalLight("dLight", new BABYLON.Vector3(0,-10,0), scene);
	//dLight.intensity = 0.9;
	
    var ground = BABYLON.Mesh.CreateGround("ground", dim.width, dim.length, 0, scene);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("images/rink.png", scene);
	
	var shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {size:1.2}, scene);
	shadow.material = new BABYLON.StandardMaterial("shadow", scene);
	shadow.material.opacityTexture = new BABYLON.Texture("images/shadow4_600.png", scene);
	shadow.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
	shadow.material.opacityTexture.anisotropicFilteringLevel = 1;
	shadow.material.backFaceCulling = false;
	shadow.rotation.x = Math.PI/2;
	shadow.isVisible = false;

	//scene.debugLayer.show(true, camera);
	
	var redHandle;
	var yellowHandle;
	var baseBody;
	var stones = [];
	var idCount = 0;
	var rotationDelta = 0.001;
	var speedDelta = 0.0005;
	
	function Stone(id) {
		var that = this;
		that.id = id; 
		that.red = (id % 2)==0;
		that.position = new BABYLON.Vector3(0,0.2+0.1*id,0);
		that.visible = false;
		var rotation = 0;
		var direction = 0;
		var speed = 0;
		
		var body = baseBody.createInstance("b"+id);
		body.position = that.position;
		body.isVisible = false;
		
		var handle = (that.red?redHandle:yellowHandle).createInstance("h"+id);
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
		
		that.move = function() {
			if (!that.visible) return;
			if (rotation>rotationDelta) {
				handle.rotation.y += rotation;
				rotation -= rotationDelta;
			} else if (rotation<-rotationDelta) {
				handle.rotation.y += rotation;
				rotation += rotationDelta;
			}				
			if (speed>speedDelta) {
				that.position.x -= Math.sin(direction)*speed;
				that.position.z -= Math.cos(direction)*speed;
				speed -= speedDelta;
			}
            if (that===actionStone) {
                camera.setTarget(that.position);
            }
		}
				
		that.push = function(d,s,r) {
			direction = d;
			speed = s;
			rotation = r;
		}
		
	}
	
	function distance(id1,id2) {
		var dx = stones[id1].position.x-stones[id2].position.x;
		var dy = stones[id1].position.z-stones[id2].position.z;
		return Math.sqrt(dx*dx+dy*dy);
	}
	
    
	BABYLON.SceneLoader.ImportMesh(undefined, "", "stone.babylon", scene, function (newMeshes, particleSystems) {
		baseBody = newMeshes[0];
        
	    var bi = baseBody.getBoundingInfo();
		var diameter = bi.maximum.x - bi.minimum.x;
	    var scale = dim.diameterStone/diameter;	
		
		baseBody.scaling = new BABYLON.Vector3(scale,scale,scale);
		baseBody.material = new BABYLON.StandardMaterial("stone", scene);
		baseBody.material.diffuseColor = new BABYLON.Color3(.5, .5, .5);
		baseBody.isVisible = false;
	
		yellowHandle = newMeshes[1];
		yellowHandle.scaling = new BABYLON.Vector3(scale,scale,scale);
		yellowHandle.material = new BABYLON.StandardMaterial("yellow", scene);
		yellowHandle.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
		yellowHandle.isVisible = false;
	
		redHandle = newMeshes[1].clone("redHandle");
		redHandle.material = new BABYLON.StandardMaterial("red", scene);
		redHandle.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
		redHandle.isVisible = false;
		
		for (var i=0;i<16;i++) {
			stones[i] = new Stone(i);
		}
		
		scene.registerBeforeRender(function() {  
			for (var i=0;i<16;i++) {
			    stones[i].move();
			}
        });
		startup();
    });
 
    engine.runRenderLoop(function () {
        scene.render();
    });
	
	function startup() {
        actionStone = stones[0];
        
		stones[0].setPosition(0,dim.tee1+20-dim.length/2);
		stones[0].push(0,0.14,0.18);
		
		stones[1].setPosition(-3,dim.tee1-3-dim.length/2);
		stones[1].push(0.5,0.03,-0.05);
	}

    
    //window.addEventListener("click", function (evt) {
    //    var pickResult = scene.pick(evt.clientX, evt.clientY);
    //    console.log("pick-result: "+pickResult);
    //});
    