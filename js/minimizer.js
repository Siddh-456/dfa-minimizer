/**
 * Table-Filling Algorithm (Myhill-Nerode) implementation
 */
class DFAMinimizer {
  constructor(dfa) {
    this.dfa = dfa;
    this.table = {}; // 'q0,q1' -> { marked: bool, reason: str, historyStep: int }
    this.steps = []; // Array of step-by-step history for animation
    this.equivalentPairs = [];
    this.partitions = [];
    this.minimizedDFA = null;
    this.currentStepIndex = -1;

    this._initializeTable();
  }

  // Helpers stringify state pair combinations (unordered)
  static pairKey(st1, st2) {
    return [st1, st2].sort().join(',');
  }

  _initializeTable() {
    const states = this.dfa.states;
    let n = states.length;

    // Build lower-triangular list of pairs
    for (let i = 1; i < n; i++) {
      for (let j = 0; j < i; j++) {
        const key = DFAMinimizer.pairKey(states[i], states[j]);
        this.table[key] = { marked: false, reason: null, historyStep: null };
      }
    }
  }

  runFullSteps() {
    this.steps = [];
    let stepCount = 0;
    const states = this.dfa.states;

    // STEP 1: Mark pairs where one is accept and one is not accept
    const step1Marks = [];
    Object.keys(this.table).forEach(key => {
      const [u, v] = key.split(',');
      const uAcc = this.dfa.isAcceptState(u);
      const vAcc = this.dfa.isAcceptState(v);

      if (uAcc !== vAcc) {
        this.table[key].marked = true;
        this.table[key].reason = `One is final state, one is not`;
        this.table[key].historyStep = ++stepCount;
        step1Marks.push({ pair: key, reason: this.table[key].reason });
      }
    });

    if (step1Marks.length > 0) {
      this.steps.push({
        type: 'MARK_ACCEPT_NONACCEPT',
        description: 'Marking distinguishable pairs (Final vs Non-Final states).',
        changes: step1Marks
      });
    }

    // STEP 2: Iterate and mark based on transitions
    let changed = true;
    let iteration = 1;

    while (changed) {
      changed = false;
      const stepIterMarks = [];

      Object.keys(this.table).forEach(key => {
        if (!this.table[key].marked) {
          const [u, v] = key.split(',');

          // Check if transitions for any symbol lead to a marked pair
          for (const sym of this.dfa.alphabet) {
            const nextU = this.dfa.next(u, sym);
            const nextV = this.dfa.next(v, sym);

            if (nextU !== nextV) {
                const nextKey = DFAMinimizer.pairKey(nextU, nextV);
                // If next states are marked
                if (this.table[nextKey]?.marked) {
                    this.table[key].marked = true;
                    this.table[key].reason = `Transitions on '${sym}' lead to distinguishable states ${nextU} and ${nextV}`;
                    this.table[key].historyStep = ++stepCount;
                    stepIterMarks.push({ pair: key, reason: this.table[key].reason });
                    changed = true;
                    break;
                }
            }
          }
        }
      });

      if (stepIterMarks.length > 0) {
        this.steps.push({
          type: 'MARK_TRANSITIONS',
          description: `Iteration ${iteration}: Marking pairs whose transitions lead to distinguishable states.`,
          changes: stepIterMarks
        });
      }
      iteration++;
    }

    // STEP 3: Remaining unmarked are equivalent
    const equivMarks = [];
    Object.keys(this.table).forEach(key => {
        if (!this.table[key].marked) {
            const [u, v] = key.split(',');
            this.equivalentPairs.push([u, v]);
            equivMarks.push({ pair: key, reason: 'Transitions do not lead to distinguishable states.' });
        }
    });

    this.steps.push({
        type: 'FINISH_MARKING',
        description: 'No more pairs can be marked. Remaining unmarked cells are equivalent pairs.',
        changes: equivMarks
    });

    this._computePartitions();
    this.steps.push({
      type: 'MERGE_PARTITIONS',
      description: 'Grouping equivalent states into merged equivalence classes (partitions).',
      partitions: this.partitions
    });

    this._computeMinimizedDFA();
    this.steps.push({
      type: 'FINAL_DFA',
      description: 'Minimized DFA has been constructed with the merged states.',
      minimizedDFA: this.minimizedDFA
    });
  }

  _computePartitions() {
    // Basic Disjoint-Set / Union-Find Logic
    const parent = {};
    const states = this.dfa.states;

    states.forEach(s => parent[s] = s);

    function find(i) {
        if (parent[i] === i) return i;
        return find(parent[i]);
    }
    
    function union(i, j) {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
            parent[rootI] = rootJ;
        }
    }

    this.equivalentPairs.forEach(([u, v]) => union(u, v));

    const groups = {};
    states.forEach(s => {
        const root = find(s);
        if (!groups[root]) groups[root] = [];
        groups[root].push(s);
    });

    this.partitions = Object.values(groups);
  }

  _computeMinimizedDFA() {
      // Create new states, mapping old states to partition representatives
      const partitionMap = {};
      const newStates = [];
      const newNamesMap = {}; // representative -> newName (A, B, C...)

      // Let's name partitions A, B, C...
      const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let nameIndex = 0;

      // Group partitions, ensuring the partition with start state gets named nicely or handled
      // Actually, joining them as comma string 'q0,q1' is also clear, but A,B,C is required by user
      
      this.partitions.forEach(group => {
          group.sort();
          const pName = alphabet[nameIndex % 26] + (nameIndex >= 26 ? Math.floor(nameIndex/26) : "");
          nameIndex++;

          newStates.push(pName);
          newNamesMap[group[0]] = pName; // Use first element as rep
          
          group.forEach(s => {
              partitionMap[s] = pName;
          });
      });

      const newTransitions = {};
      let newStart = partitionMap[this.dfa.startState];
      let newAccepts = new Set();

      this.partitions.forEach(group => {
          const rep = group[0];
          const newName = partitionMap[rep];

          newTransitions[newName] = {};

          // Copy transitions based on representative
          this.dfa.alphabet.forEach(sym => {
              const nextState = this.dfa.next(rep, sym);
              if (nextState) {
                  newTransitions[newName][sym] = partitionMap[nextState];
              }
          });

          // If any state in group is accepting, group is accepting
          if (group.some(s => this.dfa.isAcceptState(s))) {
              newAccepts.add(newName);
          }
      });

      this.minimizedDFA = new DFA(
          newStates,
          [...this.dfa.alphabet],
          newTransitions,
          newStart,
          Array.from(newAccepts)
      );
  }
}
