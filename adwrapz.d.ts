// Types for the AdWrapz Web SDK IIFE build (adwrapz.js).
//
// The build has no module exports — it assigns a global `AdWrapz`. Load it
// with a <script> tag, or `import "@adwrapz/web-sdk"` for its side effect,
// then use the global. Hand-written to match the IIFE: keep in sync with
// packages/sdk/src/types.ts in the AdWrapz monorepo.

export {};

declare global {
    interface AdWrapzAttachOptions {
        /** Ads Vast entry id — the SDK builds `${baseUrl}/api/vasts/${vastId}/xml` itself */
        vastId: string;
        /**
         * Origin serving the vasts XML. Default: the origin the SDK script was
         * loaded from (falls back to https://adwrapz.com). Pass it explicitly
         * when the file is served from anywhere other than your AdWrapz domain
         * (jsDelivr, self-hosted, bundled).
         */
        baseUrl?: string;
        /** Escape hatch for unusual layouts. Default: the SDK creates an overlay div over the video */
        adContainer?: Element;
        /** Max wait for the ad before giving up and resuming content. Default: 8000 */
        timeoutMs?: number;
    }

    type AdWrapzAdErrorCode =
        | "ima-blocked"
        | "empty-vast"
        | "timeout"
        | "ad-error";

    interface AdWrapzAdErrorPayload {
        code: AdWrapzAdErrorCode;
        detail?: unknown;
    }

    interface AdWrapzAdEventMap {
        adBreakStart: undefined;
        adBreakEnd: undefined;
        adError: AdWrapzAdErrorPayload;
        adSkipped: undefined;
        /** Raw google.ima AdEvent passthrough for power users */
        raw: unknown;
    }

    type AdWrapzAdEvent = keyof AdWrapzAdEventMap;

    interface AdWrapzAdsController {
        /** Call from a user gesture only (mobile requirement). Never throws. */
        start(): void;
        /** Tear down IMA and the overlay entirely */
        destroy(): void;
        /** Subscribe to an event; returns an unsubscribe function */
        on<E extends AdWrapzAdEvent>(
            event: E,
            cb: (payload: AdWrapzAdEventMap[E]) => void,
        ): () => void;
    }

    const AdWrapz: {
        attachAds(
            video: HTMLVideoElement,
            opts: AdWrapzAttachOptions,
        ): AdWrapzAdsController;
    };
}
