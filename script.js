// ==========================================
// 1. Force Page to Top on Refresh / Load
// ==========================================
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
  window.scrollTo(0, 0);
});

// ==========================================
// 2. Royal Gate Opening & Music Control
// ==========================================
const gateOverlay = document.getElementById('gateOverlay');
const openTrigger = document.getElementById('openTrigger');
const bgMusic = document.getElementById('bgMusic');
const audioBtn = document.getElementById('audioToggle');

let isMusicPlaying = false;

// Lock body on load so scrollbar cannot leak background
window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.body.classList.add('gate-locked');
  if (gateOverlay) {
    gateOverlay.classList.remove('opened');
  }
});

if (openTrigger) {
  openTrigger.addEventListener('click', () => {
    window.scrollTo(0, 0);
    if (gateOverlay) {
      gateOverlay.classList.add('opened');
    }

    // Unlock page scroll once the gate opens
    document.body.classList.remove('gate-locked');

    if (bgMusic && !isMusicPlaying) {
      bgMusic.play().then(() => {
        isMusicPlaying = true;
      }).catch(() => {});
    }
  });
}

if (audioBtn && bgMusic) {
  audioBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isMusicPlaying) {
      bgMusic.pause();
      audioBtn.style.opacity = '0.5';
    } else {
      bgMusic.play();
      audioBtn.style.opacity = '1';
    }
    isMusicPlaying = !isMusicPlaying;
  });
}

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
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    scratchCount++;
    if (scratchCount > 4) {
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

// ==========================================
// 4. Auto Smooth Photo Carousel (3 Images)
// ==========================================
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('#sliderDots .dot');
let currentSlide = 0;
const totalSlides = 3;

function goToSlide(index) {
  currentSlide = index;
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  dots.forEach((dot, i) => {
    if (i === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

let slideInterval = setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  goToSlide(currentSlide);
}, 3200);

dots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    clearInterval(slideInterval);
    const targetIdx = parseInt(e.target.getAttribute('data-index'));
    goToSlide(targetIdx);
    slideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      goToSlide(currentSlide);
    }, 3200);
  });
});

// ==========================================
// 5. Live Countdown Timer (Nov 30, 2026)
// ==========================================
const targetDate = new Date("April 21, 2027 12:30:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const difference = targetDate - now;

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-minutes');
    const s = document.getElementById('cd-seconds');

    if (d) d.innerText = String(days).padStart(2, '0');
    if (h) h.innerText = String(hours).padStart(2, '0');
    if (m) m.innerText = String(minutes).padStart(2, '0');
    if (s) s.innerText = String(seconds).padStart(2, '0');
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 6. RSVP Form Handler (WhatsApp Auto-link)
// ==========================================
const rsvpForm = document.getElementById('rsvpForm');

if (rsvpForm) {
  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value;
    const attending = document.getElementById('guestAttendance').value;
    const message = document.getElementById('guestMessage').value;

    const phoneNumber = "919876543210"; // Country code + mobile number
    const text = `*Wedding RSVP*%0A*Name:* ${encodeURIComponent(name)}%0A*Attending:* ${encodeURIComponent(attending)}%0A*Wishes:* ${encodeURIComponent(message)}`;

    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${text}`, '_blank');
    alert("Thank you for your RSVP response!");
    rsvpForm.reset();
  });
}