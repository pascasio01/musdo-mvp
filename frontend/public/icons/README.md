# MUSDO PWA Icons — Generation Checklist

The manifest references the following PNG icons. They are **not yet committed** —
generate them from `public/favicon.svg` (or a high-resolution master) and place
them here.

## Required

| File                            | Size      | Purpose      | Notes                                       |
| ------------------------------- | --------- | ------------ | ------------------------------------------- |
| `icon-192.png`                  | 192×192   | `any`        | Standard app icon                           |
| `icon-512.png`                  | 512×512   | `any`        | High-res app icon (Android splash source)   |
| `icon-192-maskable.png`         | 192×192   | `maskable`   | Edge-to-edge with ≥10% safe-zone padding    |
| `icon-512-maskable.png`         | 512×512   | `maskable`   | Edge-to-edge with ≥10% safe-zone padding    |

## iOS — Apple Touch Icon

`apple-touch-icon.png` at **180×180** placed in `/public/`. iOS does **not**
respect `purpose: maskable` and does **not** apply the manifest's
`background_color`, so the touch icon must be opaque on a black background.

## iOS Splash (Optional, premium polish)

iOS does not auto-generate splash images. To enable them, generate
`apple-touch-startup-image-*.png` for the device matrix below and add
`<link rel="apple-touch-startup-image" media="..." href="...">` lines in
`index.html` for each.

| Device                          | Portrait      | Landscape     |
| ------------------------------- | ------------- | ------------- |
| iPhone 15 Pro Max / 14 Pro Max  | 1290×2796     | 2796×1290     |
| iPhone 15 Pro / 14 Pro          | 1179×2556     | 2556×1179     |
| iPhone 14/13/12                 | 1170×2532     | 2532×1170     |
| iPhone SE 3rd gen               | 750×1334      | 1334×750      |
| iPad Pro 12.9"                  | 2048×2732     | 2732×2048     |

## Generation Recipe

```bash
# Using ImageMagick (one-liner per icon)
convert favicon.svg -background none -resize 192x192 icon-192.png
convert favicon.svg -background "#000000" -resize 192x192 icon-192-maskable.png
# … etc.
```

Or use a generator like [pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator)
and drop the resulting files here.

## Visual rules

- **Brand:** MUSDO M-mark over OLED black (`#000000`) — never green.
- **Maskable:** keep the M inside the inner 80% safe zone — Android crops a
  circle/squircle/squarcle depending on launcher.
- **Resolution:** export at 2× or 3× the requested size and downscale for
  crisp anti-aliasing.
