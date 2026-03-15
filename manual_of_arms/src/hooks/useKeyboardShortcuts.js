import { useEffect } from 'react';

/**
 * Keyboard shortcuts for the drill canvas:
 *   Space    → play / pause
 *   ←        → step back
 *   →        → step forward
 *   1        → speed 0.5x
 *   2        → speed 1x
 *   3        → speed 2x
 */
export function useKeyboardShortcuts({ play, pause, stepForward, stepBack, setSpeed, isPlaying }) {
  useEffect(() => {
    function handleKey(e) {
      // Don't intercept when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'ArrowRight':
          e.preventDefault();
          stepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          stepBack();
          break;
        case '1':
          setSpeed(0.5);
          break;
        case '2':
          setSpeed(1);
          break;
        case '3':
          setSpeed(2);
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [play, pause, stepForward, stepBack, setSpeed, isPlaying]);
}
