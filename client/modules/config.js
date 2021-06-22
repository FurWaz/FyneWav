class Config {
    constructor() {
        this.data = {};
        this.loadConfig();
    }

    loadConfig() {
        this.data = ipcRenderer.sendSync("getConfigFile");
        fileExplorer.dom.style.width = this.data.ui.explorerSize+"%";
        arranger.dom.style.height = this.data.ui.arrangerSize+"%";
        document.getElementById("racks-container").style.width = this.data.ui.rackSize+"%";
    }

    saveConfig() {
        let str = fileExplorer.dom.style.width
        this.data.ui.explorerSize = parseFloat(str.substring(0, str.length-1).trim());
        str = arranger.dom.style.height
        this.data.ui.arrangerSize = parseFloat(str.substring(0, str.length-1).trim());
        str = document.getElementById("racks-container").style.width
        this.data.ui.rackSize = parseFloat(str.substring(0, str.length-1).trim());
        ipcRenderer.send("setConfigFile", this.data);
    }
}

let config = new Config();