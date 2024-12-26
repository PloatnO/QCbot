class ChipmunkModParser {
    constructor(context) {
        this.context = context;
        this.client = context.client;
        this.konsole = context.konsole;
        this.client.on('custom_systemChat', (dummy, mesg) => {
            this.handleChatMessage(mesg);
        });
    }

    handleChatMessage(mesg) {
        const message = mesg.jsonMsg.message;

        if (!message || !message.translate) return;

        if (message.translate === '%s %s › %s' || message.translate === '[%s] %s › %s') {
            this.parseChatMessage(message);
        }
    }

    parseChatMessage(message) {
        const withArgs = message.with;

        if (!withArgs || !Array.isArray(withArgs) || withArgs.length !== 3) {
            return;
        }

        let prefix = '';
        if (withArgs.length > 0) {
            const firstArg = withArgs[0];
            const hasWith = firstArg.with && Array.isArray(firstArg.with) && firstArg.with.length > 0;

            if (hasWith && firstArg.with[0].text) {
                prefix = firstArg.with[0].text;
            } else if (firstArg.text) {
                prefix = firstArg.text;
            } else {
                prefix = "Default";
            }
        } else {
            prefix = "Default";
        }

        const username = withArgs[1];
        const chatMsg = withArgs[2];
        if (!chatMsg) {
            return;
        }

        let selector;
        if (username.hoverEvent?.contents?.id) {
            selector = username.hoverEvent.contents.id;
        } else {
            selector = username.text;
        }

        const chatMessage = {
            selector: selector,
            message: chatMsg.text || chatMsg.extra?.join('') || '',
            isChipmunk: true
        };

        if (username.hoverEvent) {
            chatMessage.hoverEvent = username.hoverEvent;
        }

        if (username.clickEvent) {
            chatMessage.clickEvent = username.clickEvent;
        }

        this.client.emit('chat', chatMessage);
    }
}

module.exports = ChipmunkModParser;
