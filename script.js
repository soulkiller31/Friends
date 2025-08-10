// Utility helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// DOM references
const hero = $('#hero');
const scene = $('#scene');
const startButton = $('#startButton');
const giftBox = $('#giftBox');
const openGiftBtn = $('#openGift');
const balloonLayer = $('#balloonLayer');
const butterflyLayer = $('#butterflyLayer');
const confettiLayer = $('#confettiLayer');
const sliderWrapper = $('#sliderWrapper');
const slider = $('#slider');
const quoteModal = $('#quoteModal');
const quoteText = $('#quoteText');
const closeModal = $('#closeModal');

// Replace these URLs with local images by placing files in /assets/photos and updating the paths
const photos = [
  // You can replace with './assets/photos/1.jpg', './assets/photos/2.jpg', ...
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601582585289-7e109d74b8b0?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546802519-3fb6469f5b39?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=1600&auto=format&fit=crop'
];

const quotes = [
  'Your smile is my favorite kind of sunrise.',
  'Best friends: the family we find along the way.',
  'You make ordinary moments feel like tiny celebrations.',
  'With you, every chapter reads a little brighter.',
  'You are the calm and the chaos that my heart chose.',
  'I hope you see the magic in yourself the way I see it in you.',
  'If joy had a face, it would look a lot like yours.',
  'Some people make the world special just by being in it. That’s you.',
  'No distance outgrows the roots we planted together.'
];

// Step 1: Start
startButton.addEventListener('click', () => {
  hero.classList.add('hidden');
  scene.classList.remove('hidden');
});

// Step 2: Open gift box -> FX -> Slider
openGiftBtn.addEventListener('click', () => {
  giftBox.classList.add('open');
  openGiftBtn.disabled = true;
  openGiftBtn.textContent = 'Yay!';

  // Effects
  releaseBalloons(22);
  releaseButterflies(14);
  releaseConfetti(140);

  // Reveal slider after a short moment
  setTimeout(() => {
    buildSlider();
    sliderWrapper.classList.remove('hidden');
    // Smooth scroll into view
    sliderWrapper.scrollIntoView({ behavior: 'smooth' });
  }, 1800);
});

function rand(min, max) { return Math.random() * (max - min) + min; }
function randInt(min, max) { return Math.floor(rand(min, max)); }

function releaseBalloons(count) {
  const colors = ['#ff4c7d', '#ffd166', '#9b5de5', '#00bbf9', '#f15bb5', '#00f5d4'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    const hue = colors[i % colors.length];
    b.style.background = hue;
    b.style.left = `${rand(0, 92)}%`;
    b.style.animationDuration = `${rand(6, 10)}s`;
    b.style.opacity = `${rand(0.8, 1)}`;
    balloonLayer.appendChild(b);
    setTimeout(() => b.remove(), 11000);
  }
}

function releaseButterflies(count) {
  for (let i = 0; i < count; i++) {
    const wrap = document.createElement('span');
    wrap.className = 'butterfly';
    wrap.style.left = `${rand(5, 95)}%`;
    wrap.style.bottom = `${rand(-10, 10)}%`;
    wrap.style.animationDelay = `${rand(0, 2)}s`;

    const right = document.createElement('span');
    right.className = 'wing right wing';
    const left = document.createElement('span');
    left.className = 'wing left';
    wrap.appendChild(left);
    wrap.appendChild(right);

    butterflyLayer.appendChild(wrap);
    setTimeout(() => wrap.remove(), 8000);
  }
}

function releaseConfetti(count) {
  const colors = ['#ff4c7d', '#ffd166', '#9b5de5', '#00bbf9', '#00f5d4', '#f15bb5'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('span');
    c.className = 'confetti';
    c.style.left = `${rand(0, 100)}%`;
    c.style.bottom = `${rand(0, 10)}%`;
    c.style.background = colors[randInt(0, colors.length)];
    c.style.animationDuration = `${rand(2.2, 4)}s`;
    c.style.transform = `translateY(0) rotate(${rand(-40, 40)}deg)`;
    confettiLayer.appendChild(c);
    setTimeout(() => c.remove(), 4200);
  }
}

// Slider
let currentIndex = 0;
let sliderInterval;

function buildSlider() {
  const slidesTrack = document.createElement('div');
  slidesTrack.className = 'slides';

  photos.forEach((src, idx) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.dataset.index = String(idx);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Memory ${idx + 1}`;
    slide.appendChild(img);

    const cap = document.createElement('div');
    cap.className = 'caption';
    cap.textContent = `Memory ${idx + 1}`;
    slide.appendChild(cap);

    slide.addEventListener('click', () => {
      const quote = quotes[idx % quotes.length];
      quoteText.textContent = quote;
      quoteModal.classList.remove('hidden');
    });

    slidesTrack.appendChild(slide);
  });

  slider.innerHTML = '';
  slider.appendChild(slidesTrack);

  startAutoRotate();
}

function startAutoRotate() {
  stopAutoRotate();
  sliderInterval = setInterval(nextSlide, 3500);
}

function stopAutoRotate() {
  if (sliderInterval) clearInterval(sliderInterval);
}

function nextSlide() {
  const track = slider.querySelector('.slides');
  if (!track) return;
  currentIndex = (currentIndex + 1) % photos.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Modal behavior
closeModal.addEventListener('click', () => quoteModal.classList.add('hidden'));
quoteModal.addEventListener('click', (e) => {
  if (e.target === quoteModal) quoteModal.classList.add('hidden');
});

// Pause rotation when user hovers
slider.addEventListener('mouseenter', stopAutoRotate);
slider.addEventListener('mouseleave', startAutoRotate);