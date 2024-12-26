const ChatMessage = require('prismarine-chat')('1.20.4'); // Specify the Minecraft version

class NormalChat {
    constructor(context) {
        this.context = context;
        this.client = context.client;
        this.konsole = context.konsole;
        this.client.on('custom_playerChat', (dummy, mesg, packet) => {
            this.handleChatMessage(mesg, packet);
        });
    }

    handleChatMessage(mesg, packet) {
        const message = mesg.jsonMsg.message;

        if (!message) return;

        this.parseChatMessage(message, packet);
    }

    parseChatMessage(message, packet) {
        const chatMessage = new ChatMessage(message);
        const username = chatMessage.getText().split(':')[0].trim(); // Assuming the username is the first word
        const uuid = packet.senderUuid || 'no uuid :3';
        const chatMsg = chatMessage.toString().replace(username, '').trim();

        const parsedMessage = {
            username: username,
            selector: uuid,
            message: chatMsg,
            isChipmunk: false
        };

        this.client.emit('chat', parsedMessage);
    }
}

module.exports = NormalChat;
