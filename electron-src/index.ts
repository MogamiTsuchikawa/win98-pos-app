// Native
import { join } from "path";
import { format } from "url";
import fs from "fs";
import path from "path";
import {
  PosPrinter,
  PosPrintData,
  PosPrintOptions,
} from "electron-pos-printer";

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from "electron";
import isDev from "electron-is-dev";
import prepareNext from "electron-next";

import { CartItem } from "../renderer/interfaces/item";

const appDir = path.dirname(require.main!.filename);
const jsonFilePath = path.join(appDir, "items.json");

const options = {
  preview: false,
  margin: "0 0 0 0",
  copies: 1,
  printerName: "POS58 Printer",
  timeOutPerLine: 400,
  pageSize: "58mm",
};

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

ipcMain.on("submit", (event: IpcMainEvent, items: any) => {
  console.log(event);
  const {
    inputMoney,
    cartItems,
  }: { inputMoney: number; cartItems: CartItem[] } = items;
  let sumValue = 0;
  cartItems.forEach((item) => {
    sumValue += item.price;
  });

  const data: PosPrintData[] = [
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "でじくり",
      style: { fontWeight: "700", textAlign: "center", fontSize: "24px" },
    },
    {
      type: "table",
      style: { border: "1px solid #ddd" },
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: [
        ...cartItems.map((item) => {
          return [item.name, item.price.toString() + "円"];
        }),
        ["合計", sumValue.toString() + "円"],
        ["お預かり", inputMoney.toString() + "円"],
        ["お釣り", (inputMoney - sumValue).toString() + "円"],
      ],
      // custom style for the table body
      tableBodyStyle: { border: "0.5px solid #ddd" },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "あざした",
      style: { fontWeight: "700", textAlign: "center", fontSize: "15px" },
    },
  ];
  PosPrinter.print(data, options as PosPrintOptions);
});
ipcMain.on("exit", () => {
  console.log("quit");
  app.quit();
});
