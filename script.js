// Surprise Gift App - final version
// High level: supports user photo selection, generates an aesthetic quote for each image,
// runs gift box animation with balloons, butterflies, confetti, then shows a glass slider.

// ---------------------- Helpers ----------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

// ---------------------- DOM ----------------------
const hero = $('#hero');
const scene = $('#scene');
const startButton = $('#startButton');
const photoPickerLabel = document.querySelector('label[for="photoPicker"]');
const photoPicker = $('#photoPicker');
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

// ---------------------- State ----------------------
let selectedPhotos = [];
let photoUrls = [];
let photoQuotes = [];
let currentIndex = 0;
let sliderInterval;

// Fallback images if user does not select any
const fallbackPhotos = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1546802519-3fb6469f5b39?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=1600&auto=format&fit=crop'
];

// Attempt to load local images named assets/photos/pic1.jpg..pic10.jpg
async function loadLocalPhotos() {
  const candidates = Array.from({ length: 10 }, (_, i) => `./assets/photos/pic${i + 1}.jpg`);
  const present = [];
  for (const url of candidates) {
    // eslint-disable-next-line no-await-in-loop
    const ok = await checkImageExists(url);
    if (ok) present.push(url);
  }
  return present;
}

function checkImageExists(url, timeoutMs = 2500) {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const finish = (val) => { if (!done) { done = true; resolve(val); } };
    const timer = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => { clearTimeout(timer); finish(true); };
    img.onerror = () => { clearTimeout(timer); finish(false); };
    img.src = url + `?t=${Date.now()}`; // cache-bust during dev
  });
}

// ---------------------- Photo picker ----------------------
photoPickerLabel?.addEventListener('click', () => photoPicker?.click());

photoPicker?.addEventListener('change', async (e) => {
  const files = Array.from(e.target.files || [])
    .filter((f) => f.type.startsWith('image/'))
    .slice(0, 24); // reasonable cap
  if (files.length === 0) {
    photoUrls = [...fallbackPhotos];
    photoQuotes = await generateQuotesForPhotos(photoUrls);
    photoPickerLabel.textContent = 'No photos chosen (using defaults)';
    return;
  }

  selectedPhotos = files;
  // Convert to object URLs for immediate preview
  photoUrls = selectedPhotos.map((f) => URL.createObjectURL(f));
  photoPickerLabel.textContent = `${files.length} photos added ✔`;

  // Precompute quotes
  photoQuotes = await generateQuotesForPhotos(photoUrls);
});

// If user never selects, prepare defaults on start
async function ensurePhotosReady() {
  if (photoUrls.length === 0) {
    const local = await loadLocalPhotos();
    photoUrls = local.length ? local : [...fallbackPhotos];
    photoQuotes = await generateQuotesForPhotos(photoUrls);
  }
}

// ---------------------- Flow ----------------------
startButton.addEventListener('click', async () => {
  await ensurePhotosReady();
  hero.classList.add('hidden');
  scene.classList.remove('hidden');
});

openGiftBtn.addEventListener('click', () => {
  giftBox.classList.add('open');
  openGiftBtn.disabled = true;
  openGiftBtn.textContent = 'Yay!';

  // celebratory effects
  releaseBalloons(24);
  releaseButterflies(16);
  releaseConfetti(160);

  setTimeout(() => {
    buildSlider(photoUrls, photoQuotes);
    sliderWrapper.classList.remove('hidden');
    sliderWrapper.scrollIntoView({ behavior: 'smooth' });
  }, 1800);
});

