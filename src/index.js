const ProcessExit = require('./util/processexit');
const Client = require('./util/client');

new ProcessExit();

const client = new Client();
client.init()

console = {
    log: (msg) => {},
    warn: (msg) => {},
    error: (msg) => {},
    debug: (msg) => {}
}