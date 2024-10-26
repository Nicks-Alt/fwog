const EventEmitter = require('events');
class VariableManager extends EventEmitter {
    constructor() {
        super();
        this.reactionRoles = null;
    }

    getReactionRoles() {
        return this.reactionRoles;
    }

    setReactionRoles(newValue) {
        this.reactionRoles = newValue;
        this.emit('reactionRolesUpdated', this.reactionRoles); // Emit an event when data is updated
    }
}

const variableManager = new VariableManager();
module.exports = variableManager;
