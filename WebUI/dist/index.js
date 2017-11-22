"use strict";
class App {
    constructor() {
        this.apiPath = '/api/v1/media/';
        this.volumeStep = 5;
        // private online = true
        this._online = true;
        this.init();
    }
    get online() {
        return this._online;
    }
    set online(v) {
        this._online = v;
        let offlineUI = document.querySelector('#offline');
        offlineUI.hidden = v;
    }
    get error() {
        return this._error;
    }
    set error(v) {
        this._error = v;
        let errorUI = document.querySelector('#error');
        errorUI.innerText = v;
        errorUI.hidden = !v;
    }
    init() {
        // https://stackoverflow.com/a/36249012/451043
        let controls = Array.from(document.querySelectorAll('.controls button'));
        for (const button of controls) {
            button.addEventListener('click', event => this.commandClick(event));
        }
        // add events
        // https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
        if (typeof document.hidden != undefined) {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.checkConnection();
                }
            });
        }
    }
    commandClick(event) {
        let element = event.currentTarget;
        this.sendCommand(element.name);
    }
    sendCommand(cmd) {
        if (cmd == 'volume-up' || cmd == 'volume-down')
            cmd += this.volumeStep;
        // https://developers.google.com/web/updates/2015/03/introduction-to-fetch
        fetch(this.apiPath + cmd, { method: 'POST' })
            .then(response => {
            if (this.error)
                this.error = '';
            if (!this.online)
                this.checkConnection();
        })
            .catch(error => {
            this.error = `Command '${cmd}' failed.`;
            if (this.online)
                this.checkConnection();
        });
    }
    checkConnection() {
        fetch(this.apiPath + 'test')
            .then(response => {
            this.online = true;
        })
            .catch(error => {
            this.online = false;
        });
    }
}
let app = new App();
//# sourceMappingURL=index.js.map