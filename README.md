<div align="center">
  <h1>DFA Minimizer</h1>
  <p><strong>An interactive DFA minimization visualizer for learning, teaching, and demonstrating Automata Theory.</strong></p>
  <p>
    Build a DFA from a transition table, a regular expression, or a chalkboard-style canvas, then watch the
    table-filling algorithm unfold step by step until the minimized automaton is produced and verified.
  </p>
  <p>
    <a href="https://dfaminimizer.vercel.app/"><strong>Live Demo</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#visual-tour"><strong>Visual Tour</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#key-features"><strong>Key Features</strong></a>
    &nbsp;&middot;&nbsp;
    <a href="#how-to-use"><strong>How To Use</strong></a>
  </p>
</div>

## Overview

This project is designed to make DFA minimization feel visual, intuitive, and teachable.

Instead of only showing the final reduced machine, the app walks through the full journey:

- learn the theory behind minimization,
- define the automaton in the style you prefer,
- inspect the original DFA structure,
- follow base-pair marking and iterative propagation,
- identify equivalence classes,
- generate the minimized DFA,
- and prove language preservation with side-by-side test cases.

It works especially well for classroom demos, self-study, viva preparation, and concept revision before exams.

## Visual Tour

<table>
  <tr>
    <td colspan="2"><img src="images/image%20(3).png" alt="Theory reference section" width="100%" /></td>
  </tr>
  <tr>
    <td colspan="2"><strong>Theory Reference</strong><br>Read DFA basics, why minimization matters, Myhill-Nerode intuition, the table-filling algorithm, and a worked example without leaving the app.</td>
  </tr>
  <tr>
    <td width="50%"><img src="images/image%20(7).png" alt="Table mode input" width="100%" /></td>
    <td width="50%"><img src="images/image%20(8).png" alt="Regex mode input" width="100%" /></td>
  </tr>
  <tr>
    <td><strong>Table Mode</strong><br>Define the DFA directly through a transition matrix, start-state selector, and accept-state toggles.</td>
    <td><strong>RegEx Mode</strong><br>Type a regular expression and preview the generated DFA live, together with operator hints and machine metadata.</td>
  </tr>
  <tr>
    <td width="50%"><img src="images/image%20(6).png" alt="Draw mode interface" width="100%" /></td>
    <td width="50%"><img src="images/image%20(9).png" alt="Original topology visualization" width="100%" /></td>
  </tr>
  <tr>
    <td><strong>Draw Mode</strong><br>Sketch the automaton visually on a chalkboard-style workspace and see the DFA take shape interactively.</td>
    <td><strong>Step 2: Original Topology</strong><br>Inspect the original machine before minimization begins, including state count, alphabet, start state, and accepting states.</td>
  </tr>
  <tr>
    <td width="50%"><img src="images/image%20(5).png" alt="Intermediate minimization step" width="100%" /></td>
    <td width="50%"><img src="images/image%20(4).png" alt="Final minimized DFA" width="100%" /></td>
  </tr>
  <tr>
    <td><strong>Intermediate Step</strong><br>Follow iterative propagation with the distinguishability table, algorithm log, live counters, and step controls visible on screen.</td>
    <td><strong>Final Minimized DFA</strong><br>See the reduced automaton, compare original vs minimized state count, and inspect the final transition table and export action.</td>
  </tr>
  <tr>
    <td colspan="2"><img src="images/image%20(2).png" alt="Test equivalence section" width="100%" /></td>
  </tr>
  <tr>
    <td colspan="2"><strong>Test Equivalence</strong><br>Run strings on both DFAs, compare accept/reject results, and visualize traversal paths side by side to confirm the language is preserved.</td>
  </tr>
</table>

## Key Features

### Learn Theory Inside the Same Interface

- Built-in theory reference for DFA basics, motivation, Myhill-Nerode, and the table-filling method.
- Worked example section that connects abstract theory to an actual DFA.
- Useful for lectures, demos, revision, and first-time learners.

### Three Flexible Input Modes

- **Table Mode** for structured transition-by-transition entry.
- **RegEx Mode** for quick generation from a regular expression.
- **Draw Mode** for graphical DFA construction on a chalkboard-inspired canvas.

### Full Step-by-Step Minimization Journey

The visualization is not limited to the final answer. It shows the full minimization pipeline:

