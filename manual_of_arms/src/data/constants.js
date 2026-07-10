// SVG scale: 1 pace (28") = 14px
export const SCALE = {
  PACE_PX: 14,           // 1 pace = 14px
  SOLDIER_W: 8,          // soldier width (shoulder-width)
  SOLDIER_H: 6,          // soldier depth (front-to-back)
  RANK_GAP: 8,           // 16" between ranks (Casey S.C. ¶135) = 8px at 14px/28" pace
  FILE_CLOSER_GAP: 28,   // 2 paces behind rear rank
  FILE_INTERVAL: 10,     // elbow-to-elbow spacing between files
};

// Cadences (paces per minute)
export const CADENCE = {
  COMMON: 90,
  QUICK: 110,
  DOUBLE_QUICK: 165,
};

// Animation timing (ms per animated pace at 1x speed)
export const TIMING = {
  PACE_MS: 200,          // 1 pace ≈ 200ms at quick time, 1x speed
};

// Colors (mirrors CSS variables for use in D3)
export const COLORS = {
  RANK_FRONT: '#1E3A5F',
  RANK_REAR: '#5A7DA8',
  OFFICER: '#B45309',
  NCO: '#047857',
  COLORS_BEARER: '#DC2626',
  FIELD: '#F1F5F0',
  GRID: '#D6DBD4',
  ACCENT: '#2563EB',
};

// Canvas dimensions
export const CANVAS = {
  VIEW_W: 960,
  VIEW_H: 600,
};

// Company layout defaults
export const LAYOUT = {
  // Starting origin for line of battle (center of front rank)
  LINE_ORIGIN_X: 480,
  LINE_ORIGIN_Y: 400,
};
