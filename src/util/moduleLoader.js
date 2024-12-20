const fs = require('fs');
const path = require('path');
const Konsole = require('./Konsole');
const Client = require('./client');

class ModuleLoader {
    constructor(modulesDir) {
        this.modulesDirTEMP = modulesDir;
        this.init()
    }

    async init() {
        this.client = await new Client().init()
        this.konsole = new Konsole(this.client);
        this.modulesDir = path.join(__dirname, this.modulesDirTEMP);
        this.modules = new Map();
        this.debounceTimers = new Map();
        this.loadModules();
    }

    loadModules() {
        if (!fs.existsSync(this.modulesDir)) {
            console.error('Modules directory does not exist:', this.modulesDir);
            return;
        }

        fs.readdir(this.modulesDir, (err, files) => {
            if (err) {
                console.error('Error reading modules directory:', err);
                return;
            }

            files.forEach(file => {
                this.loadModule(file);
            });
        });

        this.watchModules();
    }

    loadModule(file) {
        const modulePath = path.join(this.modulesDir, file);
        delete require.cache[require.resolve(modulePath)];
        
        if (this.modules.has(file)) {
            const oldModule = this.modules.get(file);
            if (typeof oldModule.unload === 'function') {
                oldModule.unload();
            }
            this.modules.delete(file);
        }

        try {
            const module = require(modulePath);

            if (typeof module === 'function' && /^\s*class\s+/.test(module.toString())) {
                const context = {
                    client: this.client,
                    konsole: this.konsole
                };
                const instance = new module(context);
                this.modules.set(file, instance);
            }
        } catch (error) {
            this.konsole.error(`Error loading module ${file}:` + error);
        }
    }

    watchModules() {
        fs.watch(this.modulesDir, (eventType, filename) => {
            if (filename && (eventType === 'change' || eventType === 'rename')) {
                if (this.debounceTimers.has(filename)) {
                    clearTimeout(this.debounceTimers.get(filename));
                }

                this.debounceTimers.set(filename, setTimeout(() => {
                    this.konsole.warn(`Module ${filename} changed, reloading...`);
                    this.loadModule(filename);
                    this.debounceTimers.delete(filename);
                }, 100));
            }
        });
    }
}

module.exports = ModuleLoader;