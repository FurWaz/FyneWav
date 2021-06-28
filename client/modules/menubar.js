class MenuBar {
    constructor() {
        this.bpm = 130;

        this.BPMcontainer = document.getElementById("menu-bpm-container");
        this.BPMcontent = document.getElementById("menu-bpm-content");

        this.BPMcontainer.addEventListener("wheel", ev => {
            this.bpm -= Math.round(ev.deltaY/100);
            this.bpm = clamp(this.bpm, 0, 360);
            this.refreshBPM();
        });

        this.BPMcontent.addEventListener("input", ev => {
            try {
                this.bpm = parseInt(this.BPMcontent.value);
                this.refreshBPM();
            } catch {}
        });
    }

    refreshBPM() {
        this.BPMcontent.value = this.bpm;
    }
}

let menubar = new MenuBar();