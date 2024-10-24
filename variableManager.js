const EventEmitter = require('events');
class VariableManager extends EventEmitter {
    constructor() {
        super();
        this.variable = null; // The shared variable
    }

    getVariable() {
        return this.variable;
    }

    setVariable(newValue) {
        this.variable = newValue;
        this.emit('variableUpdated', this.variable); // Emit an event when the variable is updated
    }
}

const variableManager = new VariableManager();
module.exports = variableManager;
