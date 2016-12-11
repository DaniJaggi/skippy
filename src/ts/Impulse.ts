
module Takeout {

    export class Impulse {

        s: number;
        d: number;
        x: number;
        z: number;
        r: number;
        moving: boolean;
        rotating: boolean;

        constructor(o: Impulse = undefined) {
            if (o) {
                this.copy(o);
            } else {
                this.reset();
            }
        }

        reset() {
            this.s = 0;
            this.d = 0;
            this.x = 0;
            this.z = 0;
            this.r = 0;
        }

        copy(o: Impulse) {
            this.s = o.s;
            this.d = o.d;
            this.r = o.r;
            this.x = o.x;
            this.z = o.z;

        }

        updateXZ() {
            this.x = Math.sin(this.d) * this.s;
            this.z = -Math.cos(this.d) * this.s;
        }

        set(s: number, d: number, r: number) {
            this.s = s || 0;
            this.d = d || 0;
            this.r = r || 0;
            this.updateXZ();
        }

        setSpeed(s: number) {
            this.s = s;
            this.updateXZ();
        }

        mul(f: number) {
            this.s *= f;
            this.x *= f;
            this.z *= f;
        }

        dotProduct(v: Impulse) {
            return this.x * v.x + this.z * v.z;
        }

        add(v: Impulse) {
            this.x += v.x;
            this.z += v.z;
            this.s = Math.sqrt(this.x * this.x + this.z * this.z);
            this.d = getDirection(this.x, this.z);
        }

        sub(v: Impulse) {
            this.x -= v.x;
            this.z -= v.z;
            this.s = Math.sqrt(this.x * this.x + this.z * this.z);
            this.d = getDirection(this.x, this.z);
        }

        curl(c: number) {
            this.d += c;
            this.updateXZ();
        }

        tick() {
            let speedDecrement = speedmap.map(this.s);
            let rotationDecrement = rotationmap.map(this.s);
            let curlDelta = curlmap.map(this.s);

            this.moving = this.s > speedDecrement;
            if (this.moving) {
                var a = (this.s - speedDecrement) / this.s;
                this.s *= a;
                this.x *= a;
                this.z *= a;
            }
            if (this.r >= 0) {
                this.rotating = this.r > rotationDecrement;
                if (this.rotating) {
                    this.r -= rotationDecrement;
                    this.curl(-curlDelta);
                }
            } else {
                this.rotating = this.r < -rotationDecrement;
                if (this.rotating) {
                    this.r += rotationDecrement;
                    this.curl(curlDelta);
                }
            }
        }

    }

}