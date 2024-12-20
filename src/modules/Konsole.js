const readline = require('readline');

let rl;

class Konsole {
  constructor(context) {
      if (context) return;
      if (!rl) {
       rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: `\x1b[30m>\x1b[92m `,
       });
      }
      this.rl = rl;
      this.init();
   }

  async init() {
      this.rl.removeAllListeners('line');
      this.rl.on('line', (input) => {
      this.log(`You entered: ${input}`);
      });
  }

  refreshLine(...args) {
      rl.output.write("\x1b[2K\r"+Konsole.COLORS.RESET);
      process.stdout.write(`${Konsole.COLORS.RESET}${args.toString()}${Konsole.COLORS.RESET}\n`);
      rl._refreshLine();
  }

  log(...args) {
    this.refreshLine(`${Konsole.CUSTCOLORS.BOLD}${Konsole.COLORS.BRIGHT_BLACK}[${Konsole.COLORS.BRIGHT_GREEN}L${Konsole.COLORS.BRIGHT_BLACK}]${Konsole.COLORS.RESET} ${args.toString()}${Konsole.COLORS.RESET}`);
  }

  warn(...args) {
    this.refreshLine(`${Konsole.CUSTCOLORS.BOLD}${Konsole.COLORS.BRIGHT_BLACK}[${Konsole.COLORS.RED}W${Konsole.COLORS.BRIGHT_BLACK}]${Konsole.COLORS.RESET} ${args.toString()}${Konsole.COLORS.RESET}`);
  }

  debug(...args) {
    this.refreshLine(`${Konsole.CUSTCOLORS.BOLD}${Konsole.COLORS.BRIGHT_BLACK}[${Konsole.COLORS.BRIGHT_MAGENTA}D${Konsole.COLORS.BRIGHT_BLACK}]${Konsole.COLORS.RESET} ${args.toString()}${Konsole.COLORS.RESET}`);
  }

  error(...args) {
    this.refreshLine(`${Konsole.CUSTCOLORS.BOLD}${Konsole.COLORS.BRIGHT_BLACK}[${Konsole.COLORS.BRIGHT_RED}E${Konsole.COLORS.BRIGHT_BLACK}]${Konsole.COLORS.RESET} ${args.toString()}${Konsole.COLORS.RESET}`);
  }

    static COLORS = {
    BLACK: "\x1b[30m",
    RED: "\x1b[31m",
    GREEN: "\x1b[32m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    MAGENTA: "\x1b[35m",
    CYAN: "\x1b[36m",
    WHITE: "\x1b[37m",
    BRIGHT_BLACK: "\x1b[90m",
    BRIGHT_RED: "\x1b[38;2;255;0;0m",
    BRIGHT_GREEN: "\x1b[92m",
    BRIGHT_YELLOW: "\x1b[93m",
    BRIGHT_BLUE: "\x1b[94m",
    BRIGHT_MAGENTA: "\x1b[95m",
    BRIGHT_CYAN: "\x1b[96m",
    BRIGHT_WHITE: "\x1b[97m",
    RESET: "\x1b[0m"
    };

    static CUSTCOLORS = {
    BOLD: "\x1b[1m",
    DIM: "\x1b[2m",
    UNDERLINE: "\x1b[4m",
    BLINK: "\x1b[5m",
    INVERSE: "\x1b[7m",
    HIDDEN: "\x1b[8m",
    RESET_BOLD: "\x1b[21m",
    RESET_DIM: "\x1b[22m",
    RESET_UNDERLINE: "\x1b[24m",
    RESET_BLINK: "\x1b[25m",
    RESET_INVERSE: "\x1b[27m",
    RESET_HIDDEN: "\x1b[28m"
    };
}

module.exports = Konsole;