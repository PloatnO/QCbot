const ChatMessage = require('prismarine-chat')('1.20.4')

class Chat {
    constructor(context) {
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.client.on('custom_systemChat', (packet) => {
            if (packet.includes("Command set:")) return
            this.konsole.debug(packet)
        })

        this.client.on('custom_playerChat',(packet)=>{
            this.konsole.debug(packet)
        })

        this.client.on('custom_profilelessChat',(packet)=>{
            this.konsole.debug(packet)
        })

        this.client.on('custom_actionBar',(packet)=>{
            if (this.client.options.actionbar === true) {
                this.konsole.debug(packet)
            }
        })

        this.client.on('custom_title',(packet)=>{
            if (this.client.options.title === true) {
                this.konsole.debug(packet)
            }
        })

        this.client.on('custom_bossBar',(packet)=>{
            if (this.client.options.bossbar === true) {
                this.konsole.debug(packet)
            }
        })
        
    }
}



module.exports = Chat;