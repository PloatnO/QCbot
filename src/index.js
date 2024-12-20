const ModuleLoader = require('./util/moduleLoader');
const ProcessExit = require('./util/processexit');
const Client = require('./util/client');

const client = new Client();

new ProcessExit();
new ModuleLoader('../modules', client).loadModules();