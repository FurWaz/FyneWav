const { BrowserWindow, app, ipcMain } = require("electron");
const { ConfigLoader, Version } = require("./config");
const fs = require("fs");

const FOLDER_ROOT = __dirname+"/..";
const FOLDER_CLIENT = FOLDER_ROOT+"/client";
const FOLDER_DATA = FOLDER_ROOT+"/data";
const FOLDER_RESOURCES = FOLDER_ROOT+"/resources";
const VERSION = new Version("0.1.0");

const configLoader = new ConfigLoader(FOLDER_DATA+"/config.json");
configLoader.load();

/**@type {BrowserWindow} */
var window = null;

app.whenReady().then(() => {
    if (!configLoader.loaded) configLoader.onload = createWindow;
    else createWindow();
});

function createWindow() {
    window = new BrowserWindow({
        width: configLoader.data.screen.width,
        height: configLoader.data.screen.height,
        fullscreen: configLoader.data.screen.fullscreen,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        icon: FOLDER_RESOURCES+"/icon.png"
    });
    window.loadFile(FOLDER_CLIENT+"/index.html").then(() => {
        
    });
    window.menuBarVisible = false;
}

ipcMain.on("quit", (evt, args) => {
    app.quit();
});
ipcMain.on("reload", (evt, args) => {
    window.loadFile(FOLDER_CLIENT+"/index.html");
});

ipcMain.on("askForFiles", (ev, args) => {
    fs.readdir(args, {}, (err, files) => {
        if (err)
        console.log("ERROR: Error listing files at "+args);
        else {
            let result = [];
            files.forEach(f => {
                if (f.startsWith(".")) return;
                result.push({name: f, isDir: fs.lstatSync(args+"/"+f).isDirectory()});
            });
            ev.returnValue = result;
        }
    })
});

const engine = require("../build/Release/engine.node")
ipcMain.on("checkDevices", (ev, args) => {
    ev.returnValue = engine.checkDevices();
})
ipcMain.on("openAl", (ev, args) => {
    ev.returnValue = engine.openAl();
})
ipcMain.on("setFreq", (ev, args) => {
    ev.returnValue = engine.setFreq(args);
})
ipcMain.on("stop", (ev, args) => {
    ev.returnValue = engine.stop();
})