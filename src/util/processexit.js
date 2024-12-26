const Konsole = require('../modules/Konsole');

module.exports = class Test {
    constructor() {
        this.init();
    }

    init() {
        const resetColor = () => process.stdout.write(Konsole.COLORS.RESET+'');

        process.on('exit', resetColor);
        process.on('SIGINT', () => { resetColor(); process.exit(); });
        process.on('SIGTERM', () => { resetColor(); process.exit(); });
        process.on('uncaughtException', (err) => { new Konsole().error(err.stack) ;resetColor(); process.exit(1); });
        process.on('beforeExit', resetColor);
    }
};
