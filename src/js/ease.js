
var ease = {
    linear: function (t) { return t },
    quadIn: function (t) { return t*t },
    quadOut: function (t) { return t*(2-t) },
    quadInOut: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
    quartIn: function (t) { return t*t*t*t },
    quartOut: function (t) { return 1-(--t)*t*t*t },
    quartInOut: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
    quintIn: function (t) { return t*t*t*t*t },
    quintOut: function (t) { return 1+(--t)*t*t*t*t },
    quintInOut: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t },
    circIn: function (t) { return -1 * (Math.sqrt(1 - t*t) - 1); },
    circOut: function (t) { return Math.sqrt(1 - (t=t-1)*t); },
    circInOut: function (t) { if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1); return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1); },
    cubicIn: function (t) { return t*t*t },
    cubicOut: function (t) { return (--t)*t*t+1 },
    cubicInOut: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
    sineIn: function (t) { return 1-Math.cos(t * (Math.PI/2)); },
    sineOut: function (t) { return Math.sin(t * (Math.PI/2)); },
    sineInOut: function (t) { return 1/2 * (1-Math.cos(Math.PI*t)); },
    expoIn: function (t) { return (t==0) ? 0 : Math.pow(2, 10 * (t - 1)); },
    expoOut: function (t) { return (t==1) ? 1 : 1-Math.pow(2, -10 * t); },
    expoInOut: function (t) {
        if (t==0) return 0;
        if (t==1) return 1;
        if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
        return 1/2 * (-Math.pow(2, -10 * --t) + 2);
    },
    elasticIn: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
    },
    elasticOut: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        return a*Math.pow(2,-10*t) * Math.sin( (t-s)*(2*Math.PI)/p ) + 1;
    },
    elasticInOut: function (t) {
        var s=1.70158;var p=0;var a=1;
        if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
        if (a < Math.abs(1)) { a=1; var s=p/4; }
        else var s = p/(2*Math.PI) * Math.asin (1/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p )*.5 + 1;
    },
    backOut: function (t) {
        var s = 1.05;//1.70158;
        t = ( t / 1 ) - 1;
        return (t*t*((s+1)*t+s)) + 1;
	},
}
