
module Takeout {

	export class Sweeper {

		public position: BABYLON.Vector3;
		
		smokeSystem: any;
		fireSystem: any;
		
		constructor(scene: any) {
			this.position = new BABYLON.Vector3(0,0,0);
			this.smokeSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
			this.smokeSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);
			this.smokeSystem.emitter = this.position; // the starting object, the emitter
			this.smokeSystem.minEmitBox = new BABYLON.Vector3(-0.5, 1, -0.5); // Starting all from
			this.smokeSystem.maxEmitBox = new BABYLON.Vector3(0.5, 1, 0.5); // To...
			this.smokeSystem.color1 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
			this.smokeSystem.color2 = new BABYLON.Color4(0.1, 0.1, 0.1, 1.0);
			this.smokeSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);
			this.smokeSystem.minSize = 0.3;
			this.smokeSystem.maxSize = 1;
			this.smokeSystem.minLifeTime = 0.3;
			this.smokeSystem.maxLifeTime = 1.5;
			this.smokeSystem.emitRate = 350;

			// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
			this.smokeSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
			this.smokeSystem.gravity = new BABYLON.Vector3(0, 0, 0);
			this.smokeSystem.direction1 = new BABYLON.Vector3(-1.5, 8, -1.5);
			this.smokeSystem.direction2 = new BABYLON.Vector3(1.5, 8, 1.5);

			this.smokeSystem.minAngularSpeed = 0;
			this.smokeSystem.maxAngularSpeed = Math.PI;

			this.smokeSystem.minEmitPower = 0.5;
			this.smokeSystem.maxEmitPower = 1.5;
			this.smokeSystem.updateSpeed = 0.005;

			this.smokeSystem.start();

				   
			// Create a particle system
			this.fireSystem = new BABYLON.ParticleSystem("particles", 2000, scene);

			//Texture of each particle
			this.fireSystem.particleTexture = new BABYLON.Texture("images/flare.png", scene);

			// Where the particles come from
			this.fireSystem.emitter = this.position; // the starting object, the emitter
			this.fireSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0.2, -0.5); // Starting all from
			this.fireSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0.2, 0.5); // To...

			// Colors of all particles
			this.fireSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1.0);
			this.fireSystem.color2 = new BABYLON.Color4(1, 0.5, 0, 1.0);
			this.fireSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0.0);

			// Size of each particle (random between...
			this.fireSystem.minSize = 0.3;
			this.fireSystem.maxSize = 1;

			// Life time of each particle (random between...
			this.fireSystem.minLifeTime = 0.2;
			this.fireSystem.maxLifeTime = 0.4;

			// Emission rate
			this.fireSystem.emitRate = 600;

			// Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
			this.fireSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

			// Set the gravity of all particles
			this.fireSystem.gravity = new BABYLON.Vector3(0, 0, 0);

			// Direction of each particle after it has been emitted
			this.fireSystem.direction1 = new BABYLON.Vector3(0, 4, 0);
			this.fireSystem.direction2 = new BABYLON.Vector3(0, 4, 0);

			// Angular speed, in radians
			this.fireSystem.minAngularSpeed = 0;
			this.fireSystem.maxAngularSpeed = Math.PI;

			// Speed
			this.fireSystem.minEmitPower = 1;
			this.fireSystem.maxEmitPower = 3;
			this.fireSystem.updateSpeed = 0.007;

			// Start the particle system
			this.fireSystem.start();
		}			

    }

}
