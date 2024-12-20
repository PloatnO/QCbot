const ModuleLoader = require('./util/moduleLoader');
const ProcessExit = require('./util/processexit');
const Konsole = require('./util/Konsole');
const fs = require('fs');
const path = require('path');
const checkFile = (file) => fs.existsSync(file) ? 1 : 0;

new ProcessExit();
new ModuleLoader('../modules')

if (checkFile(path.join(__dirname, '../config.yaml')) === 0) {
    new Konsole().warn('Config file not found. Creating a template in the current directory.');
    fs.copyFileSync(path.join(__dirname, './data/example_config.yaml'), path.join(__dirname, '../config.yaml'));
    process.exit(1);
}



console = {
    log: (msg) => {},
    warn: (msg) => {},
    error: (msg) => {},
    debug: (msg) => {}
}