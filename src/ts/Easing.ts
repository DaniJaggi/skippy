
module Takeout {

    export class Easing {
        public static readonly Linear = function(t) { return t; }
        public static readonly QuadIn = function(t) { return t * t }
        public static readonly QuadOut = function(t) { return t * (2 - t) }
        public static readonly QuadInOut = function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
        public static readonly QuartIn = function(t) { return t * t * t * t }
        public static readonly QuartOut = function(t) { return 1 - (--t) * t * t * t }
        public static readonly QuartInOut = function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }
        public static readonly QuintIn = function(t) { return t * t * t * t * t }
        public static readonly QuintOut = function(t) { return 1 + (--t) * t * t * t * t }
        public static readonly QuintInOut = function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
        public static readonly CircIn = function(t) { return -1 * (Math.sqrt(1 - t * t) - 1); }
        public static readonly CircOut = function(t) { return Math.sqrt(1 - (t = t - 1) * t); }
        public static readonly CircInOut = function(t) { if ((t /= 1 / 2) < 1) return -1 / 2 * (Math.sqrt(1 - t * t) - 1); return 1 / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1); }
        public static readonly CubicIn = function(t) { return t * t * t }
        public static readonly CubicOut = function(t) { return (--t) * t * t + 1 }
        public static readonly CubicInOut = function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
        public static readonly SineIn = function(t) { return 1 - Math.cos(t * (Math.PI / 2)); }
        public static readonly SineOut = function(t) { return Math.sin(t * (Math.PI / 2)); }
        public static readonly SineInOut = function(t) { return 1 / 2 * (1 - Math.cos(Math.PI * t)); }
        public static readonly ExpoIn = function(t) { return (t == 0) ? 0 : Math.pow(2, 10 * (t - 1)); }
        public static readonly ExpoOut = function(t) { return (t == 1) ? 1 : 1 - Math.pow(2, -10 * t); }
        public static readonly ExpoInOut = function(t) {
            if (t == 0) return 0;
            if (t == 1) return 1;
            if ((t /= 1 / 2) < 1) return 1 / 2 * Math.pow(2, 10 * (t - 1));
            return 1 / 2 * (-Math.pow(2, -10 * --t) + 2);
        }
        public static readonly ElasticIn = function(t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if (t == 1) return 1; if (!p) p = .3;
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
        }
        public static readonly ElasticOut = function(t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if (t == 1) return 1; if (!p) p = .3;
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
        }
        public static readonly ElasticInOut = function(t) {
            var s = 1.70158; var p = 0; var a = 1;
            if (t == 0) return 0; if ((t /= 1 / 2) == 2) return 1; if (!p) p = 1 * (.3 * 1.5);
            if (a < Math.abs(1)) { a = 1; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(1 / a);
            if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p));
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / p) * .5 + 1;
        }
        public static readonly BackOut = function(t) {
            var s = 1.05;//1.70158;
            t = (t / 1) - 1;
            return (t * t * ((s + 1) * t + s)) + 1;
        }
    }

}

