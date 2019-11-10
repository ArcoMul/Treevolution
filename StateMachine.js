class StateMachine {
  constructor(states) {
    this.states = states;
  }

  setState(name) {
    if (this.currentName) {
      this.states[this.currentName].onExit();
    }
    this.currentName = name;
    this.states[this.currentName].onEnter();
  }
}
