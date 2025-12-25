import { useEffect, useState } from 'react';
import { ASSET_EVENTS } from '@/lib/constants';

export function useAssetLoading() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [assetsProgress, setAssetsProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if assets already loaded and set state in callback
    if ((window as unknown as { sushiRaboAssetsLoaded?: boolean }).sushiRaboAssetsLoaded) {
      // Use setTimeout to defer setState until after effect execution
      setTimeout(() => setAssetsLoaded(true), 0);
      return;
    }
    
    const onAssetsLoaded = () => setAssetsLoaded(true);
    const onAssetsProgress = (e: Event) => {
      const customEvent = e as CustomEvent<{ progress?: number }>;
      const p = customEvent.detail?.progress;
      if (typeof p === 'number') setAssetsProgress(p);
    };
    
    window.addEventListener(ASSET_EVENTS.LOADED, onAssetsLoaded);
    window.addEventListener(ASSET_EVENTS.PROGRESS, onAssetsProgress);

    return () => {
      window.removeEventListener(ASSET_EVENTS.LOADED, onAssetsLoaded);
      window.removeEventListener(ASSET_EVENTS.PROGRESS, onAssetsProgress);
    };
  }, []);

  return { assetsLoaded, assetsProgress };
}

export function useEscapeKey(callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [callback, enabled]);
}

export function useBodyScrollLock(enabled: boolean) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    if (enabled) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    }

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [enabled]);
}