1. Define the automaton.
2. Render the original topology.
3. Mark base distinguishable pairs.
4. Propagate markings iteratively.
5. Detect equivalence classes.
6. Merge equivalent states.
7. Produce the minimized DFA.

### Interactive Controls That Make the Algorithm Easy to Follow

- Previous/next step controls.
- Autoplay mode for smooth guided playback.
- Adjustable speed slider.
- Highlighted nodes, transitions, and table cells.
- Algorithm logs and counters for each major phase.

### Equivalence Testing After Minimization

- Enter comma-separated test strings such as `ab, ba, aabb`.
- Compare original DFA and minimized DFA acceptance side by side.
- Confirm language preservation using the **Match** column.
- Visualize traversal paths on both machines for any chosen string.

### Save, Load, and Reuse

- Save table-input DFAs as `dfa_table.json`.
- Save chalkboard drawings as `dfa_drawing.json`.
- Load previously saved JSON back into the interface.
- Download the minimized DFA as `minimized_dfa.json`.
- Reopen minimized output inside Draw Mode for further exploration.

## How To Use

### Quick Start

1. Choose **Table Mode**, **RegEx Mode**, or **Draw Mode**.
2. Define the DFA.
3. Click **MINIMIZE**.
4. Step through the visualization.
5. Inspect the minimized DFA.
6. Run test strings to verify language equivalence.

### Table Mode Workflow

1. Open **Table Mode**.
2. Enter the alphabet, for example `a, b`.
3. Set the number of states.
4. Fill every transition in the table.
5. Choose the start state.
6. Mark the accept states.
7. Click **MINIMIZE**.

### RegEx Mode Workflow

1. Open **RegEx Mode**.
2. Enter a valid regular expression.
3. Watch the live DFA preview update as you type.
4. Click **MINIMIZE** to push the generated DFA into the same visualization pipeline.

### Draw Mode Workflow

1. Open **Draw Mode**.
2. Place states on the chalkboard.
3. Mark one state as the start state.
4. Toggle accept states.
5. Draw transitions and assign symbols.
6. Wait until the canvas reports that the DFA is valid.
7. Click **MINIMIZE**.

### After Minimization

1. Explore the original topology.
2. Step through base-pair marking and propagation.
3. Review the equivalence classes.
4. Inspect the minimized DFA and final transition table.
5. Download the minimized machine as JSON.
6. Run test strings to confirm that both DFAs accept the same language.

## JSON Formats

### Table Mode save file

```json
{
  "states": ["q0", "q1"],
  "alphabet": ["a", "b"],
  "start": "q0",
  "accept": ["q1"],
  "transitions": {
    "q0": { "a": "q1", "b": "q0" },
    "q1": { "a": "q1", "b": "q0" }
  }
}
```

### Draw Mode save file

```json
{
  "alphabet": ["a", "b"],
  "nodes": [
    { "id": "q0", "x": 220, "y": 150 },
    { "id": "q1", "x": 420, "y": 150 }
  ],
  "edges": [
    { "from": "q0", "to": "q1", "symbol": "a" }
  ],
  "startId": "q0",
  "accepts": ["q1"]
}
```

### Minimized DFA export file

```json
{
  "states": ["S0", "S1"],
  "alphabet": ["a", "b"],
  "start": "S0",
  "accept": ["S1"],
  "transitions": {
    "S0": { "a": "S1", "b": "S0" },
    "S1": { "a": "S0", "b": "S1" }
  }
}
```

## Algorithm Used

This project uses the **table-filling method** for DFA minimization.

1. Build the table of all state pairs.
2. Mark pairs where exactly one state is accepting.
3. Repeatedly mark any unmarked pair whose transitions lead to an already marked pair.
4. Treat the remaining unmarked pairs as equivalent.
5. Merge each equivalence class into a single state.

The theory section also connects this process directly to the **Myhill-Nerode theorem**.

## Tech Stack

- HTML
- CSS
- JavaScript
- SVG for graph rendering
- No framework required

## Run Locally

```bash
git clone https://github.com/Siddh-456/DFA-Minimizer.git
cd DFA-Minimizer
```

Open `index.html` in a modern browser.

## Why this project stands out

- It teaches the theory and shows the implementation together.
- It supports three different DFA creation workflows.
- It visualizes the minimization process instead of only returning the answer.
- It includes persistence with save/load JSON support.
- It verifies correctness with built-in test cases and traversal playback.

## License

MIT License.
