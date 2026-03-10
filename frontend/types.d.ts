interface Window {
    electron: {
        setCookie: (cookie: Electron.CookiesSetDetails) => Promise<void>;
        removeCookie: (url: string, name: string) => Promise<void>;
    };
}
