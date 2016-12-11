
module Takeout {

    export class CameraMouseInput implements BABYLON.ICameraInput<BABYLON.UniversalCamera> {

        camera: BABYLON.UniversalCamera;

        public buttons = [0, 1, 2];
        public angularSensibility = 4000.0;

        private observer: BABYLON.Observer<BABYLON.PointerInfo>;
        private previousPosition: { x: number, y: number };
        private element: HTMLElement;
        private noPreventDefault: boolean;
        private engine: BABYLON.Engine;

        constructor(public touchEnabled = true) {

        }

        attachControl(element: HTMLElement, noPreventDefault?: boolean) {
            this.engine = this.camera.getEngine();
            this.element = element;
            this.noPreventDefault = noPreventDefault;

            this.observer = this.camera.getScene().onPointerObservable.add(this.pointerInput,
                BABYLON.PointerEventTypes.POINTERDOWN | BABYLON.PointerEventTypes.POINTERUP | BABYLON.PointerEventTypes.POINTERMOVE);
            element.addEventListener("mousemove", this.onMouseMove, false);

        }

        detachControl(element: HTMLElement) {
            if (this.observer && this.element === element) {
                this.camera.getScene().onPointerObservable.remove(this.observer);
                element.removeEventListener("mousemove", this.onMouseMove);

                this.element = null;
                this.observer = null;
                this.onMouseMove = null;
                this.previousPosition = null;
            }
        }

        onMouseMove = (event: MouseEvent) => {
            if (!this.engine.isPointerLock) {
                return;
            }

            let offsetX = event.movementX || event.mozMovementX || event.webkitMovementX || event.msMovementX || 0;
            let offsetY = event.movementY || event.mozMovementY || event.webkitMovementY || event.msMovementY || 0;

            if (this.camera.getScene().useRightHandedSystem) {
                this.camera.cameraRotation.y -= offsetX / this.angularSensibility;
            } else {
                this.camera.cameraRotation.y += offsetX / this.angularSensibility;
            }

            this.camera.cameraRotation.x += offsetY / this.angularSensibility;

            this.previousPosition = null;

            if (!this.noPreventDefault) {
                event.preventDefault();
            }
        };

        pointerInput = (p: BABYLON.PointerInfo, s: BABYLON.EventState) => {
            let event = <PointerEvent>p.event;

            if (!this.touchEnabled && event.pointerType === "touch") {
                return;
            }

            if (p.type !== BABYLON.PointerEventTypes.POINTERMOVE && this.buttons.indexOf(event.button) === -1) {
                return;
            }

            if (p.type === BABYLON.PointerEventTypes.POINTERDOWN) {
                try {
                    event.srcElement.setPointerCapture(event.pointerId);
                } catch (e) {
                    //Nothing to do with the error. Execution will continue.
                }

                this.previousPosition = {
                    x: event.clientX,
                    y: event.clientY
                };

                if (!this.noPreventDefault) {
                    event.preventDefault();
                    this.element.focus();
                }
            } else if (p.type === BABYLON.PointerEventTypes.POINTERUP) {
                try {
                    event.srcElement.releasePointerCapture(event.pointerId);
                } catch (e) {
                    //Nothing to do with the error.
                }

                this.previousPosition = null;
                if (!this.noPreventDefault) {
                    event.preventDefault();
                }
            } else if (p.type === BABYLON.PointerEventTypes.POINTERMOVE) {
                if (!this.previousPosition || this.engine.isPointerLock) {
                    return;
                }

                var offsetX = event.clientX - this.previousPosition.x;
                var offsetY = event.clientY - this.previousPosition.y;

                // MY TEST
                //this.camera.position.x += offsetX / 100;
                //this.camera.position.z += offsetY / 100;
                if (this.camera.getScene().useRightHandedSystem) {
                    this.camera.cameraRotation.y -= offsetX / this.angularSensibility;
                } else {
                   this.camera.cameraRotation.y += offsetX / this.angularSensibility;
                }
                this.camera.cameraRotation.x += offsetY / this.angularSensibility;

                this.previousPosition = {
                    x: event.clientX,
                    y: event.clientY
                };

                if (!this.noPreventDefault) {
                    event.preventDefault();
                }
            }
        }

        getTypeName(): string {
            return "MyCameraMouseInput";
        }

        getSimpleName() {
            return "mouse";
        }
    }

}