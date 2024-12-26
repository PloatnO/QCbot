const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Konsole = require('./Konsole');
const util = require('util');

const ConfigPath = '../../config.yaml';
// Parker2991 was here :3
class Config {
    constructor() {
        this.config = {};
        this.debounceTimers = new Map();
        this.get();
    }

    async get() {
        try {
            const file = fs.readFileSync(path.join(__dirname, ConfigPath), 'utf8');
            this.config = yaml.load(file);
            return this.config
        } catch (e) {
            new Konsole().error('Error reading config file:' + util.inspect(e));
        }
    }
}

module.exports = Config;
