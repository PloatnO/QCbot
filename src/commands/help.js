const util = require('util')
const { MessageBuilder } = require('prismarine-chat')('1.20.4')
module.exports = {
    name: 'help',
    description: 'Sends this message | Sends Commands',
    level: 'public',
    aliases: ['commands','heko','cmds','hel','elp','h'],
    execute(context) {
        const client = context.client
        if (client.uuid === context.uuid) return;
        let commands = client.commandHandler.commands;
        const konsole = context.konsole;

        const formatedCmds = Array.from(commands).map(cmd => {
            const trust = cmd.level === "public" ? 1 : cmd.level === "trusted" ? 2 : cmd.level === 'owner' ? "OWNER" : 'Unknown';
            const color = cmd.level === "public" ? client.config.scheme.mainColor : cmd.level === "trusted" ? client.config.scheme.secondaryColor : cmd.level === 'owner' ? client.config.scheme.tertiaryColor : client.config.scheme.quinaryColor;
            return new MessageBuilder().setText(`${cmd.name}`).setColor(color).setHoverEvent('show_text', 
                new MessageBuilder().setTranslate("| %s: %s\n| %s: %s").addWith(
                    new MessageBuilder().setText("Command"),
                    new MessageBuilder().setText(cmd.name),

                    new MessageBuilder().setText("Trust"),
                    new MessageBuilder().setText(trust.toString()),
                )
            ).addExtra(
                new MessageBuilder().setText(" ")
            );
        });

        client.core.tellraw(formatedCmds)
    },
}