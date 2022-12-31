import { BrowserWindow, app, Menu, screen, ipcMain, IpcMainInvokeEvent } from 'electron'
import prompt from 'electron-prompt';
// const prompt = require('electron-prompt');
import path from "path";

const mainURL = `file://${__dirname}/render/index.html`

const is_windows = process.platform === 'win32'
const is_mac = process.platform === 'darwin'
const is_linux = process.platform === 'linux'

function createWindow() {
    console.log(screen.getAllDisplays());

    // モニタのサイズを取得する
    const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

    // アクティブなウィンドウを取得する
    const activeWindow = BrowserWindow.getFocusedWindow();
    // アクティブなウィンドのX座標を取得する
    const x = activeWindow?.getPosition()[0];
    // アクティブなウィンドのY座標を取得する
    const y = activeWindow?.getPosition()[1];

    const win = new BrowserWindow({
        // title: "Electronaaaa",
        width: width,
        // height: height,
        height: (height != null) ? height / 2 : 0,
        x: x,
        y: y,
        // // yは半分にす
        // y: (y != null) ? y + (height / 2) : 0,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        focusable: false,
        transparent: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });
    win.setIgnoreMouseEvents(true);
    win.loadURL(mainURL);
    win.on('ready-to-show', () => {
        win.webContents.send('receive:message', "Hello Electron!!");
    });

    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();
    let menu = Menu.buildFromTemplate(
        [{
            label: app.name,
            submenu: [
                {role: 'quit', label: `${app.name}を終了`}
            ]
        }]
    );
    Menu.setApplicationMenu(menu);

    prompt({
        title: 'Electron',
        label: 'Enter your name:',
        value: 'John Doe',
        inputAttrs: {
            type: 'text'
            // required: true
        },
        buttonLabels: {
            ok: 'OK',
            cancel: 'Cancel'
        },
        type: 'input',
        alwaysOnTop: true,
        // costomStylesheet: path.join(__dirname, 'prompt.css')
    })
    .then((r: string | null) => {
        if(r === null) {
            console.log('user cancelled');
        } else {
            console.log('result', r);
        }
    })
    .catch(console.error);
});


app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.handle('send:message', (_: IpcMainInvokeEvent, msg: string) => {
    console.log(`ipcMain on : ${msg}`);
});
