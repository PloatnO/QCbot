const Konsole = require('./Konsole')
module.exports = () => {
    console = {
        log: () => {},
        warn: () => {},
        error: () => {},
        debug: () => {}
    }
    process.on('exit', (code) => {
        process.stdout.write(Konsole.COLORS.RESET);
    });

    process.on('SIGINT', () => {
        process.stdout.write(Konsole.COLORS.RESET);
        process.exit();
    });

    process.on('SIGTERM', () => {
        process.stdout.write(Konsole.COLORS.RESET);
        process.exit();
    });

    process.on('uncaughtException', (err) => {
        process.stdout.write(Konsole.COLORS.RESET);
        process.exit(1);
    });

    process.on('beforeExit', (code) => {
        process.stdout.write(Konsole.COLORS.RESET);
    });

    
};