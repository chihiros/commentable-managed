import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld(
    "app", {
        sendMainSend: (msg: string): void => {
            ipcRenderer.invoke('send:message', msg);
        },
        receiveMessage: (callback: (msg: string) => void) => {
            ipcRenderer.on('receive:message', (_: IpcRendererEvent, msg: string) => {
                callback(msg);
            });
        }
    }
);
