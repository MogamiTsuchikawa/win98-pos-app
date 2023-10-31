// Native
import { join } from "path";
import { format } from "url";
import fs from "fs";
import path from "path";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

const appDir = path.dirname(require.main!.filename);
const jsonFilePath = path.join(appDir, "items.json");

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");

  const mainWindow = new BrowserWindow({
    frame: false,
    width: 800,
    height: 600,
    minHeight: 500,
    minWidth: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, "preload.js"),
    },
  });

  const url = isDev
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../renderer/out/index.html"),
        protocol: "file:",
        slashes: true,
      });

  mainWindow.loadURL(url);

  if (isDev) mainWindow.webContents.openDevTools();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);

ipcMain.on("loadJson", (event: IpcMainEvent) => {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("An error occurred while reading the JSON file:", err);
      return;
    }

    const items = JSON.parse(data);
    event.sender.send("loadedJson", items);
  });
});
ipcMain.on("exit", () => {
  console.log("quit");
  app.quit();
});
