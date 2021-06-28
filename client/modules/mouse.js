class Mouse {
    constructor() {
        this.content = document.getElementById("mouse-obj-content");
        this.object = null;
        this.position = new Position();
        this.rel = new Position();
        this._down = false;
        setInterval(() => {
            let dims = this.content.getBoundingClientRect();
            this.content.style.top = (this.position.y)+"px";
            this.content.style.left = (this.position.x-dims.width/2)+"px";
            if (this.object == null) return;
            this.content.style.transform = "rotate(0deg)";
            this.content.style.transform = "rotate("+(this.rel.x/4)+"deg)";
            this.rel = new Position( this.rel.x/2, this.rel.y/2 );
        }, 60);
    }

    get pos() {
        return this.position;
    }

    set pos(newPos) {
        this.rel = this.rel.plus((this.position == null)? new Position(0, 0): newPos.minus(this.position));
        this.position = newPos;
    }

    get obj() {
        return this.object;
    }

    set obj(o) {
        if (o != null)
            this.content.appendChild(o);
        else {
            this.content.classList.add("disappear");
            setTimeout(() => {
                this.content.classList.remove("disappear");
                clearDiv(this.content);
            }, 100);
        }
        this.object = o;
    }
}

let mouse = new Mouse();