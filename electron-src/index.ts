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

const options: PosPrintOptions = {
  preview: false,
  margin: "0 0 0 0",
  copies: 1,
  printerName: "POS58 Printer",
  timeOutPerLine: 400,
  pageSize: "58mm",
  boolean: "",
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
  console.log(items);
  let { inputMoney, jsonStr }: { inputMoney: number; jsonStr: string } = items;
  console.log(inputMoney);
  console.log(jsonStr);
  const cartItemList: CartItem[] = JSON.parse(jsonStr);
  let sumValue = 0;
  cartItemList.forEach((item) => {
    sumValue += item.price;
  });
  console.log(sumValue);

  const data: PosPrintData[] = [
    {
      type: "image",
      url: "https://r2.mogami.dev/14x.png", // file path
      position: "center", // position of image: 'left' | 'center' | 'right'
      width: "200px", // width of image in px; default: auto
      height: "137px", // width of image in px; default: 50 or '50px'
    },
    {
      type: "table",
      style: { border: "1px solid #ddd" },
      tableHeader: [],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: [
        ...cartItemList.map((item) => {
          return [item.name, item.price.toString() + "円"];
        }),
        ["", ""],
        ["合計", sumValue.toString() + "円"],
        ["お預かり", inputMoney.toString() + "円"],
        ["お釣り", (inputMoney - sumValue).toString() + "円"],
      ],
      tableFooter: [],
      // custom style for the table header
      tableHeaderStyle: { backgroundColor: "#000", color: "white" },
      // custom style for the table body
      tableBodyStyle: { border: "0.5px solid #ddd" },
      // custom style for the table footer
      tableFooterStyle: { backgroundColor: "#000", color: "white" },
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: "全て税込(10%)表記です",
      style: { fontWeight: "700", textAlign: "center", fontSize: "12px" },
    },
    {
      type: "image",
      url: "https://r2.mogami.dev/1_14x.png", // file path
      position: "center", // position of image: 'left' | 'center' | 'right'
      width: "200px", // width of image in px; default: auto
      height: "137px", // width of image in px; default: 50 or '50px'
    },
    {
      type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: " ",
      style: { fontWeight: "700", textAlign: "center", fontSize: "15px" },
    },
  ];
  PosPrinter.print(data, options as PosPrintOptions);
  const logFilePath = path.join(
    appDir,
    `log_${new Date()
      .toLocaleString()
      .replace(/\//g, "-")
      .replace(/:/g, "-")
      .replace(/ /g, "_")}.json`
  );
  console.log(logFilePath);
  fs.writeFileSync(logFilePath, jsonStr, "utf8");
});
ipcMain.on("exit", () => {
  console.log("quit");
  app.quit();
});
