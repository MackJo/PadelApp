/**
 * Smart vibration manager for Wear OS / Galaxy Watch 8
 */
export const haptics = {
  vibrate(pattern: number | number[]) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic errors on unsupported devices
      }
    }
  },

  point() {
    this.vibrate(35);
  },

  gameWon() {
    this.vibrate([70, 50, 90]);
  },

  setWon() {
    this.vibrate([100, 60, 100, 60, 220]);
  },

  goldenPoint() {
    this.vibrate([120, 60, 120, 60, 180]);
  },

  sideChange() {
    this.vibrate([150, 80, 150]);
  },

  undo() {
    this.vibrate(25);
  },

  bezelTick() {
    this.vibrate(12);
  },
};
