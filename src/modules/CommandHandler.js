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
                }
                return
            }
            try {this.client.chat(packet.input)} catch {}
        })
    }
}

module.exports = CmdHandler;