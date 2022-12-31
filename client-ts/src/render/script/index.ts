window.onload = () => {
    window.app.receiveMessage((msg: string) => {
        const contents = <HTMLDivElement>document.getElementById('contents');
        contents.innerHTML = msg;
    });
    window.app.sendMainSend('Start Renderer proces.');
}
