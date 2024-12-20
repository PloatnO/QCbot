const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Konsole = require('../util/Konsole');
const util = require('util');

const ConfigPath = '../../config.yaml';
// Parker2991 was here :3
class Config {
    constructor() {
        this.config = {};
        this.debounceTimers = new Map();
        this.watchConfigFile();
        this.get();
    }

    async get() {
        try {
            const file = fs.readFileSync(path.join(__dirname, ConfigPath), 'utf8');
            this.config = yaml.load(file);
            new Konsole().log('Config file loaded: ' + util.inspect(this.config));
        } catch (e) {
            new Konsole().error('Error reading config file:', e);
        }
    }

    watchConfigFile() {
        fs.watch(path.join(__dirname, ConfigPath), (eventType, filename) => {
            if (eventType === 'change') {
                if (this.debounceTimers.has(filename)) {
                    clearTimeout(this.debounceTimers.get(filename));
                }
                this.debounceTimers.set(filename, setTimeout(() => {
                    new Konsole().log('Config file changed, reloading...');
                    this.get();
                    this.debounceTimers.delete(filename);
                }, 100));
            }
        });
    }
}

module.exports = Config;
