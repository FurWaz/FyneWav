class Arranger {
    constructor() {
        this.dom =  document.getElementById("arranger-container");
        this.headers =  document.getElementById("arranger-headers");
        this.contents =  document.getElementById("arranger-contents");
        this.dims = this.dom.getBoundingClientRect();

        this.idCounter = 0;
        this.tracks = [

        ]
    }

    hitbox(p) {
        this.dims = this.dom.getBoundingClientRect();
        return p.x >= this.dims.x && p.x <= this.dims.x + this.dims.width &&
               p.y >= this.dims.y && p.y <= this.dims.y + this.dims.height;
    }

    addTrack() {
        this.tracks.push( new ArrangerTrack(this.idCounter, this.headers, this.contents) );
        this.idCounter++;
    }
}

class ArrangerTrack {
    constructor(id, trackHeaders, trackContents) {
        this.header = document.createElement("div");
        this.title = document.createElement("p");
        this.header.classList.add("track-header");
        this.title.classList.add("track-title");
        this.title.innerHTML = "Track "+id;
        this.title.contentEditable = true;
        this.header.appendChild(this.title);

        this.content = document.createElement("div");
        this.content.classList.add("track-content");

        trackHeaders.appendChild(this.header);
        trackContents.appendChild(this.content);

        this.id = id;
    }
}

let arranger = new Arranger();
for (let i = 0; i < 16; i++) {
    arranger.addTrack();
}