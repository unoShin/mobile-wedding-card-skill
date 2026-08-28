# Design, Themes & Customization Guide

This reference provides design principles, typography pairings, color palette presets, and component customization instructions.

---

## 🎨 Color Themes

All global styles and theme colors are configured in `css/variables.css`.

### 1. Romantic Rose (Default)
Soft blush pink, ivory backgrounds, and warm grey text:
```css
:root {
  --theme-text-body: #1a1a1a;
  --theme-text-secondary: #ad868b;
  --theme-color-accent: #d099a1;
  --theme-color-accent-subtle: #faf2f3;
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #f9f9f9;
  --theme-bg-secondary: #f8f5f3;
}
```

### 2. Classic Elegance (Navy & Champagne Gold)
Subtle champagne gold accents with deep navy contrast:
```css
:root {
  --theme-text-body: #1e242b;
  --theme-text-secondary: #c5a059;
  --theme-color-accent: #c5a059;
  --theme-color-accent-subtle: #faf7f0;
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #f8f9fa;
  --theme-bg-secondary: #f3f5f7;
}
```

### 3. Modern Pure Monochrome
Clean, minimal grayscale for modern photography:
```css
:root {
  --theme-text-body: #111111;
  --theme-text-secondary: #777777;
  --theme-color-accent: #333333;
  --theme-color-accent-subtle: #f0f0f0;
  --theme-bg-default: #ffffff;
  --theme-bg-primary: #fafafa;
  --theme-bg-secondary: #f4f4f4;
}
```

---

## ✒️ Typography

The default typography pairs classic Korean serif fonts with elegant Roman display type:
- **Korean Headings & Body**: `Gowun Batang` (`고운 바탕`), `Noto Serif KR`
- **English Labels & Titles**: `Cormorant Garamond`

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Gowun+Batang:wght@400;700&family=Noto+Serif+KR:wght@300;400;500;600&display=swap" rel="stylesheet">
```

---

## 🌸 Falling Petals Overlay (`js/petals.js`)

You can customize the falling petals by adjusting parameters in `js/petals.js`:
- `PETAL_COUNT`: Number of concurrent petals on screen (default `18`).
- `COLORS`: Array of CSS gradient strings.
- `animationDuration`: Range in seconds (e.g. `9` to `17` seconds) for falling speed.
- `--drift`: Horizontal oscillation offset in pixels (e.g. `-45px` to `45px`).

---

## 🖼️ Gallery & Lightbox

- **Grid Layout**: Responsive 3-column CSS Grid.
- **Initial Preview Count**: Defaults to 9 photos (`maxInitialGallery = 9` in `js/app.js`).
- **More Photos Button**: Toggles to reveal remaining images smoothly.
- **Lightbox Navigation**:
  - Click left/right arrow buttons.
  - Touch swipe left/right gestures for mobile devices.
  - ESC key or background click to dismiss.
