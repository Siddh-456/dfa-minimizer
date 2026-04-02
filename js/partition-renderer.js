/**
 * Partition Renderer
 * Displays equivalence classes visually animating the merge.
 */
class PartitionRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
  }

  render(partitions) {
    this.container.innerHTML = '';
    
    partitions.forEach((group, index) => {
      const wrap = document.createElement('div');
      wrap.className = 'partition-group';
      wrap.style.animationDelay = `${index * 0.1}s`;

      const label = document.createElement('span');
      label.className = 'group-label';
      label.textContent = `Group ${index + 1}`;
      wrap.appendChild(label);

      const statesWrap = document.createElement('div');
      statesWrap.className = 'group-states';
      
      group.forEach(state => {
        const chip = document.createElement('span');
        chip.className = 'state-chip';
        chip.textContent = state;
        statesWrap.appendChild(chip);
      });

      wrap.appendChild(statesWrap);

      // Emphasize merge if group has > 1 state
      if (group.length > 1) {
        wrap.classList.add('merged');
        const arrow = document.createElement('span');
        arrow.className = 'arrow-label';
        arrow.textContent = 'Merged into 1 state';
        wrap.appendChild(arrow);
      } else {
        const arrow = document.createElement('span');
        arrow.className = 'arrow-label';
        arrow.textContent = 'Single state';
        wrap.appendChild(arrow);
      }

      this.container.appendChild(wrap);
    });
  }

  clear() {
    this.container.innerHTML = '';
  }
}
