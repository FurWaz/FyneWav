const { ipcMain } = require("electron");
const fs = require("fs");

class ConfigLoader {
    constructor(path) {
        /**@type {Config} */
        this.data = {};
        /**@type {String} */
        this.path = path;
        /**@type {Boolean} */
        this.loaded = false;
    }
    setup() {
        ipcMain.on("getConfigFile", (ev, args) => {
            ev.returnValue = this.data;
        });

        ipcMain.on("setConfigFile", (ev, args) => {
            this.data.ui = args.ui;
            this.data.folders = args.folders;
            this.save();
        });
    }

    load() {
        this.setup();
        fs.readFile(this.path, (err, data) => {
            if (err) {
                console.log("ERROR: Error loading file at "+this.path);
            } else {
                this.data = JSON.parse(data);
                this.data.version = new Version(this.data.version);
                this.onload();
            }
        })
    }

    save() {
        fs.writeFile(this.path, JSON.stringify(this.data, null, 4), ()=>{});
    }

    onload() {

    }
}

class Config {
    constructor() {
        this.version = new Version("0.0.0");
        this.screen = {
            width: 1280,
            height: 720,
            fullscreen: false,
            maximize: false
        },
        this.ui = {
            explorerSize: 15,
            arrangerSize: 15,
            rackSize: 15
        }
        this.folders = {
            kit: [],
            vst: []
        }
    }
}

/**
 * Version class: represents a version number in FyneWav
 */
class Version {
    /**
     * Version constructor
     * @param {String} str the stringified version number
     */
    constructor(str) {
        if (typeof str == String) {
            let tab = str.split(".");
            this.major = tab[0];
            this.middle = tab[1];
            this.minor = tab[2];
        } else {
            try {
                this.major = str.major;
                this.middle = str.middle;
                this.minor = str.minor;
            } catch {
                this.major = 0;
                this.middle = 0;
                this.minor = 0;
            }
        }
    }

    /**
     * Compares [this] ans [v].
     * Outputs 1 if [this] is greater, 0 is [v] is same as [this], -1 if [this] is lower than [v].
     * @param {Version} v Version to compare
     * @returns {Number} The result of the comparison
     */
    compareTo(v) {
        if (v.major < this.major) return 1;
        if (v.major > this.major) return -1;
        if (v.middle < this.middle) return 1;
        if (v.middle > this.middle) return -1;
        if (v.minor < this.minor) return 1;
        if (v.minor > this.minor) return -1;
        return 0;
    }

    /**
     * Comverts the Version object to string
     * @returns a string representing the Version
     */
    toString() {
        return this.major+"."+this.middle+"."+this.minor;
    }
}

module.exports = { ConfigLoader, Version };