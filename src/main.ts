import { BrowserWindow, session, Menu, MenuItemConstructorOptions } from "electron";
import * as windowStateKeeper from "electron-window-state";
import * as fs from "fs";
import * as path from "path";

export class Main {
  private static PRELOADSCRIPT = "preload.js";
  private static CONFIGFILE = "config_internal.json";

  private static mainWindow: Electron.BrowserWindow;
  private static application: Electron.App;
  private static BrowserWindow;

  private static config = {
    domain: "",
    url: "",
    path: "",
  };

  private static menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Datei ",
      submenu: [
        { role: "reload" },
        { type: "separator" },
        { role: "quit", label: "SBS-Datenbank beenden" },
      ],
    },
    {
      // default accelerators funktionieren nicht -> im Menue ausblenden
      label: "Fenster",
      submenu: [
        { role: "minimize", label: "Minimieren", accelerator: "" },
        { type: "separator" },
        { role: "resetZoom", label: "Originalgröße", accelerator: "" },
        { role: "zoomIn", label: "Vergrößern", accelerator: "" },
        { role: "zoomOut", label: "Verkleinern", accelerator: "" },
        { type: "separator" },
        {
          label: "Entwicklertools",
          click: () => Main.mainWindow.webContents.openDevTools(),
          accelerator: process.platform !== "darwin" ? "Shift+Ctrl+I" : "Alt+Cmd+I",
          //visible: development,
        },
      ],
    },
  ];

  private static getConfig() {
    const conf = path.join(__dirname, Main.CONFIGFILE);
    const config = JSON.parse(fs.readFileSync(conf, "utf8"));
    if (process.platform !== "darwin") {
      Main.config.domain = config.win.domain;
      Main.config.url = config.win.url;
      Main.config.path = config.win.path;
    } else {
      Main.config.domain = config.osx.domain;
      Main.config.url = config.osx.url;
      Main.config.path = config.osx.path;
    }
  }
  private static startApp() {
    console.log("start app");
    // const ntlmString = process.platform !== "darwin" ? "*v998dpve.v998.intern" : "*keinekekse.net";
    // const appUrl =
    //   process.platform !== "darwin"
    //     ? "https://e077app1.v998dpve.v998.intern"
    //     : "http://sbsdb.keinekekse.net:8000";
    // allow kerberos
    session.defaultSession.allowNTLMCredentialsForDomains(Main.config.domain);
    // Tell Electron where to load the entry point from
    Main.mainWindow.loadURL(Main.config.url + Main.config.path);

    // Debug
    Main.mainWindow.webContents.openDevTools();

    Main.mainWindow.on("closed", Main.onClose);
  }

  private static createWindow() {
    // Load the previous window state with fallback to defaults
    const mainWindowState = windowStateKeeper({
      defaultWidth: 1200,
      defaultHeight: 900,
    });

    // Initialize the window to our specified dimensions
    Main.mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      autoHideMenuBar: true,
      webPreferences: {
        devTools: true,
        preload: path.join(__dirname, Main.PRELOADSCRIPT),
      },
    });

    // Let us register listeners on the window, so we can update the state
    // automatically (the listeners will be removed when the window is closed)
    // and restore the maximized or full screen state
    mainWindowState.manage(Main.mainWindow);

    const menu = Menu.buildFromTemplate(Main.menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }

  private static onActivate() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (Main.mainWindow === null) {
      Main.onReady();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.createWindow();
    Main.startApp();
  }

  public static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    // we pass the Electron.App object and the
    // Electron.BrowserWindow into this function
    // so this class has no dependencies. This
    // makes the code easier to write tests for
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.getConfig();
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("activate", Main.onActivate);
    Main.application.on("ready", Main.onReady);
  }
}
