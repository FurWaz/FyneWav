const engine = require("../build/Release/engine.node");
const { ipcMain } = require("electron");

class Engine {
    constructor() {
        ipcMain.on("engine.event.playsound", (ev, args) => {
            this.playSound(args.path);
        });
        ipcMain.on("engine.event.getvolume", (ev, args) => {
            ev.returnValue = this.getVolume();
        });
        ipcMain.on("engine.event.getprocessor", (ev, args) => {
            ev.returnValue = this.getProcessor();
        });
        ipcMain.on("engine.start", (ev, args) => {
            engine.start();
        });
        ipcMain.on("engine.stop", (ev, args) => {
            engine.stop();
        });
    }
    playSound(path) {
        engine.playSound(path);
    }
    getVolume() {
        return engine.getVolume();
    }
    getProcessor() {
        return engine.getProcessor();
    }
    start() {
        engine.start();
    }
    stop() {
        engine.stop();
    }
}

module.exports = { Engine };