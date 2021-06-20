const { BrowserWindow, app, ipcMain } = require("electron");
const { ConfigLoader, Version } = require("./config");
const fs = require("fs");

const { Engine } = require("./engine");
let engine = new Engine();

const FOLDER_ROOT = __dirname+"/..";
const FOLDER_CLIENT = FOLDER_ROOT+"/client";
const FOLDER_SERVER = FOLDER_ROOT+"/server";
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
        engine.start();
    });
    if (configLoader.data.screen.maximized)
        window.maximize();
    window.menuBarVisible = false;
}

app.on("window-all-closed", () => {
    engine.stop();
    app.quit();
});

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

ipcMain.on("getRootFolder", (ev, args) => {
    ev.returnValue = FOLDER_ROOT;
});