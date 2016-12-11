
module Takeout {

    export class Scene {

        canvas: HTMLCanvasElement;
        engine: any;
        scene: any;
        camera: any;
        cameraPos: BABYLON.Vector3;

        constructor(canvasId: string) {

            this.canvas = <HTMLCanvasElement>document.querySelector(canvasId);
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
            this.scene.clearColor = new BABYLON.Color3(.9, .9, .9);

            this.cameraPos = new BABYLON.Vector3(0, 5, -7);
            this.camera = new BABYLON.UniversalCamera("camera", this.cameraPos, this.scene);
            this.camera.setTarget(BABYLON.Vector3.Zero());
            this.camera.inputs.removeByType("FreeCameraMouseInput");
            this.camera.inputs.removeByType("FreeCameraKeyboardMoveInput");
            this.camera.inputs.add(new CameraMouseInput());
            this.camera.inputs.add(new CameraKeyboardMoveInput());
            this.camera.attachControl(this.canvas);

            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
            light.intensity = 1.;

            let ground = BABYLON.Mesh.CreateGround("ground1", 16, 40, 0, this.scene);
            let groundMaterial = new BABYLON.StandardMaterial("border", this.scene);
            groundMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
            ground.material = groundMaterial;
            ground.position = new BABYLON.Vector3(0, 0, 2);

            let sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, this.scene);
            sphere.position.y = 0.2;
            let sphereMaterial = new BABYLON.StandardMaterial("stone", this.scene);
            sphereMaterial.diffuseTexture = new BABYLON.Texture("images/stone.png", this.scene);
            sphere.material = sphereMaterial;

            this.engine.runRenderLoop(() => {
                this.scene.render();
            });

            window.addEventListener("resize", () => {
                this.engine.resize();
            });


            this.scene.registerBeforeRender(function() {
                let now = BABYLON.Tools.Now;
                processAnimations(now);

            });

        }

    }

}