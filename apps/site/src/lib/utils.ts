import gsap from 'gsap';

// GSAP animation utilities
export const createScrollTriggerTimeline = (trigger: string | HTMLElement, end: string | number) => {
  return gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: typeof end === 'number' ? `+=${end}` : end,
      scrub: 1,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
};

// Body scroll lock utility
export const lockBodyScroll = () => {
  const prevBodyOverflow = document.body.style.overflow;
  const prevHtmlOverflow = document.documentElement.style.overflow;
  
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  
  return () => {
    document.body.style.overflow = prevBodyOverflow;
    document.documentElement.style.overflow = prevHtmlOverflow;
  };
};

// Event dispatch utilities
export const dispatchAssetEvent = (type: 'loaded' | 'progress', detail?: unknown) => {
  if (typeof window === 'undefined') return;
  
  const eventName = type === 'loaded' ? 'sushi-rabo-assets-loaded' : 'sushi-rabo-assets-progress';
  const event = type === 'loaded' 
    ? new Event(eventName)
    : new CustomEvent(eventName, { detail });
    
  window.dispatchEvent(event);
};

// Input validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};
