const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

const PARTICLE_COUNT = 300; // Lower count for visible network lines
const FOCAL_LENGTH = 400;
const CONNECT_DIST = 150; // Max distance for a connection

let width,
  height,
  particles = [];

class NetworkNode {
  constructor() {
    this.init();
  }

  init() {
    this.x = (Math.random() - 0.5) * width * 2;
    this.y = (Math.random() - 0.5) * height * 2;
    this.z = Math.random() * FOCAL_LENGTH * 2;

    // Solid theme colors: Yellow (#f9c030) and White
    this.color = Math.random() > 0.5 ? "249, 192, 48" : "255, 255, 255";

    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.vz = (Math.random() - 0.5) * 1.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.z += this.vz;

    // Wrap particles around instead of bouncing or resetting
    const boundX = width * 1.5;
    const boundY = height * 1.5;
    const boundZMin = -FOCAL_LENGTH;
    const boundZMax = FOCAL_LENGTH * 2;

    if (this.x > boundX) this.x = -boundX;
    if (this.x < -boundX) this.x = boundX;
    if (this.y > boundY) this.y = -boundY;
    if (this.y < -boundY) this.y = boundY;
    if (this.z > boundZMax) this.z = boundZMin;
    if (this.z < boundZMin) this.z = boundZMax;
  }

  project() {
    let scale = FOCAL_LENGTH / (FOCAL_LENGTH + this.z);
    return {
      x: this.x * scale + width / 2,
      y: this.y * scale + height / 2,
      scale: scale,
      alpha: Math.min(1, scale * 1.2),
    };
  }
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = Array.from({ length: PARTICLE_COUNT }, () => new NetworkNode());
}

function drawLines(p1, proj1, allParticles) {
  allParticles.forEach((p2) => {
    if (p1 === p2) return;

    // 3D Distance check using Pythagoras
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    let dz = p1.z - p2.z;
    let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < CONNECT_DIST) {
      let proj2 = p2.project();
      // Line transparency based on distance
      let opacity = (1 - dist / CONNECT_DIST) * proj1.alpha * 0.5;
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.lineWidth = 1 * proj1.scale;
      ctx.beginPath();
      ctx.moveTo(proj1.x, proj1.y);
      ctx.lineTo(proj2.x, proj2.y);
      ctx.stroke();
    }
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height); // Clean black background

  particles.forEach((p) => {
    p.update();
    let proj = p.project();

    // Draw the network connections first
    drawLines(p, proj, particles);

    // Draw the solid ball particle
    ctx.fillStyle = `rgba(${p.color}, ${proj.alpha})`;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
animate();
