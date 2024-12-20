const Config = require('../modules/Config');
const Konsole = require('./Konsole');
const protocol = require('minecraft-protocol')

let client = null;

class Client {
    constructor() {
        this.client = null;
    }

    async get() {
        return client
    }

    async init() {
        this.config = await new Config().get();
        client = protocol.createClient({
            host: this.config.server.host,
            port: this.config.server.port,
            username: this.config.user.name,
            version: '1.20.2',
            auth: 'offline'
        });
        this.client = client

        this.client['konsole'] = {
            log: (msg) => new Konsole().log(msg),
            warn: (msg) => new Konsole().warn(msg),
            error: (msg) => new Konsole().error(msg),
            debug: (msg) => new Konsole().debug(msg)
        }

        new Konsole().log('Client Started');
        return this.client
    }
}

module.exports = Client