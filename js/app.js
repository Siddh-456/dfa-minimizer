/**
 * Main App Entry Point
 * Wires DOM events, delegates generation logic, sequences animations.
 */
document.addEventListener('DOMContentLoaded', () => {
  const app = new DFAApp();
});

class DFAApp {
  constructor() {
    this.currentDFA = null;
    this.minimizer = null;
    this.stepIndex = -1;

    // Renderers
    this.graphOriginal = new GraphRenderer('originalCanvas');
    this.graphMinimized = new GraphRenderer('minimizedCanvas');
    this.tableRenderer = null;
    this.partitionRenderer = new PartitionRenderer('partitionViz');
    this.controls = new AppControls(this);

    this._bindSetupEvents();
  }

  _bindSetupEvents() {
    const genTblBtn = document.getElementById('generateTableBtn');
    const loadExBtn = document.getElementById('loadExampleBtn');
    const minBtn = document.getElementById('minimizeBtn');

    genTblBtn.addEventListener('click', () => this.generateTableInputs());
    loadExBtn.addEventListener('click', () => this.loadExample());
    minBtn.addEventListener('click', () => this.startMinimization());
  }

  generateTableInputs() {
    const numStates = parseInt(document.getElementById('numStates').value);
    const alphabetRaw = document.getElementById('alphabet').value;
    const alphabet = alphabetRaw.split(',').map(s => s.trim()).filter(Boolean);

    if (numStates < 2 || alphabet.length === 0) {
      alert("Please provide valid states and alphabet.");
      return;
    }

    const tableWrap = document.getElementById('transitionTableWrap');
    const tbody = document.getElementById('transitionTable');
    tbody.innerHTML = '';

    // Header
    let thead = '<tr><th>State</th>';
    alphabet.forEach(sym => thead += `<th>␦ ${sym}</th>`);
    thead += '</tr>';
    tbody.innerHTML = thead;

    // Body
    for (let i = 0; i < numStates; i++) {
      const stateName = `q${i}`;
      let row = `<tr><td>${stateName}</td>`;
      
      alphabet.forEach(sym => {
        let options = '';
        for (let j = 0; j < numStates; j++) {
          options += `<option value="q${j}">q${j}</option>`;
        }
        row += `<td><select id="sel_${stateName}_${sym}">${options}</select></td>`;
      });
      row += '</tr>';
      tbody.insertAdjacentHTML('beforeend', row);
    }

    // Accept & Start States
    const acceptWrap = document.getElementById('acceptStatesWrap');
    const startSelect = document.getElementById('startState');
    acceptWrap.innerHTML = '';
    startSelect.innerHTML = '';

    for (let i = 0; i < numStates; i++) {
      const s = `q${i}`;
      acceptWrap.insertAdjacentHTML('beforeend', `
        <label><input type="checkbox" value="${s}"> <span>${s}</span></label>
      `);
      startSelect.insertAdjacentHTML('beforeend', `<option value="${s}">${s}</option>`);
    }

    tableWrap.classList.remove('hidden');
    // Scroll down to table
    tableWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  loadExample() {
    // Redundant 5-state DFA example
    document.getElementById('numStates').value = 5;
    document.getElementById('alphabet').value = 'a, b';
    this.generateTableInputs();

    // q0
    document.getElementById('sel_q0_a').value = 'q1';
    document.getElementById('sel_q0_b').value = 'q2';
    // q1
    document.getElementById('sel_q1_a').value = 'q1';
    document.getElementById('sel_q1_b').value = 'q3';
    // q2
    document.getElementById('sel_q2_a').value = 'q1';
    document.getElementById('sel_q2_b').value = 'q2';
    // q3
    document.getElementById('sel_q3_a').value = 'q1';
    document.getElementById('sel_q3_b').value = 'q4';
    // q4
    document.getElementById('sel_q4_a').value = 'q1';
    document.getElementById('sel_q4_b').value = 'q2';

    // Start state
    document.getElementById('startState').value = 'q0';

    // Accept states (q4 only)
    const checkboxes = document.querySelectorAll('#acceptStatesWrap input');
    checkboxes[4].checked = true;
  }

  startMinimization() {
    // Parse inputs to build DFA object
    const numStates = parseInt(document.getElementById('numStates').value);
    const alphabet = document.getElementById('alphabet').value.split(',').map(s=>s.trim()).filter(Boolean);
    const states = Array.from({length: numStates}, (_, i) => `q${i}`);
    
    const transitionTable = {};
    states.forEach(s => {
      transitionTable[s] = {};
      alphabet.forEach(sym => {
        transitionTable[s][sym] = document.getElementById(`sel_${s}_${sym}`).value;
      });
    });

    const startState = document.getElementById('startState').value;
    const acceptStates = Array.from(document.querySelectorAll('#acceptStatesWrap input:checked')).map(el => el.value);

    if (acceptStates.length === 0) {
      alert("Warning: No accept states selected. Minimization will merge all states into one dead state.");
    }

    this.currentDFA = new DFA(states, alphabet, transitionTable, startState, acceptStates);
    
    // Hide input, show viz
    document.getElementById('inputPanel').classList.add('hidden');
    document.getElementById('vizArea').classList.remove('hidden');

    // Run algorithms internally to prep steps
    this.minimizer = new DFAMinimizer(this.currentDFA);
    this.minimizer.runFullSteps();

    // Render Initial State
    this.graphOriginal.setupDFA(this.currentDFA);
    this.tableRenderer = new TableRenderer('distTableWrap', this.currentDFA);
    this.tableRenderer.renderInitial();
    
    this.stepIndex = -1;
    this.controls.updateProgress(-1, this.minimizer.steps.length, "Click Next Step to begin the Table-Filling algorithm. First, lower-triangular state pairs are marked unknown (?).");

    window.scrollTo({ top: document.getElementById('vizArea').offsetTop - 20, behavior: 'smooth' });
  }

  nextStep() {
    this.stepIndex++;
    if (this.stepIndex >= this.minimizer.steps.length) return false;

    const stepInfo = this.minimizer.steps[this.stepIndex];

    switch (stepInfo.type) {
      case 'MARK_ACCEPT_NONACCEPT':
      case 'MARK_TRANSITIONS':
      case 'FINISH_MARKING':
        this.tableRenderer.updateCells(stepInfo.changes, stepInfo.type, this.stepIndex);
        break;
      
      case 'MERGE_PARTITIONS':
        this.partitionRenderer.render(stepInfo.partitions);
        document.getElementById('partitionPanel').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        break;

      case 'FINAL_DFA':
        this.graphMinimized.setupDFA(stepInfo.minimizedDFA, true);
        this._showMinimizedStats(stepInfo.minimizedDFA);
        document.getElementById('minimizedPanel').scrollIntoView({ behavior: 'smooth', block: 'end' });
        break;
    }

    this.controls.updateProgress(this.stepIndex, this.minimizer.steps.length, stepInfo.description);
    return true;
  }

  _showMinimizedStats(minDFA) {
    const statsDiv = document.getElementById('comparisonStats');
    statsDiv.innerHTML = `Original States: <strong>${this.currentDFA.states.length}</strong> &rarr; Minimized States: <strong>${minDFA.states.length}</strong>`;
    statsDiv.classList.remove('hidden');
    statsDiv.classList.add('anim-fade-in');

    const tableWrap = document.getElementById('minimizedTableWrap');
    let html = `<h4>New Transition Table</h4><table class="minimized-table">
                  <thead><tr><th>State</th>`;
    minDFA.alphabet.forEach(sym => html+=`<th>␦ ${sym}</th>`);
    html += `</tr></thead><tbody>`;

    minDFA.states.forEach(s => {
      const isStart = (s === minDFA.startState) ? ' (Start)' : '';
      const isAcc = minDFA.isAcceptState(s) ? ' (Accept)' : '';
      html += `<tr><td>${s}${isStart}${isAcc}</td>`;
      minDFA.alphabet.forEach(sym => {
        html += `<td>${minDFA.next(s, sym)}</td>`;
      });
      html += '</tr>';
    });
    html += `</tbody></table>`;
    
    tableWrap.innerHTML = html;
    tableWrap.classList.remove('hidden');
    tableWrap.classList.add('anim-fade-in');
  }

  resetVisualization() {
    document.getElementById('vizArea').classList.add('hidden');
    document.getElementById('inputPanel').classList.remove('hidden');
    this.graphOriginal.clear();
    this.graphMinimized.clear();
    this.partitionRenderer.clear();
    document.getElementById('comparisonStats').classList.add('hidden');
    document.getElementById('minimizedTableWrap').classList.add('hidden');
    this.stepIndex = -1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
