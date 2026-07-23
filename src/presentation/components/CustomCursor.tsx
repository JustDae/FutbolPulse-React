import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    // Set initial position to center
    gsap.set(cursor, { x: window.innerWidth / 2, y: window.innerHeight / 2 });
    gsap.set(follower, { x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      });
    };

    const handleMouseHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a') || target.closest('button') || target.closest('.magnetic-btn')) {
        gsap.to(follower, { scale: 1.5, borderColor: 'rgba(227, 28, 61, 0.8)', backgroundColor: 'rgba(227, 28, 61, 0.1)', duration: 0.3 });
        gsap.to(cursor, { scale: 0, duration: 0.3 });
      } else {
        gsap.to(follower, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.5)', backgroundColor: 'transparent', duration: 0.3 });
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      }
    };

    // Hide native cursor when mouse enters the window
    document.documentElement.style.cursor = 'none';

    // Global listener for hover states
    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseover', handleMouseHover);

    return () => {
      document.documentElement.style.cursor = 'auto';
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseHover);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[9998] transition-colors duration-300"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
}
