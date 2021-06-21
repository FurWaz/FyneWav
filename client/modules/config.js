class Config {
    constructor() {
        this.data = {};
        this.loadConfig();
    }

    loadConfig() {
        this.data = ipcRenderer.sendSync("getConfigFile");
        console.log(this.data);
        document.getElementById("file-explorer").style.width = this.data.ui.explorerSize+"%";
        document.getElementById("arranger").style.height = this.data.ui.arrangerSize+"%";
        document.getElementById("racks").style.width = this.data.ui.rackSize+"%";
    }

    saveConfig() {
        let str = document.getElementById("file-explorer").style.width
        this.data.ui.explorerSize = parseFloat(str.substring(0, str.length-1).trim());
        str = document.getElementById("arranger").style.height
        this.data.ui.arrangerSize = parseFloat(str.substring(0, str.length-1).trim());
        str = document.getElementById("racks").style.width
        this.data.ui.rackSize = parseFloat(str.substring(0, str.length-1).trim());
        ipcRenderer.send("setConfigFile", this.data);
    }
}

let config = new Config();