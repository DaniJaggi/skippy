
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

    
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0,dim.man,6-dim.length/2), scene);
    camera.setTarget(new BABYLON.Vector3(0,0,18-dim.length/2));
    camera.attachControl(canvas, false);

	var hLight = new BABYLON.HemisphericLight("hLight", new BABYLON.Vector3(0, 10, 0), scene);
	hLight.intensity = 0.1;
	var dLight = new BABYLON.DirectionalLight("dLight", new BABYLON.Vector3(0,-10,0), scene);
	dLight.intensity = 0.9;
	
	/*
    var shadowGenerator = new BABYLON.ShadowGenerator (4096, dLight);
	//shadowGenerator.useVarianceShadowMap = true;
	//shadowGenerator.useBlurVarianceShadowMap = true; 
	shadowGenerator.usePoissonSampling = true;
	shadowGenerator.bias = 0.0000001;
*/
    var ground = BABYLON.Mesh.CreateGround("ground", dim.width, dim.length, 0, scene);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseTexture = new BABYLON.Texture("images/rink.png", scene);
	ground.receiveShadows = true;
	
	var shadow = BABYLON.MeshBuilder.CreatePlane("shadow", {size:1.2}, scene);
	shadow.material = new BABYLON.StandardMaterial("shadow", scene);
    if (false) {
	//shadow.material.emissiveColor = new BABYLON.Color3(0, 1, 0);
	shadow.material.diffuseTexture = new BABYLON.Texture("images/shadow1_600.png", scene);
	shadow.material.useAlphaFromDiffuseTexture = true; 
	}
	if (true) {
	shadow.material.opacityTexture = new BABYLON.Texture("images/shadow4_600.png", scene);
	shadow.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
	shadow.material.opacityTexture.anisotropicFilteringLevel = 1;
	}	
	shadow.material.backFaceCulling = false;
	shadow.rotation.x = Math.PI/2;
	shadow.isVisible = false;
	
	var redHandle;
	var yellowHandle;
	var baseBody;
	var stones = [];
	var idCount = 0;
	
	function Stone(id) {
		stones[id] = this;
		
		var my = this;
		my.id = id; 
		my.red = (id % 2)==0;
		my.position = new BABYLON.Vector3(0,0.001*id,0);
		
		//var position = new BABYLON.Vector3(0,0,0);
		
		var body = baseBody.createInstance("b"+id);
		body.receiveShadows = true;
		body.position = my.position;
		
		var handle = (my.red?redHandle:yellowHandle).createInstance("h"+id);
		handle.receiveShadows = true;
		handle.position = my.position;
		
		var shade = shadow.createInstance("s"+id);
		shade.isVisible = true;
		shade.position = my.position;
		
		if (false && shadowGenerator) {
			shadowGenerator.getShadowMap().renderList.push(body);
			shadowGenerator.getShadowMap().renderList.push(handle);
		}
		
		my.setPosition = function(x,z) {
			my.position.x = x;
			my.position.z = z;
		}
		
		my.rotate = function(a) {
			handle.rotation.y += a;
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
			var s = new Stone(i);
			var p = i/16.0;
			var hh = dim.hack2-dim.hack1;
			s.setPosition(p*dim.width/2,(dim.length/2-dim.hack1)-hh*p);
			stones[i] = s;
		}
		stones[0].setPosition(0,dim.tee1-dim.length/2);
		stones[1].setPosition(-3,dim.tee1-3-dim.length/2);
		
		var w = 0;
		scene.registerBeforeRender(function() {   
            stones[0].rotate(0.03);
			stones[1].rotate(-0.01);
			var y = Math.sin(w)*3+(dim.tee1-dim.length/2);
			var x = Math.cos(w)*3+0;
			w -= 0.005;
			if (w<0) {w=w+Math.PI*2}
			stones[0].setPosition(x,y);
			
			var d = distance(0,1);
			//console.log("Dist: "+d);
			if (d<2) {
				console.log("collision!");
			}
			for (var i=3;i<16;i++) {
			    stones[i].position.z -= 0.1;
			}
        });
	
    });
 
    engine.runRenderLoop(function () {
        scene.render();
    });
