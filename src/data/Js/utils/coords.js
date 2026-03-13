'use strict';
/**
 * coords.js — src/data/JS/utils/coords.js
 *
 * Coordinate system:
 *   game world: Theoretically unlimited, limited to ±5000 game units
 *   Canvas:    12000×12000 px at 10 px/game unit
 *              → World range from -600 to +600 displayable without zoom
 *   Origin: Game coordinates (0,0) → Canvas pixels (6000, 6000)

 *
 *   X: + to the right
 *   Y: + downward (as in the game / as on maps)
 *
 * Zone Support:
 *   setZone() defines the view area for resetView().
 *   The canvas itself always remains the same size.
 */

const TLC_COORDS = (() => {

  const PX_PER_UNIT  = 10;          // 10 pixels per game unit
  const WORLD_LIMIT  = 5000;        // Play area boundary (display)
  const ORIGIN_UNITS = 600;         // Canvas half in game units (±600)
  const MAP_W = ORIGIN_UNITS * 2 * PX_PER_UNIT;  // 12000 px
  const MAP_H = ORIGIN_UNITS * 2 * PX_PER_UNIT;  // 12000 px

  // Game coordinates (0,0) lie at Canvas pixels (MAP_W/2, MAP_H/2)
  const ORIGIN_PX = MAP_W / 2;  // 6000

  // ── Zone view area (for resetView) ───────────────────────────────
  let _viewLonMin = -30,  _viewLonMax = 180;
  let _viewLatMin = -100, _viewLatMax = 100;

  function setZone(zone) {
    _viewLonMin = zone.lonMin ?? -30;
    _viewLonMax = zone.lonMax ?? 180;
    _viewLatMin = zone.latMin ?? -100;
    _viewLatMax = zone.latMax ?? 100;
  }

  // ── Game coordinate → Canvas pixel ────────────────────────────────
  function gxToPx(gx) { return ORIGIN_PX + gx * PX_PER_UNIT; }
  function gyToPy(gy) { return ORIGIN_PX + gy * PX_PER_UNIT; }  // +Y = bottom

  // ── Canvas pixel → Game coordinate ────────────────────────────────
  function pxToGx(px) { return (px - ORIGIN_PX) / PX_PER_UNIT; }
  function pyToGy(py) { return (py - ORIGIN_PX) / PX_PER_UNIT; }

  // ── Screen → Canvas ───────────────────────────────────────────────
  function screenToCanvas(sx, sy, wrapRect, panX, panY, scale) {
    return [
      (sx - wrapRect.left - panX) / scale,
      (sy - wrapRect.top  - panY) / scale,
    ];
  }

  // ── Zone-Rect (Canvas-Pixel) für resetView ────────────────────────
  function getZoneRect() {
    return {
      x: gxToPx(_viewLonMin),
      y: gyToPy(_viewLatMin),
      w: (_viewLonMax - _viewLonMin) * PX_PER_UNIT,
      h: (_viewLatMax - _viewLatMin) * PX_PER_UNIT,
    };
  }

  function getZoneCenter() {
    return {
      cx: gxToPx((_viewLonMin + _viewLonMax) / 2),
      cy: gyToPy((_viewLatMin + _viewLatMax) / 2),
    };
  }

  // ── Play area boundary in Canvas pixels ──────────────────────────
  function getWorldBorderPx() {
    return {
      x: gxToPx(-WORLD_LIMIT),
      y: gyToPy(-WORLD_LIMIT),
      w: WORLD_LIMIT * 2 * PX_PER_UNIT,
      h: WORLD_LIMIT * 2 * PX_PER_UNIT,
    };
  }

  function distPx(ax, ay, bx, by) { return Math.hypot(ax - bx, ay - by); }

  function init() {
    const zones = window.TLC_ZONES;
    if (zones && zones[0]) setZone(zones[0]);
  }

  return {
    MAP_W, MAP_H, PX_PER_UNIT, ORIGIN_PX, WORLD_LIMIT,
    setZone, init,
    getZoneRect, getZoneCenter, getWorldBorderPx,
    gxToPx, gyToPy, pxToGx, pyToGy,
    screenToCanvas, distPx,
  };
})();

window.TLC_COORDS = TLC_COORDS;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => TLC_COORDS.init());
} else {
  TLC_COORDS.init();
}
