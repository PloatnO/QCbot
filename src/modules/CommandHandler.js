const Config = require('../modules/Config')
const util = require('util')

class CmdHandler {
    constructor(context) {
        this.context = context;
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.config = await new Config().get();
        this.client.on('konsole:input', (packet) => {
            const [command, ...args] = packet.input.split(' ');
            if (command.startsWith(this.config.konsole.prefix)) {
                const cmd = command.slice(this.config.konsole.prefix.length);
                const client = this.client;
                const context = this.context;
                if (cmd === 'eval') {
                    let result;
                    try {
                        result = eval(args.join(' '))
                    } catch (e) {
                        result = e;
                    }
                    this.konsole.debug(util.inspect(result, { depth: 0, colors: true }));
                } else if (cmd === 'cloop') {
                    const type = args[0];
                    const interval = args[1];
                    const command = args.slice(2).join(' ');
                    if (type === 'add') {
                        if (!interval || !command) return;
                        this.client.cloop.add(interval, command);
                        this.konsole.debug(`Added cloop interval ${interval}ms with command ${command}`);
                    } else if (type === 'remove') {
                        if (!interval) return;
                        this.client.cloop.remove(interval);
                        this.konsole.debug(`Removed cloop interval ${interval}`);
                    } else if (type === 'list') {
                        const r = this.client.cloop.list();
                        this.konsole.debug(r);
                    } else if (type === 'clear') {
                        this.client.cloop.clear();
                        this.konsole.debug('Cleared cloop intervals');
                    } else {
                        this.konsole.debug('Invalid cloop command | \n cloop add <interval> <command> \n cloop remove <index> \n cloop list \n cloop clear');
                    }
                }
                return
            }
            try {this.client.chat(packet.input)} catch {}
        })
    }
}

module.exports = CmdHandler;