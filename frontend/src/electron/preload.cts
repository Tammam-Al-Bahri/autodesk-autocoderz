const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
    setCookie: (cookie: Electron.CookiesSetDetails) =>
        electron.session.defaultSession.cookies.set(cookie),

    removeCookie: (url: string, name: string) =>
        electron.session.defaultSession.cookies.remove(url, name),
});
