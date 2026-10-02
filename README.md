# AdWrapz Web SDK

Ads-only wrapper around the Google IMA HTML5 SDK. It plays an AdWrapz **Ads Vast**
pre-roll pod on your own `<video>` element, then hands playback back to your content.

> This repository contains **build output only** (published from the AdWrapz
> monorepo). Issues and pull requests are not accepted here — contact your
> AdWrapz representative for support.

## Install

**Script tag (recommended)** — served by your AdWrapz domain, always the latest `1.x`:

```html
<script src="https://adwrapz.com/sdk/v1/adwrapz.js"></script>
```

Pin an exact version from the same domain:

```html
<script src="https://adwrapz.com/sdk/0.1.0/adwrapz.js"></script>
```

If you use a white-label AdWrapz domain, load the script from that domain instead.

**jsDelivr** (pinned to a release tag of this repository):

```html
<script src="https://cdn.jsdelivr.net/gh/adwrapz/adwrapz-web-sdk@v0.1.0/adwrapz.js"></script>
```

**npm (from GitHub)** — to vendor the file into your own build or static assets:

```bash
npm install github:adwrapz/adwrapz-web-sdk#v0.1.0
```

> ⚠️ When the script is **not** loaded from your AdWrapz domain (jsDelivr,
> self-hosted, or bundled into your app), you **must** pass `baseUrl`. The SDK
> otherwise assumes the origin it was loaded from serves your ads.

## Quick start

```html
<video id="player" src="/content.mp4" playsinline></video>
<button id="play">Play</button>

<script src="https://adwrapz.com/sdk/v1/adwrapz.js"></script>
<script>
    const ads = AdWrapz.attachAds(document.getElementById("player"), {
        vastId: "YOUR_VAST_ID",
    });

    ads.on("adError", (e) => console.warn("ad skipped:", e.code));

    // Must be called from a user gesture (mobile autoplay rules)
    document.getElementById("play").onclick = () => ads.start();
</script>
```

`start()` never throws. If the ad cannot play for any reason, an `adError` event is
emitted and your content plays.

## API

### `AdWrapz.attachAds(video, options) → AdsController`

| Option        | Type      | Default                       | Description                                              |
| ------------- | --------- | ----------------------------- | -------------------------------------------------------- |
| `vastId`      | `string`  | — (required)                  | Your Ads Vast entry id                                   |
| `baseUrl`     | `string`  | origin of the `<script src>`  | AdWrapz origin serving the ad (https). Required when not loading from AdWrapz |
| `adContainer` | `Element` | overlay created over `video`  | Custom container for the ad UI                           |
| `timeoutMs`   | `number`  | `8000`                        | Give up on the ad and resume content after this long     |

### `AdsController`

- `start()` — start the ad break, then content. Call from a user gesture.
- `destroy()` — tear down IMA and the overlay.
- `on(event, callback)` — subscribe; returns an unsubscribe function.

### Events

| Event          | Payload                        |
| -------------- | ------------------------------ |
| `adBreakStart` | —                              |
| `adBreakEnd`   | —                              |
| `adSkipped`    | —                              |
| `adError`      | `{ code, detail? }`            |
| `raw`          | raw `google.ima.AdEvent`       |

`adError` codes: `ima-blocked` (IMA failed to load, e.g. an ad blocker), `empty-vast`
(no ad to show), `timeout`, `ad-error` (any other IMA error).

The same event vocabulary is used by the AdWrapz Android and iOS SDKs.

## TypeScript

`adwrapz.d.ts` declares the global `AdWrapz`. With the npm install:

```ts
import "@adwrapz/web-sdk"; // side effect: defines the global

const ads = AdWrapz.attachAds(video, { vastId, baseUrl: "https://adwrapz.com" });
```

The current build is a classic script (IIFE) with no ES module exports.

## Requirements

- The page must be served over **https** (IMA refuses ads on http pages).
- Evergreen browsers (Chrome, Edge, Firefox, Safari — last two versions) and iOS Safari 15+.

## License

Proprietary — Copyright © 2026 Extics Co., Ltd. All rights reserved. See [LICENSE](LICENSE).
