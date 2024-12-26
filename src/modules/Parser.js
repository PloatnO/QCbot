const fs = require('fs');
const path = require('path');

class Parsers {
    constructor(context) {
        this.filePath = '../data/parsers';
        this.context = context;
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.parsers = fs.readdirSync(path.join(__dirname, this.filePath)).filter(file => file.endsWith('.js'));
        this.konsole.debug(`Found ${this.parsers.length} parsers`);
        this.konsole.debug(`Injecting Parsers`);
        this.parsers.forEach(parser => {
            const Parser = require(path.join(__dirname, this.filePath, parser));
            new Parser(this.context)
        });
    }
}

module.exports = Parsers;