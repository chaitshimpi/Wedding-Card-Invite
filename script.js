// ==========================================
// 3. Scratch Card (Pixel-Percentage Based Scratching)
// ==========================================
const canvas = document.getElementById('scratchCanvas');
const scratchHeading = document.getElementById('scratchHeading');

let isScratching = false;
let isRevealed = false;
let lastCheckTime = 0;

if (canvas) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

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

    // Sage-green metallic gradient
    const grad = ctx.createRadialGradient(130, 100, 10, 130, 120, 140);
    grad.addColorStop(0, '#a5b59e');
    grad.addColorStop(0.5, '#7f9379');
    grad.addColorStop(1, '#566b52');
    ctx.fillStyle = grad;
    ctx.fill();

    // Shimmer gold dust particles
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

  // Calculate kitna percent scratch ho chuka hai
  function checkScratchPercentage() {
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentPixels = 0;
    let totalTargetPixels = 0;

    // Scan every 4th pixel for super-fast performance
    for (let i = 3; i < pixels.length; i += 16) {
      totalTargetPixels++;
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const percentage = (transparentPixels / totalTargetPixels) * 100;
    
    // Jab tak 45% card clear na ho tab tak reveal nahi hoga
    if (percentage > 45) {
      triggerAutoReveal();
    }
  }

  function scratch(e) {
    if (!isScratching || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2); // Real scratch brush size
    ctx.fill();

    // Har 100ms me ek baar progress check karega
    const now = Date.now();
    if (now - lastCheckTime > 100) {
      lastCheckTime = now;
      checkScratchPercentage();
    }
  }

  canvas.addEventListener('mousedown', (e) => {
    isScratching = true;
    scratch(e);
  });

  canvas.addEventListener('touchstart', (e) => {
    isScratching = true;
    scratch(e);
  }, { passive: true });

  window.addEventListener('mousemove', scratch);
  window.addEventListener('touchmove', scratch, { passive: true });

  ['mouseup', 'touchend', 'touchcancel'].forEach(evt => {
    window.addEventListener(evt, () => {
      isScratching = false;
      if (!isRevealed) {
        checkScratchPercentage();
      }
    });
  });
}
