const util = require('util')

class Test {
    constructor(context) {
        context.konsole.log(util.inspect(context, { depth: 1, colors: true }));
    }
}

//module.exports = Test;