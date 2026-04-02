/**
 * DFA Class
 * Represents a Deterministic Finite Automaton securely.
 */
class DFA {
  constructor(states, alphabet, transitionTable, startState, acceptStates) {
    this.states = states; // Array of strings (e.g. ['q0', 'q1'])
    this.alphabet = alphabet; // Array of strings (e.g. ['a', 'b'])
    this.transitionTable = transitionTable; // Object mapping state to { symbol: nextState }
    this.startState = startState;
    this.acceptStates = new Set(acceptStates);
  }

  isAcceptState(state) {
    return this.acceptStates.has(state);
  }

  next(state, symbol) {
    return this.transitionTable[state]?.[symbol] || null;
  }
}
