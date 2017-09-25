class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
      if (!config) throw new Error('Provide a `config`');
      this.config = config;
      this.reset();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
      return this.state;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
      if (this.config.states[state]) {
        this.prevStates.push(this.state);
        this.nextStates = [];
        this.state = state;
      } else
        throw new Error('Unknown state');
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
      let newState = this.config.states[this.state].transitions[event];
      if (!newState) throw new Error('Wrong event');
      this.prevStates.push(this.state);
      this.nextStates = [];
      this.state = newState;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
      this.state = this.config.initial;
      this.clearHistory();
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
      if (!event) return Object.keys(this.config.states);
      let state;
      let statesWithEvent = []
      for (state in this.config.states) {
        if (this.config.states[state].transitions[event])
          statesWithEvent.push(state);
      }
      return statesWithEvent;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      if (!this.prevStates.length) return false;
      let prevState = this.prevStates.pop();
      this.nextStates.push(this.state);
      this.state = prevState;
      return true;
    }


    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
      if (!this.nextStates.length) return false;
      let nextState = this.nextStates.pop();
      this.prevStates.push(this.state);
      this.state = nextState;
      return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
      this.nextStates = [];
      this.prevStates = [];
    }
}
module.exports = FSM;

/** @Created by Uladzimir Halushka **/
