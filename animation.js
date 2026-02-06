const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

const PARTICLE_COUNT = 300;
const FOCAL_LENGTH = 400;
const MOUSE_RADIUS = 150; // How close mouse needs to be to affect balls

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 }; // Start mouse off-screen

class Ball {
  constructor() {
    this.init();
  }

  init() {
    this.x = (Math.random() - 0.5) * width * 2;
    this.y = (Math.random() - 0.5) * height * 2;
    this.z = Math.random() * FOCAL_LENGTH * 2;

    // Keep track of the "original" path for smooth return
    this.baseX = this.x;
    this.baseY = this.y;

    this.vx = (Math.random() - 0.5) * 3;
    this.vy = (Math.random() - 0.5) * 3;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    // Move based on velocity
    this.x += this.vx;
    this.y += this.vy;
    this.z -= 2.0;

    // Mouse Interaction Logic
    // 1. Project 3D to 2D screen to find current dot position relative to mouse
    let scale = FOCAL_LENGTH / (FOCAL_LENGTH + this.z);
    let sx = this.x * scale + width / 2;
    let sy = this.y * scale + height / 2;

    // 2. Calculate distance to mouse
    let dx = mouse.x - sx;
    let dy = mouse.y - sy;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // 3. If mouse is close, push the ball away using Trig
    if (distance < MOUSE_RADIUS) {
      let angle = Math.atan2(dy, dx); // Find the direction
      let force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;

      // Push in the opposite direction of the mouse
      this.x -= Math.cos(angle) * force * 10;
      this.y -= Math.sin(angle) * force * 10;
    }

    // Reset if it goes behind camera
    if (this.z < -FOCAL_LENGTH) {
      this.z = FOCAL_LENGTH * 2;
    }
  }

  draw() {
    let scale = FOCAL_LENGTH / (FOCAL_LENGTH + this.z);
    let sx = this.x * scale + width / 2;
    let sy = this.y * scale + height / 2;

    if (sx > 0 && sx < width && sy > 0 && sy < height) {
      let alpha = Math.min(1, scale * 1.5);
      ctx.fillStyle = `rgba(255, 255, 0, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, this.radius * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Ball());
  }
}

function animate() {
  // "No trailing" = clear the whole canvas every frame
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}

// Track Mouse Movement
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Clear mouse position when it leaves the window
window.addEventListener("mouseout", () => {
  mouse.x = -1000;
  mouse.y = -1000;
});

window.addEventListener("resize", resize);
resize();
animate();
