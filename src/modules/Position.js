class Position {
    constructor(context) {
        this.client = context.client
        this.konsole = context.konsole
        this.init()
    }

    async init() {
        this.client.on('position',(packet)=>{
            this.client.pos = packet
            this.client.write('teleport_confirm',{
                teleportId: this.client.pos.teleportId
            })
            if (this.client?.core) this.client.core.move()
        })
    }
}

module.exports = Position