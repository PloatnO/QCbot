const ModuleLoader = require('./util/moduleLoader');
const Konsole = require('./util/Konsole');
const processController = require('./util/processexit')()
const konsole = new Konsole()

const client = "balls"

new ModuleLoader('../modules', client, konsole).loadModules();
