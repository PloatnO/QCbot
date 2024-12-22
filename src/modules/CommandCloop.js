class CommandCloop {
    constructor(context) {
        this.client = context.client;
        this.konsole = context.konsole;
        this.ids = []

        this.client['cloop'] = {
            add: (...args) => this.add(...args),
            remove: (...args) => this.remove(...args),
            list: (...args) => this.list(...args),
            clear: (...args) => this.clear(...args)
        }
    }

    add(interval, command) {
        //if (interval < 10) interval = 50;
        const id = setInterval(() => {
            this.client.core.run(command)
        }, interval);
        this.ids.push(id);
        return this.ids.length - 1; // Return the index of the new interval
    }
    
    remove(index) {
        const id = this.ids[index];
        if (id !== undefined) {
            clearInterval(id);
            this.ids.splice(index, 1); // Remove the interval by index
        }
    }
    
    list() {
        return this.ids.map((id, index) => index); // Return the list of indices
    }

    clear() {
        this.ids.forEach(id => clearInterval(id));
        this.ids = [];
    }
}

module.exports = CommandCloop