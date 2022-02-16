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

        let kitDuplicate = [];
        let vstDuplicate = [];

        function populateKit() {
            let index = 0;
            addPlusListElement(kitList, ()=> {
                kitDuplicate.push("New element");
                addRemovableListElement(kitList, "New element", kitDuplicate.length-1, kitDuplicate);
            });
            config.data.folders.kit.forEach(el => {
                kitDuplicate.push(el);
                addRemovableListElement(kitList, el, index++, kitDuplicate);
            });
        } populateKit();
        
        function populateVst() {
            let index = 0;
            addPlusListElement(vstList, ()=> {
                vstDuplicate.push("New element");
                addRemovableListElement(vstList, "New element", vstDuplicate.length-1, vstDuplicate);
            });
            config.data.folders.vst.forEach(el => {
                vstDuplicate.push(el);
                addRemovableListElement(vstList, el, index++, vstDuplicate);
            });
        } populateVst();

        function applyKit() {
            config.data.folders.kit = [];
            kitDuplicate.forEach(k => {if (k != null) config.data.folders.kit.push(k);});
            fileExplorer.reload();
        }
        function applyVst() {
            config.data.folders.vst = [];
            vstDuplicate.forEach(v => {if (v != null) config.data.folders.vst.push(v);});
        }

        let rbtn_a = addXArranger(r);
        let lbtn_a = addXArranger(l);
        addButton(rbtn_a, "Reset", ()=>{clearDiv(vstList); vstDuplicate = []; populateVst()}, "outline");
        addButton(rbtn_a, "Save", ()=>{applyVst(); config.saveConfig();}, "contain");
        addButton(lbtn_a, "Reset", ()=>{clearDiv(kitList); kitDuplicate = []; populateKit()}, "outline");
        addButton(lbtn_a, "Save", ()=>{applyKit(); config.saveConfig();}, "contain");
    }
}

let options = new Options();