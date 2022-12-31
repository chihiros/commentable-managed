declare global {
    interface Window {
        app: IMainProcess;
    }
}

export interface IMainProcess {
    sendMainSend: (msg: string) => void;
    receiveMessage: (callback: (msg: string) => void) => void;
}
