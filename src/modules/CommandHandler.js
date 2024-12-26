const Config = require('../modules/Config')
const util = require('util')
const fs = require('fs')
const path = require('path')

class CmdHandler {
    constructor(context) {
        this.context = context;
        this.commands = new Set();
        this.commandPath = `../commands`;
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.config = await new Config().get();
        const cmdPath = path.join(__dirname, this.commandPath);
        const files = fs.readdirSync(cmdPath);

        for (const file of files) {
            const command = await import(`${cmdPath}/${file}`);
            this.commands.add(command.default);
        }

        this.client['commandHandler'] = {
            commands: this.commands
        }
        
        this.client.on('chat', (packet) => {
            try {
                const isChipmunk = packet.isChipmunk;
                const uuid = packet.selector ? snbtToUUID(packet.selector.toString()) : null;
                const username = uuid ? this.client.players[uuid].name : packet.username.split(' ')[1];
                const message = isChipmunk ? packet.message : packet.message.replace(/: /, '');
               
                const context = {
                    username: username,
                    uuid: uuid,
                    command: message.split(' ')[0],
                    message: message.split(' ').slice(1).join(' ').trim()
                }

                this.executeCommand(context)
            } catch {}
        });
    }

    async executeCommand(context) {
        const prefixes = this.client.config.user.prefixes;
        const commandName = prefixes.find(prefix => context.command.startsWith(prefix))
            ? context.command.slice(prefixes.find(prefix => context.command.startsWith(prefix)).length)
            : null;
        if (!commandName) return;
        const command = Array.from(this.commands).find(cmd => cmd.name === commandName || cmd.aliases.includes(commandName));
        if (!command) return;
        context['client'] = this.client, context['konsole'] = this.konsole,
        command.execute(context);
    }
}

function snbtToUUID(snbt) {
    try {
        if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(snbt)) {
            return snbt;
        }

        const parts = snbt.split(',').map(part => {
            const int = parseInt(part, 10);
            return (int >>> 0).toString(16).padStart(8, '0');
        });

        const uuid = `${parts[0]}-${parts[1].slice(0, 4)}-${parts[1].slice(4)}-${parts[2].slice(0, 4)}-${parts[2].slice(4)}${parts[3]}`;
        return uuid;
    } catch {}
}
module.exports = CmdHandler;