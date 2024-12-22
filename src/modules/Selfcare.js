const ChatMessage = require('prismarine-chat')('1.20.4');
const Config = require('./Config')
class Selfcare { 

    constructor(context) {
        this.client = context.client
        this.init()
    }

    async init() {
            const client = this.client
            const config = await new Config().get();

            let entityId;
            let permission = 2;
            let gameMode;
            let mute = false;
            let god = false;
            let prefix = false;
            let nick = false;
            let username = false;


            client.on("custom_systemChat", (a, message) => {
            const parsedMessage = new ChatMessage(message.jsonMsg.message)?.toMotd();
            if (parsedMessage?.startsWith("§6You have been muted")) mute = true;
            else if (parsedMessage?.startsWith("§6You have been unmuted")) mute = false;
            else if (parsedMessage?.startsWith("§6Your voice has been silenced")) mute = true;

            else if (parsedMessage === "§6God mode§c enabled§6.") god = true;
            else if (parsedMessage === "§6God mode§c disabled§6.") god = false;

            else if (parsedMessage?.startsWith("You now have the tag:")) prefix = true;
            else if (parsedMessage === "You no longer have a tag" || parsedMessage === "Something went wrong while saving the prefix. Please check console.") prefix = false;


            else if (parsedMessage?.startsWith('§6Your nickname is now')) nick = true;
            else if (parsedMessage === "§6You no longer have a nickname.") nick = false;

            else if (parsedMessage?.startsWith("Successfully set your username to ") || parsedMessage?.endsWith(`${config.user.name}`)) username = true;
            else if (parsedMessage === `Successfully set your username to "${config.user.name}"`) username = false;
            else if (parsedMessage === `You already have the username "${config.user.name}"`) username = false;

            });

            client.on('entity_status', (data) => {
            if (data.entityId !== entityId || data.entityStatus < 24 || data.entityStatus > 28) return;
            permission = data.entityStatus - 24
            });

            client.on('game_state_change', (data) => {
            if (data.reason !== 3) return; // Reason 3 = Change Game Mode
            if (data.reason !== 4) return;
            gameMode = data.gameMode;
            });

            let timer;
            client.on('login', (data) => {
                entityId = data.entityId;
                gameMode = data.gameMode;
                timer = setInterval(() => {
                    if (permission < 2 && config.selfcare.op) client.chat("/minecraft:op @s[type=player]");
                    else if (gameMode !== 1) client.chat("/minecraft:gamemode creative");
                    else if (prefix && config.selfcare.prefix) client.chat('/prefix off');
                    else if (mute && config.selfcare.mute) client.core.run(`essentials:mute ${client.uuid}`);
                    else if (!god && config.selfcare.god) client.core.run(`god ${config.user.name} on`);
                    else if (nick && config.selfcare.nick) client.core.run(`nick ${config.user.name} off`);

                    else if (gameMode !== 4) client.write("client_command", { actionId: 0 });
                }, 1000);
            });
        }
}

module.exports = Selfcare