const OPTIONS = {
    GENERAL: 1,
    AUDIO: 2,
    VIDEO: 3,
    FILE: 4
}

class Options {
    constructor() {
        this.isOpen = false;
        this.panel = document.getElementById("options-panel");
        this.container = document.getElementById("optionspanel-container");
        this.content = document.getElementById("options-content");
        
        this.generalOpts = document.getElementById("general-opts");
        this.audioOpts = document.getElementById("audio-opts");
        this.videoOpts = document.getElementById("video-opts");
        this.fileOpts = document.getElementById("file-opts");

        this.generalOpts.addEventListener("mousedown", ev => {this.open(OPTIONS.GENERAL);});
        this.audioOpts.addEventListener("mousedown", ev => {this.open(OPTIONS.AUDIO);});
        this.videoOpts.addEventListener("mousedown", ev => {this.open(OPTIONS.VIDEO);});
        this.fileOpts.addEventListener("mousedown", ev => {this.open(OPTIONS.FILE);});
        document.getElementById("options-quit").addEventListener("click", ev => {this.close();});
    }

    open(type) {
        if (type)
            this.setOption(type);

        if (this.isOpen) return;
        this.panel.style.transform = "scale(1)";
        this.panel.style.pointerEvents = "all";
        this.container.style.pointerEvents = "all";
        this.container.style.opacity = "1";
        this.panel.style.opacity = "1";
        this.isOpen = true;
    }

    close() {
        if (!this.open) return;
        this.panel.style.transform = "scale(0.9)";
        this.panel.style.pointerEvents = "none";
        this.container.style.pointerEvents = "none";
        this.container.style.opacity = "0";
        this.panel.style.opacity = "0";
        this.isOpen = false;
    }

    clearContent() {
        while (this.content.firstChild)
            this.content.firstChild.remove();
    }

    setOption(type) {
        this.generalOpts.style.backgroundColor = "var(--color-black-dark)";
        this.audioOpts.style.backgroundColor = "var(--color-black-dark)";
        this.videoOpts.style.backgroundColor = "var(--color-black-dark)";
        this.fileOpts.style.backgroundColor = "var(--color-black-dark)";
        this.clearContent();
        switch (type) {
            case OPTIONS.GENERAL:
                this.generalOpts.style.backgroundColor = "var(--color-black-light)";
                addButton(this.content, "Load config file", ()=>{console.log("uwu")}, "outline-green");
                break;
            case OPTIONS.AUDIO:
                this.audioOpts.style.backgroundColor = "var(--color-black-light)";
                addButton(this.content, "Reset audio settings", ()=>{console.log("uwu")}, "outline-red");
                break;
            case OPTIONS.VIDEO:
                this.videoOpts.style.backgroundColor = "var(--color-black-light)";
                addButton(this.content, "Reset scale", ()=>{console.log("uwu")}, "outline");
                break;
            case OPTIONS.FILE:
                this.fileOpts.style.backgroundColor = "var(--color-black-light)";
                this.setFileTab();
                break;
            default:
                break;
        }
    }

    setFileTab() {
        let a = addXArranger(this.content);
        let l = addYArranger(a);
                addYSeparator(a);
        let r = addYArranger(a);
                addSeparatorTitle(l, "Kit folders");
                addXSeparator(l);
                addSeparatorTitle(r, "VST folders");
                addXSeparator(r);
        let kitList = addListBlock(l);
        let vstList = addListBlock(r);
        let kitElements = ["C://Users/FurWaz/Documents/Kits/", "C://Windows/Program Files/FyneWav/Kits"];
        let vstElements = ["C://Users/FurWaz/Documents/Vsts/", "C://Windows/Program Files/FyneWav/VSTs", "C://Users/FurWaz/Desktop"];
        let index = 0;
        kitElements.forEach(el => {
            addRemovableListElement(kitList, el, index++, kitElements);
        });
        index = 0;
        vstElements.forEach(el => {
            addRemovableListElement(vstList, el, index++, vstElements);
        });

        let rbtn_a = addXArranger(r);
        let lbtn_a = addXArranger(l);
        addButton(rbtn_a, "Reset", ()=>{console.log("reset")}, "outline");
        addButton(rbtn_a, "Save", ()=>{console.log("save")}, "contain");
        addButton(lbtn_a, "Reset", ()=>{console.log("reset")}, "outline");
        addButton(lbtn_a, "Save", ()=>{console.log("save")}, "contain");
    }
}

let options = new Options();
options.open(OPTIONS.FILE);