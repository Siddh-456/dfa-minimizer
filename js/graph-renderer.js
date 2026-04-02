/**
 * Graph Renderer
 * Renders nodes and edges on an HTML5 Canvas without external libraries.
 */
class GraphRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Theme colors matching CSS
    this.theme = {
      nodeBg: '#0a0a1a',
      nodeBorder: '#00f5ff',
      nodeGlow: 'rgba(0, 245, 255, 0.4)',
      textFill: '#e8e8f0',
      acceptRing: '#9b59ff',
      edgeStroke: '#8888aa',
      edgeLabelText: '#00f5ff'
    };
    
    this.nodes = {}; // { id: { x, y, radius, label, isAccept } }
    this.edges = []; // { from, to, label }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.nodes = {};
    this.edges = [];
  }

  setupDFA(dfa, isMinimized = false) {
    this.clear();

    const n = dfa.states.length;
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = Math.min(this.width, this.height) / 2 - 50;

    // Arrange nodes in a circle
    dfa.states.forEach((state, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      this.nodes[state] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 20,
        label: state,
        isAccept: dfa.isAcceptState(state)
      };
    });

    // Build edges grouping symbols for the same transition
    const transitionMap = {}; // 'from->to' : ['a', 'b']
    dfa.states.forEach(fromState => {
      dfa.alphabet.forEach(symbol => {
        const toState = dfa.next(fromState, symbol);
        if (toState) {
          const key = `${fromState}->${toState}`;
          if (!transitionMap[key]) transitionMap[key] = [];
          transitionMap[key].push(symbol);
        }
      });
    });

    Object.keys(transitionMap).forEach(key => {
      const [from, to] = key.split('->');
      this.edges.push({
        from,
        to,
        label: transitionMap[key].join(', ')
      });
    });

    if (isMinimized) {
      this.theme.nodeBorder = '#ffb347'; // var(--gold)
      this.theme.nodeGlow = 'rgba(255, 179, 71, 0.4)';
      this.theme.acceptRing = '#ff4757'; // var(--red)
    }

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw edges
    this.edges.forEach(edge => this._drawEdge(edge));
    
    // Draw nodes
    Object.values(this.nodes).forEach(node => this._drawNode(node));
  }

  _drawNode(node) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.theme.nodeBg;
    this.ctx.fill();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.theme.nodeBorder;
    this.ctx.shadowColor = this.theme.nodeGlow;
    this.ctx.shadowBlur = 10;
    this.ctx.stroke();

    // Accept state secondary ring
    if (node.isAccept) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius - 4, 0, Math.PI * 2);
      this.ctx.strokeStyle = this.theme.acceptRing;
      this.ctx.shadowBlur = 0;
      this.ctx.stroke();
    }

    // Label
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = this.theme.textFill;
    this.ctx.font = '12px "JetBrains Mono"';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(node.label, node.x, node.y);
  }

  _drawEdge(edge) {
    const fromNode = this.nodes[edge.from];
    const toNode = this.nodes[edge.to];
    
    this.ctx.shadowBlur = 0;
    this.ctx.strokeStyle = this.theme.edgeStroke;
    this.ctx.lineWidth = 1.5;

    if (edge.from === edge.to) {
      // Self loop
      this.ctx.beginPath();
      this.ctx.arc(fromNode.x, fromNode.y - fromNode.radius - 10, 15, 0, Math.PI * 2);
      this.ctx.stroke();
      
      this._drawLabel(edge.label, fromNode.x, fromNode.y - fromNode.radius - 35);
    } else {
      // Straight line or curved line depending on bi-directional setup
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const angle = Math.atan2(dy, dx);
      
      const startX = fromNode.x + Math.cos(angle) * fromNode.radius;
      const startY = fromNode.y + Math.sin(angle) * fromNode.radius;
      const endX = toNode.x - Math.cos(angle) * toNode.radius;
      const endY = toNode.y - Math.sin(angle) * toNode.radius;

      // Draw quadratic bezier slightly offset
      const cx = (startX + endX) / 2 - Math.sin(angle) * 20;
      const cy = (startY + endY) / 2 + Math.cos(angle) * 20;

      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.quadraticCurveTo(cx, cy, endX, endY);
      this.ctx.stroke();

      // Arrow head
      this.ctx.beginPath();
      this.ctx.moveTo(endX, endY);
      this.ctx.lineTo(endX - 8 * Math.cos(angle - Math.PI / 6), endY - 8 * Math.sin(angle - Math.PI / 6));
      this.ctx.lineTo(endX - 8 * Math.cos(angle + Math.PI / 6), endY - 8 * Math.sin(angle + Math.PI / 6));
      this.ctx.fillStyle = this.theme.edgeStroke;
      this.ctx.fill();

      // Label at midpoint
      this._drawLabel(edge.label, cx, cy - 10);
    }
  }

  _drawLabel(text, x, y) {
    this.ctx.fillStyle = this.theme.nodeBg;
    const textWidth = this.ctx.measureText(text).width;
    this.ctx.fillRect(x - textWidth/2 - 2, y - 8, textWidth + 4, 16);

    this.ctx.fillStyle = this.theme.edgeLabelText;
    this.ctx.font = '10px "JetBrains Mono"';
    this.ctx.fillText(text, x, y);
  }
}
