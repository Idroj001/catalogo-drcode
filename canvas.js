const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = "01アイウエオカキクケコ";
const fontSize = 16;
let drops = Array(Math.floor(canvas.width / fontSize)).fill(0);

function draw() {
  const isDark = document.documentElement.classList.contains('dark');
  ctx.fillStyle = isDark ? 'rgba(2, 10, 4, 0.12)' : 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = isDark ? '#00d44e' : '#008f11';
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    ctx.fillText(char, x, y);
    drops[i] += 0.9;

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
  }

  requestAnimationFrame(draw);
}

draw();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const newColumns = Math.floor(canvas.width / fontSize);
  drops = Array(newColumns).fill(0);
});