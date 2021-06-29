class Arranger {
    constructor() {
        this.dom =  document.getElementById("arranger-container");
        this.headers =  document.getElementById("arranger-headers");
        this.contents =  document.getElementById("arranger-contents");
        this.bar = document.getElementById("arranger-bar");
        this.cursor = document.getElementById("arranger-cursor");

        this.cursorValue = 0;
        this.cursorSize = 0;
        this.barWidth = 0;
        this.headersWidth = 0;
        this.dims = this.dom.getBoundingClientRect();

        this.tracks = []

        this.contents.addEventListener("scroll", ev => {
            this.setCursorPos(this.cursorPosToPercent(this.cursorValue));
        });
        setTimeout(() => {
            this.calculateSizes();
            this.setCursorPos(this.cursorPosToPercent(this.cursorValue));
        }, 100);
    }

    hitbox(p) {
        this.dims = this.dom.getBoundingClientRect();
        return p.x >= this.dims.x && p.x <= this.dims.x + this.dims.width &&
               p.y >= this.dims.y && p.y <= this.dims.y + this.dims.height;
    }

    addTrack() {
        this.tracks.push( new ArrangerTrack(this.headers, this.contents) );
    }

    moveCursor(ev) {
        let r_size = this.bar.getBoundingClientRect();
        this.cursorValue = ev.x - r_size.x - this.headersWidth + this.contents.scrollLeft;
        this.cursorValue = Math.max(0, this.cursorValue);
        this.setCursorPos(this.cursorPosToPercent(this.cursorValue));
    }

    cursorPosToPercent(pos) {
        return (pos-this.contents.scrollLeft+this.headersWidth)*100 / this.barWidth;
    }

    setCursorPos(pos) {
        this.cursor.style.marginLeft = "calc("+pos+"% - "+(this.cursorSize/2)+"px)";
    }

    calculateSizes() {
        this.cursorSize = this.cursor.getBoundingClientRect().width;
        this.barWidth = this.bar.getBoundingClientRect().width;
        this.headersWidth = this.headers.getBoundingClientRect().width;
    }
}

let arranger = new Arranger();
for (let i = 0; i < 16; i++) {
    arranger.addTrack();
}