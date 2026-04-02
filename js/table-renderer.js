/**
 * Table Renderer
 * Generates and updates the distinguishability table HTML.
 */
class TableRenderer {
  constructor(containerId, dfa) {
    this.container = document.getElementById(containerId);
    this.dfa = dfa;
    this.tableHTML = '';
  }

  renderInitial() {
    this.container.innerHTML = '';
    const table = document.createElement('table');
    table.className = 'dist-table anim-fade-in';
    
    const states = this.dfa.states;
    const n = states.length;

    // Header row
    const thead = document.createElement('thead');
    const hRow = document.createElement('tr');
    hRow.appendChild(document.createElement('th')); // empty corner
    for (let i = 0; i < n - 1; i++) {
      const th = document.createElement('th');
      th.textContent = states[i];
      hRow.appendChild(th);
    }
    thead.appendChild(hRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    for (let i = 1; i < n; i++) {
      const tr = document.createElement('tr');
      
      const rowHeader = document.createElement('th');
      rowHeader.textContent = states[i];
      tr.appendChild(rowHeader);

      for (let j = 0; j < n - 1; j++) {
        const td = document.createElement('td');
        if (j < i) {
          const key = [states[i], states[j]].sort().join(',');
          td.id = `cell-${key}`;
          td.className = 'cell-unknown';
          td.textContent = '?';
        } else {
          td.className = 'cell-empty';
        }
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    this.container.appendChild(table);
  }

  updateCells(changes, type, currentStep) {
    // Reset highlights
    document.querySelectorAll('.cell-highlight').forEach(el => el.classList.remove('cell-highlight'));
    document.querySelectorAll('.cell-flash').forEach(el => el.classList.remove('cell-flash'));

    changes.forEach(change => {
      const cell = document.getElementById(`cell-${change.pair}`);
      if (!cell) return;

      cell.classList.add('cell-highlight');
      
      // Delay application for animation effect based on index (if desired, simple flash for now)
      setTimeout(() => {
        if (type.startsWith('MARK')) {
           cell.className = 'cell-marked cell-flash';
           cell.textContent = '✗';
        } else if (type === 'FINISH_MARKING') {
           cell.className = 'cell-equivalent cell-flash';
           cell.textContent = '✓';
        }
      }, 100);
      
      // Setup tooltip
      cell.setAttribute('title', change.reason || '');
      this._bindTooltip(cell);
    });
  }

  _bindTooltip(cell) {
    cell.addEventListener('mouseenter', (e) => {
      const title = cell.getAttribute('title');
      if (!title) return;
      
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.id = 'activeTooltip';
      tooltip.textContent = title;
      document.body.appendChild(tooltip);
      
      const rect = cell.getBoundingClientRect();
      tooltip.style.left = `${rect.left + window.scrollX + 24}px`;
      tooltip.style.top = `${rect.top + window.scrollY - 30}px`;
    });

    cell.addEventListener('mouseleave', () => {
      const tooltip = document.getElementById('activeTooltip');
      if (tooltip) tooltip.remove();
    });
  }
}
