/**
 * Resizeable and draggable window with optional close button
 */
export class Resizable {
    uid;
    root;
    container;

    shown = false;
    left = 0;
    top = 0;
    right = 0;
    bottom = 0;

    /**
     * Creates modular, resizable window in given container. Root is a "shadow" (taking up the whole screen), its sole div .container child is the window itself.
     * @param options
     *      root (JQuery root element of the message)
     *      uid (unique id for saving coordinates into local storage)
     *      top, left, right, bottom (default position)
     *      forceDefault (do not use stored coordinates)
     */
    constructor(options) {
        this.root = options.root;
        this.root.classList.add("modular");
        this.root.classList.add("resizable");
        for(let i = 0; i < this.root.children.length; i++) {
            if(this.root.children[i].classList.contains("container")) {
                this.container = this.root.children[i];
                break;
            }
        }
        this.uid = options.uid || undefined;
        if(options.uid && !options.forceDefault) {
            let coords = window.localStorage.getItem(options.uid + "-coords");
            if(coords) {
                coords = coords.split(";").map(v => parseFloat(v));
                options.top = coords[0];
                options.right = coords[1];
                options.bottom = coords[2];
                options.left = coords[3];
            }
        }
        this.left = options.left;
        this.top = options.top;
        this.right = options.right;
        this.bottom = options.bottom;
        this.redraw();
        this.container.setAttribute("class", "container");

        // create 4 corner handles and 3 edge handles
        ["tl", "tr", "bl", "br", "mr", "bm", "ml"].forEach((direction, index) => {
            let el = document.createElement("div");
            el.classList.add("direction");
            el.classList.add(direction);
            el.addEventListener("mousedown", function(event) {
                let move = function(event) {
                    let x = event.clientX / window.innerWidth;
                    let y = event.clientY / window.innerHeight;
                    this.resize(direction, x, y);
                }.bind(this);
                window.addEventListener("mousemove", move);
                document.addEventListener("mouseup", (e) => {
                    window.removeEventListener("mousemove", move);
                    if(this.uid) {
                        window.localStorage.setItem(this.uid + "-coords",
                            this.top + ";" + this.right + ";" + this.bottom + ";" + this.left
                        );
                    }
                }, true);
                event.preventDefault();
            }.bind(this));
            this.container.appendChild(el);
        });

        // create central grabber
        let el = document.createElement("div");
        el.classList.add("move");
        el.addEventListener("mousedown", function(event) {
            let move = function(event) {
                this.moveAll(event.movementX/window.innerWidth, event.movementY/window.innerHeight);
            }.bind(this);
            window.addEventListener("mousemove", move);
            document.addEventListener("mouseup", (e) => {
                window.removeEventListener("mousemove", move);
                if(this.uid) {
                    window.localStorage.setItem(this.uid + "-coords",
                        this.top + ";" + this.right + ";" + this.bottom + ";" + this.left
                    );
                }
            }, true);
            event.preventDefault();
        }.bind(this));
        this.container.appendChild(el);

        // binds a .cross child to close window
        let cross;
        for(let i = 0; i < this.container.children.length; i++) {
            if(this.container.children[i].classList.contains("cross")) {
                cross = this.container.children[i];
                break;
            }
        }
        if(cross) {
            cross.onclick = this.toggle.bind(this);
        }
    }

    /**
     * Moves given corner
     * @param corner tl|tr|bl|br for top-bottom right-left
     * @param x relative position to move to (0-1)
     * @param y relative position to move to (0-1)
     */
    resize(corner, x, y) {
        x = x < 0 ? 0 : x > 1 ? 1 : x;
        y = y < 0 ? 0 : y > 1 ? 1 : y;
        switch(corner) {
            case "tl": this.left = x; this.top = y; break;
            case "tr": this.right = x; this.top = y; break;
            case "bl": this.left = x; this.bottom = y; break;
            case "br": this.right = x; this.bottom = y; break;
            case "ml": this.left = x; break;
            case "mr": this.right = x; break;
            case "bm": this.bottom = y; break;
            default: return;
        }
        this.redraw();
    }

    /**
     * Moves all corners by given deltae
     * @param dX x distance in px
     * @param dY y distance in px
     */
    moveAll(dX, dY) {
        if(this.right + dX > 1) { dX = this.right - 1; }
        if(this.left + dX < 0) { dX = -1 * this.left; }
        if(this.top + dY < 0) { dY = -1 * this.top; }
        if(this.bottom + dY > 1) { dY = this.bottom - 1; }
        this.left += dX;
        this.right += dX;
        this.top += dY;
        this.bottom += dY;
        this.redraw();
    }

    /**
     * Rounds values near 0 and 1
     * @param coord 0-1
     * @returns {number} 0-1
     */
    edge(coord) {
        return coord < 0.01 ? 0 : coord > 0.99 ? 1 : coord;
    }

    /** Sets position of all corners */
    redraw() {
        this.container.style.left = (this.edge(this.left)*100) + "%";
        this.container.style.right = ((1-this.edge(this.right))*100) + "%";
        this.container.style.top = (this.edge(this.top)*100) + "%";
        this.container.style.bottom = ((1-this.edge(this.bottom))*100) + "%";
    }

    /** If shown, hides, and vice versa */
    toggle() {
        if(this.shown) {
            //this.hide();
        } else {
            this.show();
        }
    }

    /** Hides window */
    show() {
        if(!this.container) { return; }
        if(this.shown) { return; }
        this.shown = true;
        this.root.classList.add("shown");
    }

    /** Shows window */
    hide() {
        if(!this.container) { return; }
        if(!this.shown) { return; }
        this.shown = false;
        this.root.classList.remove("shown");
    }
}