// ---------------------- Celebrations ----------------------
function releaseBalloons(count) {
  const colors = ['#ff4c7d', '#ffd166', '#9b5de5', '#00bbf9', '#f15bb5', '#00f5d4'];
  for (let i = 0; i < count; i++) {
    const b = document.createElement('span');
    b.className = 'balloon';
    b.style.background = colors[i % colors.length];
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

    const left = document.createElement('span');
    left.className = 'wing left';
    const right = document.createElement('span');
    right.className = 'wing right';

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

// ---------------------- Image analysis + AI-style quotes ----------------------
// We create a summary based on dominant color and average brightness
async function generateQuotesForPhotos(urls) {
  const results = [];
  for (let i = 0; i < urls.length; i++) {
    try {
      const { brightness, hue } = await analyzeImage(urls[i]);
      const mood = moodFromColor(brightness, hue);
      results.push(generateQuoteForMood(mood, i));
    } catch (_) {
      results.push(defaultQuote(i));
    }
  }
  return results;
}

function generateQuoteForMood(mood, index) {
  const base = [
    'You turn simple moments into soft miracles.',
    'Every day with you is a little poem.',
    'Your laugh is the map my heart loves to follow.',
    'You make the world feel like a warm sunrise.',
    'In the gallery of my days, you’re the brightest frame.',
    'Wherever you are, kindness grows a little taller.',
  ];
  const moodLines = {
    sunny: [
      'You are the sunlight that teaches my shadows how to dance.',
      'Your glow feels like summer held in two hands.',
    ],
    cozy: [
      'You are the warm cup on a rainy afternoon of life.',
      'With you, quiet turns into comfort.',
    ],
    vibrant: [
      'Joy does cartwheels when you walk into the room.',
      'Colors look brighter when they stand next to you.',
    ],
    dreamy: [
      'You are the hush between heartbeats where wishes live.',
      'Every glance from you is a soft star landing.',
    ],
  };
  const pool = [...base, ...(moodLines[mood] || [])];
  return pool[index % pool.length];
}

function defaultQuote(i) {
  const generic = [
    'Best friends: the family we find along the way.',
    'Your smile is my favorite kind of sunrise.',
    'You make ordinary moments feel like celebrations.',
    'Some people make the world special just by being in it. That’s you.',
  ];
  return generic[i % generic.length];
}

function moodFromColor(brightness, hue) {
  // brightness: 0..255, hue: 0..360
  if (brightness > 190) return 'sunny';
  if (brightness < 90) return 'dreamy';
  // color family
  if (hue >= 20 && hue <= 70) return 'cozy'; // warm/orange/yellow
  if (hue >= 250 && hue <= 340) return 'vibrant'; // purple/pink
  return 'sunny';
}

function analyzeImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const w = (canvas.width = 64);
        const h = (canvas.height = 64);
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        let r = 0, g = 0, b = 0, count = 0, bright = 0;
        for (let i = 0; i < data.length; i += 4) {
          const R = data[i], G = data[i + 1], B = data[i + 2], A = data[i + 3];
          if (A < 10) continue;
          r += R; g += G; b += B; count++;
          bright += 0.2126 * R + 0.7152 * G + 0.0722 * B; // perceived luma
        }
        if (count === 0) throw new Error('no pixels');
        r /= count; g /= count; b /= count; bright = clamp(bright / count, 0, 255);
        const hue = rgbToHue(r, g, b);
        resolve({ brightness: bright, hue });
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = reject;
    img.src = src;
  });
}

function rgbToHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max === min) h = 0;
  else if (max === r) h = (60 * ((g - b) / (max - min)) + 360) % 360;
  else if (max === g) h = 60 * ((b - r) / (max - min)) + 120;
  else h = 60 * ((r - g) / (max - min)) + 240;
  return h;
}

// ---------------------- Slider ----------------------
function buildSlider(urls, quotes) {
  const slidesTrack = document.createElement('div');
  slidesTrack.className = 'slides';

  urls.forEach((src, idx) => {
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
      quoteText.textContent = quotes[idx] || defaultQuote(idx);
      quoteModal.classList.remove('hidden');
    });

    slidesTrack.appendChild(slide);
  });

  slider.innerHTML = '';
  slider.appendChild(slidesTrack);
  startAutoRotate(urls.length);
}

function startAutoRotate(total) {
  stopAutoRotate();
  currentIndex = 0;
  sliderInterval = setInterval(() => nextSlide(total), 3200);
}

function stopAutoRotate() { if (sliderInterval) clearInterval(sliderInterval); }

function nextSlide(total) {
  const track = slider.querySelector('.slides');
  if (!track || !total) return;
  currentIndex = (currentIndex + 1) % total;
  track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;
}

// ---------------------- Modal ----------------------
closeModal.addEventListener('click', () => quoteModal.classList.add('hidden'));
quoteModal.addEventListener('click', (e) => { if (e.target === quoteModal) quoteModal.classList.add('hidden'); });
slider.addEventListener('mouseenter', stopAutoRotate);
slider.addEventListener('mouseleave', () => startAutoRotate(photoUrls.length));