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
    load() {
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
    onload() {

    }
}

class Config {
    constructor() {
        this.version = new Version("0.0.0");
        this.screen = {
            width: 1280,
            height: 720,
            fullscreen: false
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
        let tab = str.split(".");
        this.major = tab[0];
        this.middle = tab[1];
        this.minor = tab[2];
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