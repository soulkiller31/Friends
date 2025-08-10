# Surprise Gift Website

A tiny, self-contained web page with a magical gift box, balloons, butterflies, confetti, and a glassmorphism photo slider. Clicking any photo shows a short quote.

## Run locally

- Option A: Any static server (VS Code Live Server, etc.)
- Option B: Python

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` and click “I have something for you”.

## Replace photos with your own

1. Create the folder `assets/photos/` at the project root.
2. Add your images as `1.jpg`, `2.jpg`, ... (or any names).
3. Open `script.js` and replace the `photos` array with the relative paths to your images, for example:

```js
const photos = [
  './assets/photos/1.jpg',
  './assets/photos/2.jpg',
  './assets/photos/3.jpg',
  // ...
];
```

## Customize quotes

Edit the `quotes` array in `script.js` with your own lovely messages. The quote shown when you click an image matches the image index (and loops if there are fewer quotes).

## Notes

- The project uses plain HTML/CSS/JS and no external build step. It works on mobile and desktop.
- Animations respect the user’s reduced-motion preference.