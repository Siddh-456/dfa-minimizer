/**
 * Controls & Orchestration
 * Handles user interactions, auto-play intervals, and linking the visualizers.
 */
class AppControls {
  constructor(app) {
    this.app = app;
    
    // UI Elements
    this.nextBtn = document.getElementById('nextStepBtn');
    this.autoPlayBtn = document.getElementById('autoPlayBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.speedSlider = document.getElementById('speedSlider');
    this.speedLabel = document.getElementById('speedLabel');
    this.stepCounter = document.getElementById('stepCounter');
    this.progressBar = document.getElementById('progressBar');
    this.explanationText = document.getElementById('explanationText');

    this.isPlaying = false;
    this.intervalId = null;
    this.speedMs = 1500;
    this.currentStep = -1;

    this._bindEvents();
  }

  _bindEvents() {
    this.nextBtn.addEventListener('click', () => {
      this.stopAutoPlay();
      this.app.nextStep();
    });

    this.autoPlayBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.stopAutoPlay();
      } else {
        this.startAutoPlay();
      }
    });

    this.resetBtn.addEventListener('click', () => {
      this.stopAutoPlay();
      this.app.resetVisualization();
    });

    this.speedSlider.addEventListener('input', (e) => {
      this.speedMs = 3200 - parseInt(e.target.value); // Reverse scale for better UX
      this.speedLabel.textContent = `${(this.speedMs / 1000).toFixed(1)}s`;
      
      if (this.isPlaying) {
        // Restart interval with new speed
        this.stopAutoPlay();
        this.startAutoPlay();
      }
    });

    // Info card toggle
    document.getElementById('infoToggleBtn').addEventListener('click', (e) => {
      const body = document.getElementById('infoBody');
      body.classList.toggle('collapsed');
      e.target.textContent = body.classList.contains('collapsed') ? '▲' : '▼';
    });
  }

  startAutoPlay() {
    if (this.currentStep >= this.app.minimizer.steps.length - 1) return;
    
    this.isPlaying = true;
    this.autoPlayBtn.textContent = 'Pause ❚❚';
    this.autoPlayBtn.classList.replace('btn-secondary', 'btn-primary');

    this.intervalId = setInterval(() => {
      if (!this.app.nextStep()) {
        this.stopAutoPlay();
      }
    }, this.speedMs);
  }

  stopAutoPlay() {
    this.isPlaying = false;
    this.autoPlayBtn.textContent = 'Auto Play ⏵';
    this.autoPlayBtn.classList.replace('btn-primary', 'btn-secondary');
    if (this.intervalId) clearInterval(this.intervalId);
  }

  updateProgress(stepIndex, totalSteps, description) {
    this.currentStep = stepIndex;
    const count = stepIndex + 1;
    this.stepCounter.textContent = `Step ${count} of ${totalSteps}`;
    
    const percent = Math.max(5, (count / totalSteps) * 100);
    this.progressBar.style.width = `${percent}%`;

    this.explanationText.style.opacity = '0';
    setTimeout(() => {
      this.explanationText.textContent = description;
      this.explanationText.style.opacity = '1';
    }, 200);

    // Disable next if done
    this.nextBtn.disabled = stepIndex >= totalSteps - 1;
    this.autoPlayBtn.disabled = stepIndex >= totalSteps - 1;
  }
}
