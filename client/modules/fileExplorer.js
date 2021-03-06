const FILE_CONST = {
    AUDIO_FILE: 1,
    PROJECT_FILE: 2,
    PRESET_FILE: 3
};

class DiskElement {
    constructor(name, path) {
        /** @type {String} */
        this.name = name;
        /** @type {String} */
        this.path = path;

        if (this.name == null)
            this.name = this.nameFromPath(this.path);

        this.dom = document.createElement("div");
        this.title = document.createElement("p");
        this.dom.classList.add("diskElement");
        this.title.classList.add("diskElement");
        this.title.innerHTML = this.name;
        this.dom.appendChild(this.title);
    }

    nameFromPath(path) {
        let tab = path.split("/");
        tab = tab[tab.length-1].split("\\")
        if (tab[tab.length-1] == "")
            return tab[tab.length-2];
        else return tab[tab.length-1];
    }

    get nbrFiles() {
        return 1;
    }

    findFile(fileDiv) {
        return (this.title == fileDiv)? this: null;
    }
}

class FolderElement extends DiskElement {
    constructor(name, path, parent) {
        super(name, path);
        /** @type {FolderElement} */
        this.parent = parent;
        /** @type {DiskElement[]} */
        this.files = [];
        this.title.onclick = () => {
            this.toggleExpand();
        };
        this.container = document.createElement("div");
        this.container.classList.add("folder");
        this.title.classList.add("folder");
        this.dom.appendChild(this.container);

        this.expanded = false;
        this.filesLoaded = false;
    }
    addElement(e) {
        this.files.push(e);
    }
    async toggleExpand() {
        if (this.expanded) {
            this.container.style.maxHeight = "0px";
            this.container.style.opacity = "0";
            setTimeout(() => {
                clearDiv(this.container);
            }, 200);
        } else {
            this.container.style.opacity = "1";
            if (!this.filesLoaded) {
                let fls = await askForFiles(this.path);
                fls.forEach(f => {
                    if (f.isDir)
                    this.addElement(new FolderElement(f.name, this.path+"/"+f.name, this));
                    else
                    this.addElement(new FileElement(f.name, this.path+"/"+f.name));
                });
                this.filesLoaded = true;
            }
            this.files.forEach(f => {
                this.container.appendChild(f.dom);
            })
            this.updateHeight();
        }
        this.expanded = !this.expanded;
    }

    get nbrFiles() {
        let files = 1;
        this.files.forEach(f => {
            files += f.nbrFiles;
        });
        return files;
    }

    get folderName() {
        let tab = this.path.split("/");
        tab = tab[tab.length-1].split("\\")
        if (tab[tab.length-1] == "")
            return tab[tab.length-2];
        else return tab[tab.length-1];
    }

    updateHeight() {
        this.container.style.maxHeight = this.nbrFiles*this.title.getBoundingClientRect().height+"px";
        if (this.parent != null)
            this.parent.updateHeight();
    }

    findFile(fileDiv) {
        for (let i = 0; i < this.files.length; i++) {
            let res = this.files[i].findFile(fileDiv);
            if (res != null) return res;
        }
        return null;
    }

    async refresh() {
        this.files = [];
        this.filesLoaded = false;
        this.expanded = false;
        this.toggleExpand();
    }
}

class FileElement extends DiskElement {
    constructor(name, path) {
        super(name, path);
        this.title.classList.add("file");
        switch (this.extension) {
            case "fyn":
                this.title.style.color = "var(--color-green-light)";
                this.type = FILE_CONST.PROJECT_FILE;
                break;
            case "wav":
            case "ogg":
            case "flac":
                this.title.style.color = "var(--color-yellow-light)";
                this.type = FILE_CONST.AUDIO_FILE;
                break;
            case "fxp":
                this.title.style.color = "var(--color-red-light)";
                this.type = FILE_CONST.PRESET_FILE;
                break;
        
            default:
                break;
        }
        this.title.onclick = () => {this.onclick();};
    }

    get extension() {
        let arr = this.name.split(".");
        return arr[arr.length-1];
    }

    onclick() {
        switch (this.type) {
            case FILE_CONST.AUDIO_FILE:
                engine.playSound(this.path);
                break;
        
            default:
                break;
        }
    }
}

class FileExplorer{
    constructor() {
        this.dom = document.getElementById("file-explorer-container");
        this.roots = [];
        setTimeout(() => {
            this.generateExplorers();
        }, 10);
    }

    reload() {
        this.roots = [];
        this.generateExplorers();
    }
    
    generateExplorers() {
        clearDiv(this.dom);
        config.data.folders.kit.forEach(k => {
            let root = new FolderElement(null, k);
            this.roots.push(root);
            this.dom.appendChild(root.dom);
        });
    }

    /**
     * @param {HTMLDivElement} fileDiv 
     */
    findFile(fileDiv) {
        for (let i = 0; i < this.roots.length; i++) {
            let res = this.roots[i].findFile(fileDiv);
            if (res != null) return res;
        }
        return null;
    }
}

async function askForFiles(path) {
    return ipcRenderer.sendSync("askForFiles", path);
}

function getRootFolder() {
    return ipcRenderer.sendSync("getRootFolder");
}

let fileExplorer = new FileExplorer();