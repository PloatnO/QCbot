const Config = require('../modules/Config');
const Konsole = require('../modules/Konsole');
const protocol = require('minecraft-protocol')

class Client {
    constructor(getClient) {
        if (getClient) return this.client;
        this.client = null;
        new Konsole().log('Client initialized');
        this.init()
    }

    async init() {
        this.config = await new Config().get();
        //new Konsole().debug('Config: ' + JSON.stringify(this.config));
        this.client = protocol.createClient({
            host: this.config.server.host,
            port: this.config.server.port,
            username: this.config.user.name,
            version: '1.20.4',
            auth: 'offline'
        });
        //new Konsole().debug('Client: ' + JSON.stringify(this.client));
    }
}

module.exports = Client