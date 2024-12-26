const Config = require('../modules/Config');
const Core = require('./Core');
const Konsole = require('../modules/Konsole');
const protocol = require('minecraft-protocol');
const parser = require('../util/parser');
const ModuleLoader = require('./moduleLoader');

const player = require('./players');
const tabcomplete = require('./tab_complete');

class Client {
    constructor() {
        this.clients = [];
    }

    async get() {
        return this.clients;
    }

    async init() {
        this.config = await new Config().get();
        Object.keys(this.config.servers).forEach((serverName) => {
            const server = this.config.servers[serverName];
            this.createClient(server);
        });
        return this.clients;
    }

    createClient(server) {
        new Konsole().debug(`Connecting to ${server.host}:${server.port}`);
        const client = protocol.createClient({
            host: server.host,
            port: server.port,
            username: this.config.user.name,
            version: '1.20.4',
            auth: 'offline'
        });
        parser.inject(client);
        player.inject(client);
        tabcomplete.inject(client);
        client['startClient'] = () => {
            this.createClient(server)
        }
        client['config'] = {
            host: server.host,
            port: server.port,
            ...this.config
        };

        client['konsole'] = {
            log: (msg) => new Konsole().log(msg),
            warn: (msg) => new Konsole().warn(msg),
            error: (msg) => new Konsole().error(msg),
            debug: (msg) => new Konsole().debug(msg)
        };

        client.options = {
            actionbar: false,
            bossbar: false,
            title: false
        };

        new ModuleLoader('../modules', client);
        coreInit(client);
        this.clients.push(client);
    }
}

function coreInit(client) {
    setTimeout(async () => {
        if (client?.pos && typeof client.pos === 'object') {
            client.core = new Core(client);
            client.write('settings', {
                locale: 'en_us',
                skinParts: 255
            });
        } else {
            coreInit(client);
        }
    }, 275);
}

module.exports = Client;