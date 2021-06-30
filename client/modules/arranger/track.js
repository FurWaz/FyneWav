let _arranger_id_counter = 0;

class ArrangerTrack {
    constructor(trackHeaders, trackContents) {
        this.header = document.createElement("div");
        this.title = document.createElement("p");
        this.header.classList.add("track-header");
        this.title.classList.add("track-title");
        this.title.innerHTML = "Track "+_arranger_id_counter;
        this.title.contentEditable = true;
        this.header.appendChild(this.title);

        this.content = document.createElement("div");
        this.content.classList.add("track-content");

        trackHeaders.appendChild(this.header);
        trackContents.appendChild(this.content);

        this.id = _arranger_id_counter++;

        this.patterns = []
    }
    
    addPattern(pos, width) {
        this.patterns.push( new Pattern(pos, width) );
    }

    isPosAvailable(pos) {
        for (let i = 0; i < this.patterns.length; i++) {
            const el = this.patterns[i];
            if (el.pos <= pos && el.pos + el.width >= pos)
                return false;
        }
        return true;
    }
}