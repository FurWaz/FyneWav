class DropMenu {
    constructor() {
        this.dom = document.createElement("div");
        this.dom.classList.add("drop-menu");
        /** @type {DropOption[]} */
        this.options = [];
        this.dims = this.dom.getBoundingClientRect();
        this.dist = 250;
        this.showing = false;
        this.lastID = "";
    }
    addOption(o) {
        this.options.push(o);
    }
    clearOptions() {
        this.options = [];
    }
    show(newID) {
        setTimeout(() => {
            while(this.dom.firstChild) this.dom.firstChild.remove();
            this.dom.style.maxHeight = (window.innerHeight/2)+"px";
            this.options.forEach(op => {
                this.dom.appendChild(op.dom);
            });
            this.dims = this.dom.getBoundingClientRect();
            this.showing = true;
            this.dom.style.opacity = "1";
            this.lastID = newID;
        }, 5);
    }
    hide () {
        this.dom.style.maxHeight = "0px";
        this.showing = false;
        this.dom.style.opacity = "0";
        this.lastID = "";
    }
    toggle(newID) {
        if (newID == this.lastID) {
            this.hide();
        } else {
            this.show(newID);
        }
    }
    /**
     * Move the dropBox at the new position
     * @param {Position} p 
     */
    setPos(p) {
        this.dom.style.left = p.x+"px";
        this.dom.style.top = p.y+"px";
    }
    /**
     * Returns if the position is in the bounds of the dropBOx
     * @param {Position} p 
     * @returns true if in the dropBox's bounds
     */
    hitbox(p) {
        this.dims = this.dom.getBoundingClientRect();
        return p.x >= this.dims.x && p.x <= this.dims.x + this.dims.width &&
               p.y >= this.dims.y && p.y <= this.dims.y + this.dims.height;
    }
}

class DropOption {
    constructor(title, callback) {
        this.title = title;
        this.callback = callback;
        this.dom = document.createElement("p");
        this.dom.classList.add("drop-option");
        this.dom.onclick = callback;
        this.dom.innerHTML = title;
    }
}

const dropMenu = new DropMenu();
document.getElementById("dropmenu-container").appendChild(dropMenu.dom);

let fileBtn = document.getElementById("file-btn");
let optionsBtn = document.getElementById("options-btn");
let aboutBtn = document.getElementById("about-btn");

fileBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = fileBtn.getBoundingClientRect();
    dropMenu.setPos(new Position(dims.x, dims.y+dims.height+4));
    dropMenu.addOption(new DropOption("New project", ()=>{console.log("New project")}));
    dropMenu.addOption(new DropOption("Open project", ()=>{console.log("Open project")}));
    dropMenu.addOption(new DropOption("Save project", ()=>{console.log("Save project")}));
    dropMenu.addOption(new DropOption("Quit", quit));
    dropMenu.toggle(fileBtn.id);
});

optionsBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = optionsBtn.getBoundingClientRect();
    dropMenu.setPos(new Position(dims.x, dims.y+dims.height+4));
    dropMenu.addOption(new DropOption("General options", ()=>{options.open(OPTIONS.GENERAL); dropMenu.hide();}));
    dropMenu.addOption(new DropOption("Audio options", ()=>{options.open(OPTIONS.AUDIO); dropMenu.hide();}));
    dropMenu.addOption(new DropOption("Video options", ()=>{options.open(OPTIONS.VIDEO); dropMenu.hide();}));
    dropMenu.addOption(new DropOption("File options", ()=>{options.open(OPTIONS.FILE); dropMenu.hide();}));
    dropMenu.toggle(optionsBtn.id);
});

aboutBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = aboutBtn.getBoundingClientRect();
    dropMenu.setPos(new Position(dims.x, dims.y+dims.height+4));
    dropMenu.addOption(new DropOption("About FyneWav", ()=>{console.log("About FyneWav")}));
    dropMenu.addOption(new DropOption("Credits", ()=>{console.log("Credits")}));
    dropMenu.toggle(aboutBtn.id);
});