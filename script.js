// ==========================================
// 3. Scratch Card & Auto Confetti Blast
// ==========================================
const canvas = document.getElementById('scratchCanvas');
const scratchHeading = document.getElementById('scratchHeading');

let isScratching = false;
let scratchCount = 0;
let isRevealed = false;

if (canvas) {
  const ctx = canvas.getContext('2d');

  function initHeartCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(130, 225);
    ctx.bezierCurveTo(130, 225, 15, 145, 15, 75);
    ctx.bezierCurveTo(15, 25, 55, 5, 95, 5);
    ctx.bezierCurveTo(115, 5, 125, 20, 130, 30);
    ctx.bezierCurveTo(135, 20, 145, 5, 165, 5);
    ctx.bezierCurveTo(205, 5, 245, 25, 245, 75);
    ctx.bezierCurveTo(245, 145, 130, 225, 130, 225);
    ctx.closePath();
    ctx.clip();

    const grad = ctx.createRadialGradient(130, 100, 10, 130, 120, 140);
    grad.addColorStop(0, '#a5b59e');
    grad.addColorStop(0.5, '#7f9379');
    grad.addColorStop(1, '#566b52');
    ctx.fillStyle = grad;
    ctx.fill();

    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 1.5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.45})`;
      ctx.fill();
    }
    ctx.restore();
  }

  initHeartCanvas();

  function triggerConfettiBlast() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#c5a059', '#687563', '#e8d8b8', '#3d5641', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
          colors: ['#c5a059', '#687563', '#faf6ee']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
          colors: ['#c5a059', '#687563', '#faf6ee']
        });
      }, 250);
    }
  }

  function triggerAutoReveal() {
    if (isRevealed) return;
    isRevealed = true;

    if (scratchHeading) {
      scratchHeading.style.opacity = '0';
      setTimeout(() => {
        scratchHeading.innerText = "Our forever begins";
        scratchHeading.style.opacity = '1';
      }, 300);
    }

    canvas.classList.add('vanish');
    triggerConfettiBlast();
  }

  function scratch(e) {
    if (!isScratching || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2); // Compact brush radius
    ctx.fill();

    scratchCount++;
    // 35-40 baar scratch karne par hi card reveal hoga
    if (scratchCount > 38) {
      triggerAutoReveal();
    }
  }

  ['mousedown', 'touchstart'].forEach(evt => {
    canvas.addEventListener(evt, (e) => {
      isScratching = true;
      scratch(e);
    }, { passive: true });
  });

  ['mousemove', 'touchmove'].forEach(evt => {
    canvas.addEventListener(evt, scratch, { passive: true });
  });

  ['mouseup', 'mouseleave', 'touchend'].forEach(evt => {
    canvas.addEventListener(evt, () => {
      isScratching = false;
    });
  });
}
