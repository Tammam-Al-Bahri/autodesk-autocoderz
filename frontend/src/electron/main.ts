import { app, BrowserWindow } from "electron";
import { isDev } from "./util.js";
import { getPreloadPath, getUIPath } from "./pathResolver.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5420/");
    } else {
        mainWindow.loadFile(getUIPath());
    }
});
