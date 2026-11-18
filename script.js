const figurePreview = document.getElementById('figure-preview');
const figurePreviewImage = document.getElementById('figure-preview-image');
document.querySelectorAll('.paper-figure > button').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    figurePreviewImage.alt = image.alt;
    figurePreviewImage.src = image.currentSrc || image.src;
    figurePreview.showModal();
  });
});

const pond = document.getElementById('pond-scene');
const gooseThought = document.getElementById('goose-thought');
const bearSpeech = document.getElementById('bear-speech');

function showBubble(bubble, message) {
  bubble.textContent = message;
  bubble.hidden = false;
}

document.getElementById('pond-bird').addEventListener('click', () => {
  pond.classList.toggle('is-across');
  gooseThought.hidden = false;
});

document.querySelectorAll('[data-bear-message]').forEach(button => {
  button.addEventListener('click', () => showBubble(bearSpeech, button.dataset.bearMessage));
});

const photos = [
  {
    "src": "./assets/gallery/photo-01.webp",
    "alt": "Gallery photo 1",
    "rotateLeft": true,
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-02.webp",
    "alt": "Gallery photo 2",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-03.webp",
    "alt": "Gallery photo 3",
    "orientation": "landscape"
  },
  {
    "src": "./assets/gallery/photo-04.webp",
    "alt": "Gallery photo 4",
    "rotateLeft": true,
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-05.webp",
    "alt": "Gallery photo 5",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-06.webp",
    "alt": "Gallery photo 6",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-07.webp",
    "alt": "Gallery photo 7",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-08.webp",
    "alt": "Gallery photo 8",
    "orientation": "landscape"
  },
  {
    "src": "./assets/gallery/photo-09.webp",
    "alt": "Gallery photo 9",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-10.webp",
    "alt": "Gallery photo 10",
    "orientation": "landscape"
  },
  {
    "src": "./assets/gallery/photo-11.webp",
    "alt": "Gallery photo 11",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-12.webp",
    "alt": "Gallery photo 12",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-13.webp",
    "alt": "Gallery photo 13",
    "orientation": "portrait"
  },
  {
    "src": "./assets/gallery/photo-14.webp",
    "alt": "Gallery photo 14",
    "orientation": "landscape"
  }
];

let photo = document.getElementById('photo');
let pendingPhoto;
const placeholder = document.getElementById('photo-placeholder');
const photoStatus = document.getElementById('photo-status');
const orientation = Math.random() < 0.5 ? 'portrait' : 'landscape';
document.getElementById('profile').dataset.galleryOrientation = orientation;
const order = photos.filter(photo => photo.orientation === orientation);
let position = 0;
let timer;
const autoplay = order.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

for (let index = order.length - 1; index > 0; index--) {
  const other = Math.floor(Math.random() * (index + 1));
  [order[index], order[other]] = [order[other], order[index]];
}

async function showPhoto(index, announce = false) {
  const nextPosition = (index + order.length) % order.length;
  position = nextPosition;
  const slide = order[nextPosition];
  const nextPhoto = new Image();
  nextPhoto.alt = slide.alt;
  nextPhoto.classList.toggle('rotated-left', slide.rotateLeft === true);
  pendingPhoto = nextPhoto;
  nextPhoto.src = slide.src;

  try {
    await nextPhoto.decode();
  } catch {
    if (pendingPhoto === nextPhoto) {
      photo.hidden = true;
      placeholder.hidden = false;
      if (announce) photoStatus.textContent = 'Photo unavailable.';
    }
    return;
  }

  if (pendingPhoto !== nextPhoto) return;
  nextPhoto.id = photo.id;
  photo.replaceWith(nextPhoto);
  photo = nextPhoto;
  placeholder.hidden = true;
  if (announce) photoStatus.textContent = `Photo ${nextPosition + 1} of ${order.length}`;
}

function restartTimer() {
  window.clearInterval(timer);
  if (autoplay && !document.hidden) timer = window.setInterval(() => showPhoto(position + 1), 4800);
}

if (order.length) showPhoto(0);

document.querySelectorAll('[data-photo-step]').forEach(button => {
  button.disabled = order.length < 2;
  button.addEventListener('click', () => {
    showPhoto(position + Number(button.dataset.photoStep), true);
    restartTimer();
  });
});

if (autoplay) {
  document.addEventListener('visibilitychange', restartTimer);
  restartTimer();
}
