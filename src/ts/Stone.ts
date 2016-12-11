
module Takeout {

    const restitution: number = 0.99;

    export const speedmap: Interpolator = new Interpolator();
    export const rotationmap: Interpolator = new Interpolator();
    export const curlmap: Interpolator = new Interpolator();

    export var stones: Stone[] = [];

    export class Stone {

        id: number;
        position: BABYLON.Vector3;
        impulse: Impulse;
        body: any;
        handle: any;
        shadow: any;
        visible: boolean;

        constructor(id, prototypeStone, prototypeHandle, prototypeShadow) {
            stones[id] = this;
            var that = this;
            this.id = id;
            this.position = new BABYLON.Vector3(0, 0.001 * (id + 1), 0);
            this.impulse = new Impulse();

            this.body = prototypeStone.createInstance("b" + id);
            this.body.position = that.position;

            this.handle = prototypeHandle.createInstance("h" + id);
            this.handle.position = that.position;

            this.shadow = prototypeShadow.createInstance("s" + id);
            this.shadow.position = that.position;

            this.reset();
        }

        reset() {
            this.impulse.reset();
            this.setVisible(false);
        }

        setPosition(x: number, z: number) {
            this.position.x = x;
            this.position.z = z;
            this.position.y = 0.001 * (this.id + 1);
            this.setVisible(true);
        }

        setVisible(value: boolean) {
            this.visible = value;
            this.handle.isVisible = value;
            this.body.isVisible = value;
            this.shadow.isVisible = value;
        }

        tick() {
            if (!this.visible) {
                return false;
            }

            var active = false;
            // slow down rotation and adjust direction
            this.impulse.tick();

            if (this.impulse.rotating) {
                active = true;
                this.handle.rotation.y += this.impulse.r;
                this.body.rotation.y += this.impulse.r;
            }

            if (this.impulse.moving) {
                active = true;
                this.position.x += this.impulse.x;
                this.position.z += this.impulse.z;

                // check for bounds
                if (this.position.x < -7.5 // -dim.width/2 + diameterStone/2
                    || this.position.x > 7.5 // dim.width/2 - diameterStone/2
                    || this.position.z < -6.5) { // -dim.diameter12/2
                    this.visible = false;
                    this.remove(200);
                    return active;
                }

                // as we moved the stone we have to check for collisions
                for (var otherId = 0; otherId < stones.length; otherId++) {
                    if (otherId == this.id) continue;
                    var other = stones[otherId];
                    if (other.visible) {
                        var dx = other.position.x - this.position.x;
                        var dz = other.position.z - this.position.z;
                        var dSquare = Math.pow(dx, 2) + Math.pow(dz, 2);
                        if (dSquare <= 1) { // no need to do Math.sqrt now...
                            var dist = Math.sqrt(dSquare); // ... it's really needed.
                            var penetration = 1 - dist;

                            var direction = getDirection(dx, dz);
                            var normal = new Impulse();
                            normal.set(1, direction, 0);

                            // relative velocity
                            var vel = new Impulse(other.impulse);
                            vel.sub(this.impulse);

                            var magnitude = vel.dotProduct(normal);
                            normal.setSpeed(-magnitude * restitution);

                            this.impulse.sub(normal);
                            other.impulse.add(normal);
                        }
                    }
                }
            }
            return active;
        }

        push(s: number, d: number, r: number) {
            this.impulse.set(s, d, r);
        }

        remove(millis: number) {
            var stone = this;
            stone.shadow.isVisible = false;
            new Animation(millis, Easing.QuadIn, function(a) {
                stone.handle.position.y = -a.progress
                stone.body.position.y = -a.progress;
                if (a.done) {
                    stone.setVisible(false);
                }
            });
        }

    }

    export function getDirection(dx, dz) {
        if (dz == 0) {
            if (dx < 0) {
                return -Math.PI / 2;
            } else {
                return Math.PI / 2;
            }
        } else if (dz > 0) {
            if (dx < 0) {
                return Math.atan(-dx / dz) - Math.PI;
            } else {
                return Math.atan(-dx / dz) + Math.PI;
            }
        } else { // dz<0
            return -Math.atan(dx / dz);
        }
    }


}