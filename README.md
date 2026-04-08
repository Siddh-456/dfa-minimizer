# The DFA Minimization Visualizer

An interactive step by step visualization tool for understanding how Deterministic Finite Automata are reduced to their simplest form.

**Live Demo:** https://siddh-456.github.io/DFA-Minimizer/

---

## About

This project develops a visualization tool that demonstrates the complete process of minimizing a DFA. A user inputs a DFA and the system performs the minimization algorithm step by step, showing how equivalent states are identified and merged. The application displays intermediate partition tables and highlights states that are grouped together during the minimization process. Finally the minimized DFA is generated and displayed graphically. This tool helps students understand the importance of reducing automata to their simplest form.

---

## Features

**Input Methods**

Table Mode allows direct text input of the transition matrix with state names, alphabet symbols, start state selection, and accept state toggling. Draw Mode provides an immersive chalkboard experience where states can be placed by clicking, transitions drawn by dragging between states, and the pen tool used for freehand gesture recognition.

**Step by Step Visualization**

The tool walks through the minimization algorithm in six clearly labeled stages. Stage one shows the original DFA topology with all states and transitions rendered graphically. Stage two marks base pairs where exactly one state in a pair is an accepting state, establishing the foundation for propagation. Stage three runs iterative propagation, scanning unmarked pairs and marking any whose transitions lead to already distinguished pairs. Stage four reveals the final equivalence classes, showing which states are indistinguishable and can be merged. Stage five displays the minimized DFA with the reduced state count and updated transition table. Stage seven allows testing strings against both the original and minimized DFA simultaneously to verify equivalence.

**Additional Capabilities**

Save and load DFA definitions as JSON files. Download the minimized DFA as a JSON export. Adjustable animation speed slider. String test runner that accepts comma separated inputs and shows accept or reject results for both machines side by side with per string traversal visualization.

---

## How to Use

**Table Mode**

1. Set the alphabet in the Alphabet field using comma separated symbols such as a, b
2. Set the number of states
3. Fill in the transition table by entering destination states for each symbol
4. Select the start state from the dropdown
5. Click the accept state buttons to toggle which states are accepting
6. Click WATCH IT MINIMIZE

**Draw Mode**

1. Click Draw Mode to switch to the chalkboard
2. Use the State tool and click to place states on the canvas
3. Use the Start tool and click a state to mark it as the start state
4. Use the Accept tool and click states to toggle them as accepting
5. Drag from one state to another to draw a transition, then enter the symbol in the popup
6. Click WATCH IT MINIMIZE once the canvas shows Valid DFA Ready

---

## Algorithm

The minimization uses the table filling algorithm also known as the Myhill Nerode distinguishability method.

Step 1 marks all pairs where exactly one state is an accepting state as distinguishable. Step 2 iteratively marks any unmarked pair where some input symbol leads to an already marked pair. This repeats until no new pairs are marked, which is fixed point convergence. Step 3 groups all remaining unmarked pairs into equivalence classes. These classes are merged into single states to form the minimized DFA.

---

## Tech Stack

Built entirely with vanilla HTML, CSS, and JavaScript with no external frameworks or libraries. SVG is used for all graph rendering. Fonts are loaded from Google Fonts using Playfair Display, DM Sans, and Caveat.

---

## Project Structure

```
DFA-Minimizer/
├── index.html       Main application file containing all logic and UI
├── css/             Stylesheets
├── js/              JavaScript modules
└── README.md        This file
```

---

## Local Setup

```bash
git clone https://github.com/Siddh-456/DFA-Minimizer.git
cd DFA-Minimizer
```

Open index.html in any modern browser. No build step or server required.

---

## Example DFA

A five state DFA over the alphabet a, b with start state q0 and accept state q1 where some states are equivalent will be reduced to fewer states after running the minimization. The tool will show exactly which pairs were marked at each step and which states were merged.

---

## License

MIT License. Free to use for educational purposes.
