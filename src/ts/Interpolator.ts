
module Takeout {

    export class Interpolator {

        length: number;
        xa: number[];
        ya: number[];
        c1s: number[];
        c2s: number[];
        c3s: number[];

        update(xs: number[], ys: number[]) {
            if (xs.length != ys.length) {
                throw 'Need an equal count of xs and ys.';
            }

            this.length = xs.length;
            this.xa = [];
            this.ya = [];

            if (this.length === 0) {
                // will map to 0

            } else if (this.length === 1) {
                // Impl: Unary plus properly converts values to numbers
                this.ya.push(+ys[0]);

            } else {

                // Rearrange xs and ys so that xs is sorted
                let i;
                let indexes = [];
                for (i = 0; i < this.length; i++) {
                    indexes.push(i);
                }
                indexes.sort(function(a, b) {
                    return xs[a] < xs[b] ? -1 : 1;
                });

                // Impl: Unary plus properly converts values to numbers
                for (i = 0; i < this.length; i++) {
                    this.xa.push(+xs[indexes[i]]);
                    this.ya.push(+ys[indexes[i]]);
                }

                // Get consecutive differences and slopes
                let dys = [];
                let dxs = [];
                let ms = [];
                for (i = 0; i < this.length - 1; i++) {
                    let dx = this.xa[i + 1] - this.xa[i];
                    let dy = this.ya[i + 1] - this.ya[i];
                    dxs.push(dx);
                    dys.push(dy);
                    ms.push(dy / dx);
                }

                // Get degree-1 coefficients
                this.c1s = [ms[0]];
                for (i = 0; i < dxs.length - 1; i++) {
                    var m = ms[i], mNext = ms[i + 1];
                    if (m * mNext <= 0) {
                        this.c1s.push(0);
                    } else {
                        let dx_ = dxs[i];
                        let dxNext = dxs[i + 1];
                        let common = dx_ + dxNext;
                        this.c1s.push(3 * common / ((common + dxNext) / m + (common + dx_) / mNext));
                    }
                }
                this.c1s.push(ms[ms.length - 1]);

                // Get degree-2 and degree-3 coefficients
                this.c2s = [];
                this.c3s = [];
                for (i = 0; i < this.c1s.length - 1; i++) {
                    let c1 = this.c1s[i];
                    let m_ = ms[i];
                    let invDx = 1 / dxs[i];
                    let common_ = c1 + this.c1s[i + 1] - m_ - m_;
                    this.c2s.push((m_ - c1 - common_) * invDx);
                    this.c3s.push(common_ * invDx * invDx);
                }
            }
        }

        map(x) {
            if (this.length === 0) {
                return 0;
            } else if (this.length === 1) {
                return this.ya[0];
            } else {
                // The rightmost point in the dataset should give an exact result
                let i = this.xa.length - 1;
                if (x == this.xa[i]) {
                    return this.ya[i];
                }

                // Search for the interval x is in, returning the corresponding y if x is one of the original xs
                let low = 0;
                let mid;
                let high = this.c3s.length - 1;
                while (low <= high) {
                    mid = Math.floor(0.5 * (low + high));
                    let xHere = this.xa[mid];
                    if (xHere < x) {
                        low = mid + 1;
                    } else if (xHere > x) {
                        high = mid - 1;
                    } else {
                        return this.ya[mid];
                    }
                }
                i = Math.max(0, high);

                // Interpolate
                let diff = x - this.xa[i];
                let diffSq = diff * diff;
                return this.ya[i] + this.c1s[i] * diff + this.c2s[i] * diffSq + this.c3s[i] * diff * diffSq;
            }
        };

    };

}