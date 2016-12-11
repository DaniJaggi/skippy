
module Takeout {

    export class CameraKeyboardMoveInput implements BABYLON.ICameraInput<BABYLON.UniversalCamera> {
        camera: BABYLON.UniversalCamera;

        private buffer = [];

        public keysUp = [38];
        public keysDown = [40];
        public keysLeft = [37];
        public keysRight = [39];
        element: HTMLElement;
        noPreventDefault: boolean;

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
            if (!this.element) {
                this.element = element;
                this.noPreventDefault = noPreventDefault;
                element.tabIndex = 1;
                element.addEventListener("keydown", this.onKeyDown, false);
                element.addEventListener("keyup", this.onKeyUp, false);

                BABYLON.Tools.RegisterTopRootEvents([
                    { name: "blur", handler: this.onLostFocus }
                ]);
            }
        }

        detachControl(element: HTMLElement) {
            if (this.element == element) {
                this.element = null;
                element.removeEventListener("keydown", this.onKeyDown);
                element.removeEventListener("keyup", this.onKeyUp);

                BABYLON.Tools.UnregisterTopRootEvents([
                    { name: "blur", handler: this.onLostFocus }
                ]);
                this.buffer = [];
            }
        }

        onKeyDown = (event: KeyboardEvent) => {
            if (this.keysUp.indexOf(event.keyCode) !== -1 ||
                this.keysDown.indexOf(event.keyCode) !== -1 ||
                this.keysLeft.indexOf(event.keyCode) !== -1 ||
                this.keysRight.indexOf(event.keyCode) !== -1) {
                let index = this.buffer.indexOf(event.keyCode);

                if (index === -1) {
                    this.buffer.push(event.keyCode);
                }
                if (!this.noPreventDefault) {
                    event.preventDefault();
                }
            }
        };

        onKeyUp = (event: KeyboardEvent) => {
            if (this.keysUp.indexOf(event.keyCode) !== -1 ||
                this.keysDown.indexOf(event.keyCode) !== -1 ||
                this.keysLeft.indexOf(event.keyCode) !== -1 ||
                this.keysRight.indexOf(event.keyCode) !== -1) {
                let index = this.buffer.indexOf(event.keyCode);

                if (index >= 0) {
                    this.buffer.splice(index, 1);
                }
                if (!this.noPreventDefault) {
                    event.preventDefault();
                }
            }
        };

        checkInputs() {
            if (this.element) {
                for (let index = 0; index < this.buffer.length; index++) {
                    let keyCode = this.buffer[index];
                    let speed = this.camera._computeLocalCameraSpeed();

                    if (this.keysLeft.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(-speed, 0, 0);
                    } else if (this.keysUp.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(0, 0, speed);
                    } else if (this.keysRight.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(speed, 0, 0);
                    } else if (this.keysDown.indexOf(keyCode) !== -1) {
                        this.camera._localDirection.copyFromFloats(0, 0, -speed);
                    }

                    if (this.camera.getScene().useRightHandedSystem) {
                        this.camera._localDirection.z *= -1;
                    }

                    this.camera.getViewMatrix().invertToRef(this.camera._cameraTransformMatrix);
                    BABYLON.Vector3.TransformNormalToRef(this.camera._localDirection, this.camera._cameraTransformMatrix, this.camera._transformedDirection);
                    this.camera.cameraDirection.addInPlace(this.camera._transformedDirection);
                }
            }
        }

        onLostFocus(event: FocusEvent): void {
            this.buffer = [];
        }

        getTypeName(): string {
            return "MyCameraKeyboardMoveInput";
        }

        getSimpleName() {
            return "keyboard";
        }
    }


}