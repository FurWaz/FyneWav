var engine = null;
let engineError = "";
let engineMessage = "";
try {
    engine = require("../build/Release/engine.node");
} catch(e) {
    console.log("Error loading audio engine, make sure OpenAL is installed.");
    engineError = e;
    engineMessage = "Error loading the main audio engine, please make sure OpenAL is installed:\n\
                    https://openal.org/downloads/oalinst.zip";
}
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

        ipcMain.on("engine.error.getState()", (ev, args) => {
            ev.returnValue = {
                err: engineError,
                msg: engineMessage
            };
        });
    }
    playSound(path) {
        if (engine != null)
            engine.playSound(path);
    }
    getVolume() {
        if (engine == null) return 0;
        return engine.getVolume();
    }
    getProcessor() {
        if (engine == null) return 0;
        return engine.getProcessor();
    }
    start() {
        if (engine != null)
            engine.start();
    }
    stop() {
        if (engine != null)
            engine.stop();
    }
}

module.exports = { Engine };