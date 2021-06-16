const { TouchBarSlider } = require("electron");

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
    }
    toggle(newID) {
        console.log(newID == this.lastID);
        console.log(newID +" | "+ this.lastID);
        if (newID == this.lastID) {
            this.hide();
            this.lastID = "";
        } else {
            this.show(newID);
        }
    }
    setPos(x, y) {
        this.dom.style.left = x+"px";
        this.dom.style.top = y+"px";
    }
    hitbox(x, y) {
        this.dims = this.dom.getBoundingClientRect();
        return x >= this.dims.x && x <= this.dims.x + this.dims.width &&
               y >= this.dims.y && y <= this.dims.y + this.dims.height;
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
document.getElementById("nosize").appendChild(dropMenu.dom);

let fileBtn = document.getElementById("file-btn");
let optionsBtn = document.getElementById("options-btn");
let aboutBtn = document.getElementById("about-btn");

fileBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = fileBtn.getBoundingClientRect();
    dropMenu.setPos(dims.x, dims.y+dims.height+4);
    dropMenu.addOption(new DropOption("New project", ()=>{console.log("New project")}));
    dropMenu.addOption(new DropOption("Open project", ()=>{console.log("Open project")}));
    dropMenu.addOption(new DropOption("Save project", ()=>{console.log("Save project")}));
    dropMenu.addOption(new DropOption("Quit", quit));
    dropMenu.toggle(fileBtn.id);
});

optionsBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = optionsBtn.getBoundingClientRect();
    dropMenu.setPos(dims.x, dims.y+dims.height+4);
    dropMenu.addOption(new DropOption("General options", ()=>{console.log("General options")}));
    dropMenu.addOption(new DropOption("Audio options", ()=>{console.log("Audio options")}));
    dropMenu.addOption(new DropOption("Video options", ()=>{console.log("Video options")}));
    dropMenu.toggle(optionsBtn.id);
});

aboutBtn.addEventListener("mousedown", ev => {
    dropMenu.clearOptions();
    let dims = aboutBtn.getBoundingClientRect();
    dropMenu.setPos(dims.x, dims.y+dims.height+4);
    dropMenu.addOption(new DropOption("About FyneWav", ()=>{console.log("About FyneWav")}));
    dropMenu.addOption(new DropOption("Credits", ()=>{console.log("Credits")}));
    dropMenu.toggle(aboutBtn.id);
});