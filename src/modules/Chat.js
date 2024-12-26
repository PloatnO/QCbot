const { MessageBuilder } = require('prismarine-chat')('1.20.4')
const packageJson = require('../../package.json');

class Chat {
    constructor(context) {
        this.client = context.client;
        this.konsole = context.konsole;
        this.init()
    }

    async init() {
        this.client.on('login',()=>{
            this.konsole.log(`Client ( "${this.client.username}"  )-(  "${this.client.uuid}"  ) Connected ${this.client.config.host}:${this.client.config.port}`)
        })

        this.client.on('core:started',()=>{
            const version = packageJson.version;

            this.client.core.tellraw(
                new MessageBuilder().setTranslate("%sQ%sw%sb Made by ImGloriz/PloatnO\n%s%s%s\n%s%s%s").setColor(this.client.config.scheme.mainColor).addWith(
                    //Start Message
                    new MessageBuilder().setText("| ").setColor(this.client.config.scheme.quaternaryColor), 
                    new MessageBuilder().setText("(").setColor(this.client.config.scheme.secondaryColor).setBold(true),
                    new MessageBuilder().setText(")").setColor(this.client.config.scheme.secondaryColor).setBold(true),

                    //Version Info
                    new MessageBuilder().setText("| ").setColor(this.client.config.scheme.quaternaryColor),
                    new MessageBuilder().setText("Version: ").setColor(this.client.config.scheme.mainColor),
                    new MessageBuilder().setText(version).setColor(this.client.config.scheme.quinaryColor),

                    //Prefix Info
                    new MessageBuilder().setText("| ").setColor(this.client.config.scheme.quaternaryColor),
                    new MessageBuilder().setText("Prefixes: ").setColor(this.client.config.scheme.mainColor),
                    new MessageBuilder().setText(`[${this.client.config.user.prefixes.join(', ')}]`).setColor(this.client.config.scheme.quinaryColor),
                ).toJSON()
            )
        })

        this.client.on('error',(err)=>{
            this.konsole.error(err)
        })

        this.client.on('end', (err) => {
            this.konsole.error(err)
            
        })
    }
}



module.exports = Chat;