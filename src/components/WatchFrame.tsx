import React, { useState, useRef } from 'react';
import { WatchScreen } from './WatchScreen';
import { soundEngine } from '../utils/audio';
import { haptics } from '../utils/haptics';

interface WatchFrameProps {
  watchSize: '40mm' | '44mm';
  onToggleSize: (size: '40mm' | '44mm') => void;
  isFullscreen: boolean;
}

export const WatchFrame: React.FC<WatchFrameProps> = ({ watchSize, onToggleSize, isFullscreen }) => {
  const [bezelAngle, setBezelAngle] = useState(0);
  const lastAngleRef = useRef<number | null>(null);
  const watchCenterRef = useRef<HTMLDivElement>(null);

  // Calculate angle for touch/mouse bezel rotation
  const handleBezelMove = (clientX: number, clientY: number) => {
    if (!watchCenterRef.current) return;
    const rect = watchCenterRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    const rad = Math.atan2(deltaY, deltaX);
    let deg = rad * (180 / Math.PI);
    if (deg < 0) deg += 360;

    if (lastAngleRef.current !== null) {
      const diff = deg - lastAngleRef.current;
      // Filter large jumps across 0/360 boundary
      if (Math.abs(diff) < 60 && Math.abs(diff) > 4) {
        setBezelAngle((prev) => prev + diff);
        soundEngine.playBezelTick();
        haptics.bezelTick();
      }
    }
    lastAngleRef.current = deg;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    lastAngleRef.current = null;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      handleBezelMove(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = () => {
    lastAngleRef.current = null;
  };

  // If in fullscreen mode (e.g. inside smartwatch browser), render purely circular screen edge-to-edge
  if (isFullscreen) {
    const maxScreen = watchSize === '44mm' ? 'max-w-[450px] max-h-[450px]' : 'max-w-[380px] max-h-[380px]';
    return (
      <div className={`w-full h-full ${maxScreen} aspect-square rounded-full overflow-hidden bg-black p-0 border border-neutral-800 shadow-2xl mx-auto flex items-center justify-center`}>
        <WatchScreen watchSize={watchSize} onToggleWatchSize={onToggleSize} />
      </div>
    );
  }

  // Dimensions based on watch profile (40mm vs 44mm)
  const screenDiameter = watchSize === '44mm' ? 368 : 316;
  const frameDiameter = watchSize === '44mm' ? 444 : 392;

  return (
    <div className="relative flex flex-col items-center justify-center my-4 select-none">
      {/* Top Watch Band (Strap) */}
      <div
        className="w-32 h-20 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 rounded-t-2xl shadow-xl border-t border-x border-neutral-700/50 flex flex-col items-center justify-end overflow-hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #1f1f23, #1f1f23 3px, #18181b 3px, #18181b 8px)',
        }}
      >
        <div className="w-12 h-1 bg-neutral-700/80 rounded-full mb-3" />
      </div>

      {/* Galaxy Watch 8 Outer Case */}
      <div
        ref={watchCenterRef}
        className="relative flex items-center justify-center rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
        style={{
          width: `${frameDiameter}px`,
          height: `${frameDiameter}px`,
          background:
            'radial-gradient(circle at 35% 30%, #404048 0%, #202026 50%, #121216 100%)',
          border: '3px solid #33333d',
          boxShadow:
            '0 0 0 1px #555562, 0 16px 36px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.15)',
        }}
      >
        {/* Right Hardware Buttons */}
        {/* Top Button: Home / Power */}
        <div
          className="absolute -right-3 top-1/4 w-3.5 h-11 bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700 rounded-r-md border border-neutral-600 shadow-md cursor-pointer active:translate-x-[-1px] transition-transform flex items-center justify-center z-40"
          title="Galaxy Watch 8 - Top Button (Home / Play / Pause)"
          onClick={() => {
            soundEngine.playBezelTick();
            haptics.bezelTick();
            // Trigger timer toggle or play
            const timerBtn = document.querySelector('button[title*="Timer"]') as HTMLButtonElement;
            timerBtn?.click();
          }}
        >
          <div className="w-0.5 h-6 bg-red-500/80 rounded-full" />
        </div>

        {/* Bottom Button: Back / Undo */}
        <div
          className="absolute -right-3 bottom-1/4 w-3.5 h-11 bg-gradient-to-r from-neutral-600 via-neutral-400 to-neutral-700 rounded-r-md border border-neutral-600 shadow-md cursor-pointer active:translate-x-[-1px] transition-transform z-40"
          title="Galaxy Watch 8 - Bottom Button (Back / Undo Point)"
          onClick={() => {
            soundEngine.playBezelTick();
            haptics.bezelTick();
            const undoBtn = document.querySelector('button[title*="Undo"]') as HTMLButtonElement;
            undoBtn?.click();
          }}
        />

        {/* Interactive Rotating Digital Bezel Ring (Outer Rim Only) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="absolute inset-1 rounded-full cursor-grab active:cursor-grabbing z-10 pointer-events-auto"
          style={{
            transform: `rotate(${bezelAngle}deg)`,
            transition: 'transform 0.05s ease-out',
            border: '2px dashed rgba(255,255,255,0.18)',
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)',
          }}
          title="Interactive Bezel (Rotate along outer edge)"
        >
          {/* Bezel tick marks */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div
              key={deg}
              className="absolute left-1/2 top-1 w-1 h-2 -translate-x-1/2 bg-neutral-400 rounded-full opacity-70"
              style={{
                transformOrigin: `0 ${frameDiameter / 2 - 10}px`,
                transform: `rotate(${deg}deg)`,
              }}
            />
          ))}
        </div>

        {/* Sapphire Glass Ring & Inner Bezel Display Container */}
        <div
          className="relative z-30 rounded-full overflow-hidden flex items-center justify-center bg-black border border-neutral-800 pointer-events-auto"
          style={{
            width: `${screenDiameter}px`,
            height: `${screenDiameter}px`,
            boxShadow:
              'inset 0 0 16px rgba(0,0,0,0.95), 0 0 0 2px #18181c',
          }}
        >
          {/* Glass glare overlay */}
          <div className="absolute inset-0 pointer-events-none z-40 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent rounded-full" />

          {/* Actual Smartwatch Display Application */}
          <WatchScreen watchSize={watchSize} onToggleWatchSize={onToggleSize} />
        </div>
      </div>

      {/* Bottom Watch Band (Strap) */}
      <div
        className="w-32 h-20 bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 rounded-b-2xl shadow-xl border-b border-x border-neutral-700/50 flex flex-col items-center justify-start overflow-hidden"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #1f1f23, #1f1f23 3px, #18181b 3px, #18181b 8px)',
        }}
      >
        <div className="w-12 h-1 bg-neutral-700/80 rounded-full mt-3" />
      </div>
    </div>
  );
};
