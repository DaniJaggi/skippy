
module Takeout {

    export class InterpolatorConfig {

        name: string;
        svg: HTMLElement;
        line: any;
        nodes: any;
        border: any;
        lines: number;
        interpolator: Interpolator;

        constructor(name: string, nodeCount: number, interpolator: Interpolator) {
            this.name = name;
            this.svg = document.getElementById(name);
            this.line = document.createElementNS("http://www.w3.org/2000/svg", "path");
            this.line.setAttribute("class", "interpolatorLine");
            this.svg.appendChild(this.line);
            this.interpolator = interpolator;
            this.nodes = [];
            this.border = 20;
            this.lines = 100;
            let sections = nodeCount - 1;
            for (let id = 0; id < nodeCount; id++) {
                let node = new InterpolatorNode(id, this, id / sections, 1 - id / sections);
                this.nodes.push(node);
            }
            this.nodes[0].fixedX = true;
            this.nodes[this.nodes.length - 1].fixedX = true;
            this.updateLine();
        }



        updateLine() {
            let xArray = [];
            let yArray = [];
            for (let i = 0; i < this.nodes.length; i++) {
                let n = this.nodes[i];
                xArray.push(n.x);
                yArray.push(n.y);
            }
            this.interpolator.update(xArray, yArray);
            let w = this.svg.clientWidth - 2 * this.border;
            let h = this.svg.clientHeight - 2 * this.border;
            let c = "M " + this.border + " " + (this.border + h * (1 - this.interpolator.map(0))).toFixed(3) + " L";
            for (let i = 1; i <= this.lines; i++) {
                let x = i / this.lines;
                let y = this.interpolator.map(x);
                c += " " + (this.border + w * x).toFixed(3) + " " + (this.border + h * (1 - y)).toFixed(3);
            }
            this.line.setAttribute("d", c);
        }
    }


    class InterpolatorNode {

        id: number;
        graph: InterpolatorConfig;
        svg: HTMLElement;
        border: any;
        x: number;
        y: number;
        cx: number;
        cy: number;
        el: SVGCircleElement;
        mx: number;
        my: number;
        fixedX: number;

        constructor(id: number, graph: InterpolatorConfig, x: number, y: number) {
            this.id = id;
            this.graph = graph;
            this.svg = graph.svg;
            this.border = graph.border;
            this.x = x;
            this.y = y;
            this.cx = this.border + (this.svg.clientWidth - 2 * this.border) * x;
            this.cy = this.border + (this.svg.clientHeight - 2 * this.border) * (1 - y);
            this.el = document.createElementNS("http://www.w3.org/2000/svg", "circle")
            this.el.setAttribute("class", "interpolatorNode");
            this.el.addEventListener('mousedown', this.onMouseDown);
            this.el.setAttribute("cx", String(this.cx));
            this.el.setAttribute("cy", String(this.cy));
            this.svg.appendChild(this.el);
        }

        onMouseDown = event => {
            this.mx = event.clientX;
            this.my = event.clientY;
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);
            document.addEventListener('mouseleave', this.onMouseUp);
        }

        onMouseMove = event => {
            var update = false;
            if (!this.fixedX) {
                var dx = event.clientX - this.mx;
                var w = this.svg.clientWidth - 2 * this.border;
                var x = this.cx + dx - this.border;
                if (x >= 0 && x <= w) {
                    this.x = x / w;
                    this.cx += dx;
                    this.el.setAttribute("cx", String(this.cx));
                    this.mx = event.clientX;
                    update = true;
                }
            }
            var dy = event.clientY - this.my;
            var h = this.svg.clientHeight - 2 * this.border;
            var y = this.cy + dy - this.border;
            if (y >= 0 && y <= h) {
                this.y = 1 - y / h;
                this.cy += dy;
                this.el.setAttribute("cy", String(this.cy));
                this.my = event.clientY;
                update = true;
            }
            if (update) {
                this.graph.updateLine();
            }
        }

        onMouseUp = event => {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
            document.removeEventListener('mouseleave', this.onMouseUp);
        }

    }

}