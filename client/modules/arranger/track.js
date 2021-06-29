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
    }
}