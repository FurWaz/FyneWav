class DiskElement {
    constructor(name, path) {
        /** @type {String} */
        this.name = name;
        /** @type {String} */
        this.path = path;

        this.dom = document.createElement("div");
        this.title = document.createElement("p");
        this.dom.classList.add("diskElement");
        this.title.classList.add("diskElement");
        this.title.innerHTML = this.name;
        this.dom.appendChild(this.title);
    }

    get nbrFiles() {
        return 1;
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
                this.files.forEach(f => {
                    this.container.appendChild(f.dom);
                })
                this.filesLoaded = true;
            }
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

    updateHeight() {
        this.container.style.maxHeight = this.nbrFiles*this.title.getBoundingClientRect().height+"px";
        if (this.parent != null)
            this.parent.updateHeight();
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
            case "fynewav":
                this.title.style.color = "var(--color-green-light)";
                break;
            case "mp2":
            case "mp3":
            case "wav":
            case "ogg":
            case "flac":
                this.title.style.color = "var(--color-yellow-light)";
                break;
            case "fxp":
                this.title.style.color = "var(--color-red-light)";
                break;
        
            default:
                break;
        }
    }
    get extension() {
        let arr = this.name.split(".");
        return arr[arr.length-1];
    }
}

class FileExplorer{
    constructor(path) {
        this.racine = new FolderElement("Root", path);
    }
}

async function askForFiles(path) {
    return ipcRenderer.sendSync("askForFiles", path);
}

var fileExplorer = new FileExplorer("C://Users/FurWaz/Desktop");
fileExplorer.racine.toggleExpand();
document.getElementById("file-explorer").appendChild(fileExplorer.racine.dom);