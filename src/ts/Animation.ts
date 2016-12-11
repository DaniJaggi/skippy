
module Takeout {

    export class Animation {

        start: number;
        progress: number;
        done: boolean;
        init: boolean;
        
        constructor(public millis: number, public easing: Easing, public callback: any) {
            this.start = BABYLON.Tools.Now;
            this.progress = 0;
            this.done = false;
            this.init = true;
            //callback(this);
            animations.push(this);
        }
    
    }
    
    
   
    let animations = [];

    export function processAnimations(now: number) {
        let i = animations.length;
        while (i--) {
            let a = animations[i];
            let duration = now-a.start;
            a.progress = a.easing(duration / a.millis);
            a.done = a.progress>=1;
            a.init = false;
            a.callback(a);
            if (a.done) {
                animations.splice(i,1);
            }
        }
    };

}

