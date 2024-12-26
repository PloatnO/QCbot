const Config = require('../modules/Config')
class Core {
    constructor(context) {
        this.client = context
        this.init() 
    }

    async init() {
        try {
            const confg = await new Config().get()
            this.coreconfig = confg.core
        } catch {}

        this.core = {
            placement: {
                start: this.coreconfig.start ?? { x: 0, y: 0, z: 0},
                end: this.coreconfig.end ?? { x: 15, y: 0, z: 15}
            },
            pos: {
                x: Math.floor(this.client.pos.x / 16) * 16,
                y: this.coreconfig.start.y,
                z: Math.floor(this.client.pos.z / 16) * 16
            }
        }

        this.currentBlockRelative = { x: 0, y: this.core.placement.start.y, z: 0 }

        this.refill()
        setTimeout(() => {
            this.client.emit('core:started')
        }, 150)
    }

    refill = async () => {
        this.config = await new Config().get()

        const pos = this.core.pos
        const corepos = this.core.placement
        const cmd = `/minecraft:fill ${pos.x + corepos.start.x} ${corepos.start.y} ${pos.z + corepos.start.z} ${pos.x + corepos.end.x} ${corepos.end.y} ${pos.z + corepos.end.z} ${this.config.core.block}{CustomName:'${JSON.stringify(this.config.core.name)}'} ${this.config.core.type}`
        this.client.chat(cmd)
    }

    move = async () => {
        this.core = {
            placement: {
                start: this.config.core.start ?? { x: 0, y: 0, z: 0},
                end: this.config.core.end ?? { x: 15, y: 0, z: 15}
            },
            pos: {
                x: Math.floor(this.client.pos.x / 16) * 16,
                y: this.client.pos.y,
                z: Math.floor(this.client.pos.z / 16) * 16
            }
        }
        setTimeout(() => {
            this.refill()
        }, 75);
    }

    commandBlock() {
        if (!this.core.pos) return
        return { x: this.currentBlockRelative.x + this.core.pos.x, y: this.currentBlockRelative.y, z: this.currentBlockRelative.z + this.core.pos.z } 
    }

    addCommandBlockPos() {
        this.currentBlockRelative.x++

      if (this.currentBlockRelative.x > this.core.placement.end.x) {
        this.currentBlockRelative.x = this.core.placement.start.x
        this.currentBlockRelative.z++
      }

      if (this.currentBlockRelative.z > this.core.placement.end.z) {
        this.currentBlockRelative.z = this.core.placement.start.z
        this.currentBlockRelative.y++
      }

      if (this.currentBlockRelative.y > this.core.placement.end.y) {
        this.currentBlockRelative.x = this.core.placement.start.x
        this.currentBlockRelative.y = this.core.placement.start.y
        this.currentBlockRelative.z = this.core.placement.start.z
      }

    }

    run(cmd, args = []) {
        const location = this.commandBlock()
        if (!location) return;

        for (let i = 0; i < args.length; i++) {
            cmd = cmd.replace('%s', args[i]);
        }

        this.client.write('update_command_block', {
            location,
            command: cmd,
            mode: 1,
            flags: 5,
          });
    
        this.addCommandBlockPos()
    }

    tellraw(content, selector = '@a') {
        this.run(`minecraft:tellraw %s %s`, [selector, JSON.stringify(content)])
    }
}

module.exports = Core