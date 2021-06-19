const { ipcRenderer } = require("electron");

class Engine {
    constructor() {
        
    }
    playSound(path) {
        ipcRenderer.send("engine.event.playsound", {path: path});
    }
    getVolume() {
        return ipcRenderer.sendSync("engine.event.getvolume");
    }
    getProcessor() {
        return ipcRenderer.sendSync("engine.event.getprocessor");
    }
    start() {
        ipcRenderer.send("engine.start");
    }
    stop() {
        ipcRenderer.send("engine.stop");
    }
}

function quit() {
    ipcRenderer.send("quit");
}

function reload() {
    ipcRenderer.send("reload");
}

const engine = new Engine();