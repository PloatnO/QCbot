const ChatMessage = require('prismarine-chat')('1.20.2')

class Chat {
    constructor(context) {
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.client.on('system_chat', (packet) => {
            const message = packet.content
            const chat = ChatMessage.fromNotch(message).toAnsi()
            this.konsole.debug(chat)
        })
    }

    
}



module.exports = Chat;