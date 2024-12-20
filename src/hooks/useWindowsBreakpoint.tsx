import { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';

enum Breakpoint {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl',
}

// Define your breakpoints
const breakpoints = {
  [Breakpoint.XS]: 0,
  [Breakpoint.SM]: 640,
  [Breakpoint.MD]: 768,
  [Breakpoint.LG]: 1024,
  [Breakpoint.XL]: 1280,
  [Breakpoint.XXL]: 1536,
};

function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(getBreakpoint());

  // Function to determine the current breakpoint
  function getBreakpoint(): Breakpoint {
    const width = window.innerWidth;
    if (width >= breakpoints[Breakpoint.XXL]) return Breakpoint.XXL;
    if (width >= breakpoints[Breakpoint.XL]) return Breakpoint.XL;
    if (width >= breakpoints[Breakpoint.LG]) return Breakpoint.LG;
    if (width >= breakpoints[Breakpoint.MD]) return Breakpoint.MD;
    if (width >= breakpoints[Breakpoint.SM]) return Breakpoint.SM;
    return Breakpoint.XS;
  }

  const debouncedResizeHandler = useRef(
    debounce(() => {
      setCurrentBreakpoint(getBreakpoint());
    }, 300),
  ).current;

  useEffect(() => {
    // Initial check
    debouncedResizeHandler();
    window.addEventListener('resize', debouncedResizeHandler);

    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
      debouncedResizeHandler.cancel();
    };
  }, []);

  return currentBreakpoint;
}

export default useBreakpoint;
