# Surprise Gift Website

A tiny, self-contained web page with a magical gift box, balloons, butterflies, confetti, and a glassmorphism photo slider. Clicking any photo shows a short quote.

## Run locally

- Option A: Any static server (VS Code Live Server, etc.)
- Option B: Python

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` and click “I have something for you”.

## Add your own photos

You have two easy options:

- Select images using the button on the page (recommended). Supports multiple selection.
- Or, place files in the project and reload the page. The app automatically searches for images named `pic1.jpg`…`pic20.png` or `1.jpg`…`20.png` in either `assets/` or `assets/photos/`.

Tip: 6–15 photos look best.

## Customize quotes

Quotes are generated based on image colors and brightness. If analysis fails, a friendly default is used.

## Notes

- The project uses plain HTML/CSS/JS and no external build step. It works on mobile and desktop.
- Animations respect the user’s reduced-motion preference.
- The slider adapts to different aspect ratios and marks portrait images to avoid cropping.