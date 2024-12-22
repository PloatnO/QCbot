const Config = require('../modules/Config');
const Core = require('./Core');
const Konsole = require('./Konsole');
const protocol = require('minecraft-protocol')
const parser = require('../util/parser')

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
            version: '1.20.4',
            auth: 'offline'
        });
        this.client = client
        parser.inject(this.client)

        this.client['konsole'] = {
            log: (msg) => new Konsole().log(msg),
            warn: (msg) => new Konsole().warn(msg),
            error: (msg) => new Konsole().error(msg),
            debug: (msg) => new Konsole().debug(msg)
        }

        this.client.options = {
            actionbar: false,
            bossbar: false,
            title: false
        }
        coreInit(this.client)
        return this.client
    }
}

function coreInit(client) {
    setTimeout( async () => {
        if (client?.pos && typeof client.pos === 'object') {
            client.core = new Core(client)
            client.write('settings', {
                locale: 'en_us',
                skinParts: 255
            })
        } else {
            coreInit(client)
        }
    }, 275);
}

module.exports = Client