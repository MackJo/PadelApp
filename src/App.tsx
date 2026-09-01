import React, { useEffect } from 'react';
import { WatchScreen } from './components/WatchScreen';

export default function App() {
  // Keyboard shortcuts for testing and fast scoring
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        const btn = document.getElementById('tap-zone-team-1');
        btn?.click();
      } else if (e.key === '2' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        const btn = document.getElementById('tap-zone-team-2');
        btn?.click();
      } else if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
        const undoBtn = document.querySelector('button[title*="Undo"]') as HTMLButtonElement;
        undoBtn?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen h-[100dvh] bg-black text-white flex items-center justify-center overflow-hidden select-none touch-none p-0 m-0">
      <main className="w-full h-full max-w-[440px] max-h-[440px] aspect-square rounded-full overflow-hidden border border-neutral-900 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex items-center justify-center relative bg-black">
        <WatchScreen watchSize="44mm" />
      </main>
    </div>
  );
}
