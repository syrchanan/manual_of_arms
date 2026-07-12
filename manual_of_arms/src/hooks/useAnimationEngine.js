import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { AnimationEngine } from '../engine/AnimationEngine.js';
import { initSoldiers, updateSoldiers, updateLabels } from '../engine/SoldierRenderer.js';
import { initCompanyBlocks, updateCompanyBlocks } from '../engine/BattalionRenderer.js';
import { renderGrid, renderAnnotations } from '../engine/AnnotationRenderer.js';
import { DEFAULT_COMPANY } from '../data/company.js';
import { SCALE } from '../data/constants.js';

/**
 * useAnimationEngine
 *
 * Bridges React state with the D3/AnimationEngine.
 *
 * @param {React.RefObject} svgRef - Ref to the <svg> element
 * @param {Object|null} drillData - The drill module (from DRILL_REGISTRY)
 * @param {Object} opts - { speed, showLabels, showGrid, showFileClosers,
 *   showAnnotations, reducedMotion, subMovement, roster, renderMode }
 *   roster: soldier array (company drills) or company array (battalion
 *   drills), passed through to drillData.buildKeyframes(roster, subMovement)
 *   and to the renderer. renderMode: 'company' (default, per-soldier
 *   rendering via SoldierRenderer) or 'battalion' (company-block rendering
 *   via BattalionRenderer).
 */
export function useAnimationEngine(svgRef, drillData, opts = {}) {
  const {
    speed = 1,
    showLabels = false,
    showGrid = false,
    showFileClosers = true,
    showAnnotations = true,
    reducedMotion = false,
    subMovement = null,
    roster = DEFAULT_COMPANY,
    renderMode = 'company',
  } = opts;

  const engineRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [keyframes, setKeyframes] = useState([]);
  const initialized = useRef(false);
  // Which renderMode the .soldiers group currently holds elements for. This
  // SPA is a HashRouter: navigating between a Company drill and a Battalion
  // drill only changes the URL fragment, so React Router does not remount
  // DrillPage/this hook -- without tracking renderMode here, the one-time
  // init below would never re-run when switching schools, leaving stale
  // per-soldier <rect> elements (or company-block groups) from whichever
  // school's page loaded first in the tab.
  const initializedRenderMode = useRef(null);

  // Live options for callbacks that outlive this render (the engine's
  // onKeyframeChange fires from timers created when the drill loaded; reading
  // opts from the closure there would use stale speed/toggle values).
  const optsRef = useRef(null);
  optsRef.current = {
    speed, showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion, roster, renderMode,
  };

  // Initialize SVG structure once per mount, and again whenever renderMode
  // changes (company <-> battalion) within the same mount.
  useEffect(() => {
    if (!svgRef.current) return;
    if (initialized.current && initializedRenderMode.current === renderMode) return;
    const svg = d3.select(svgRef.current);

    // Ensure defs for markers
    if (svg.select('defs').empty()) svg.append('defs');

    // Layers (back to front)
    if (svg.select('.grid').empty()) svg.append('g').attr('class', 'grid');
    if (svg.select('.annotations').empty()) svg.append('g').attr('class', 'annotations');
    if (svg.select('.soldiers').empty()) svg.append('g').attr('class', 'soldiers');
    if (svg.select('.labels').empty()) svg.append('g').attr('class', 'labels');

    // Switching renderMode: the existing elements belong to the other mode
    // (individual soldier rects vs. company-block groups) and must be
    // cleared before the other initializer's enter-selection runs, or its
    // data join will try to reconcile against elements it doesn't own.
    if (initializedRenderMode.current !== null && initializedRenderMode.current !== renderMode) {
      svg.select('.soldiers').selectAll('*').remove();
      svg.select('.labels').selectAll('*').remove();
    }

    // Initialize soldiers/company-blocks (static enter)
    if (renderMode === 'battalion') {
      initCompanyBlocks(svg.select('.soldiers').node(), roster);
    } else {
      initSoldiers(svg.select('.soldiers').node(), roster);
    }
    initialized.current = true;
    initializedRenderMode.current = renderMode;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [svgRef, renderMode]);

  // When drillData or subMovement changes, rebuild keyframes and reset engine
  useEffect(() => {
    if (!drillData) return;

    let kfs;
    try {
      kfs = drillData.buildKeyframes(roster, subMovement);
    } catch (e) {
      console.error('Error building keyframes:', e);
      return;
    }

    setKeyframes(kfs);
    setCurrentIndex(0);
    setIsPlaying(false);

    if (engineRef.current) {
      engineRef.current.destroy();
    }

    const engine = new AnimationEngine({
      keyframes: kfs,
      speed,
      onKeyframeChange: (kf, idx, stepped) => {
        setCurrentIndex(idx);
        const live = optsRef.current;
        applyKeyframe(svgRef.current, kf, stepped ? 200 : kf.duration / live.speed, live);
      },
    });
    engineRef.current = engine;

    // Render initial keyframe immediately
    if (kfs.length > 0) {
      applyKeyframe(svgRef.current, kfs[0], 0, optsRef.current);
    }

    return () => engine.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drillData, subMovement]);

  // Sync speed
  useEffect(() => {
    engineRef.current?.setSpeed(speed);
  }, [speed]);

  // Re-render current keyframe when toggles change
  useEffect(() => {
    if (!svgRef.current || !keyframes[currentIndex]) return;
    applyKeyframe(svgRef.current, keyframes[currentIndex], 0, {
      showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion, speed, roster, renderMode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion]);

  const play = useCallback(() => {
    engineRef.current?.play();
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    engineRef.current?.stepForward();
    setIsPlaying(false);
  }, []);

  const stepBack = useCallback(() => {
    engineRef.current?.stepBack();
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback((idx) => {
    engineRef.current?.seekTo(idx);
    setIsPlaying(false);
  }, []);

  return { play, pause, stepForward, stepBack, seekTo, currentIndex, isPlaying, keyframes };
}

// ---------------------------------------------------------------------------
// Internal: apply a keyframe to the SVG
// ---------------------------------------------------------------------------
function applyKeyframe(svgEl, keyframe, duration, opts = {}) {
  if (!svgEl || !keyframe) return;
  const {
    showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion,
    roster = DEFAULT_COMPANY, renderMode = 'company',
  } = opts;

  const svg = d3.select(svgEl);

  // Grid
  renderGrid(svg.select('.grid').node(), showGrid);

  const actualDuration = reducedMotion ? 0 : duration;
  const soldiersNode = svg.select('.soldiers').node();

  if (renderMode === 'battalion') {
    updateCompanyBlocks(soldiersNode, roster, keyframe.positions ?? [], actualDuration, { reducedMotion });
  } else {
    updateSoldiers(
      soldiersNode,
      roster,
      keyframe.positions ?? [],
      actualDuration,
      { showFileClosers, reducedMotion }
    );

    // Mark time (¶109): soldiers raise and lower each foot in place without
    // advancing. keyframe.positions doesn't change for this keyframe, so the
    // updateSoldiers() call above is a no-op transition; the visible "still
    // marching in place" cue is this subtle in-place bob layered on top.
    if (keyframe.specialEffect === 'markTime' && !reducedMotion) {
      startMarkTimeOscillation(soldiersNode, keyframe.positions ?? []);
    }

    // Labels (battalion block view draws its own company-number labels
    // internally; per-soldier role labels don't apply there)
    updateLabels(
      svg.select('.labels').node(),
      roster,
      keyframe.positions ?? [],
      showLabels
    );
  }

  // Annotations
  renderAnnotations(
    svg.select('.annotations').node(),
    keyframe.annotations ?? [],
    keyframe.positions ?? [],
    showAnnotations
  );
}

// ---------------------------------------------------------------------------
// Mark time: subtle in-place oscillation
// ---------------------------------------------------------------------------
const MARK_TIME_AMPLITUDE_PX = 1; // ±1px bob along each soldier's facing axis
const MARK_TIME_HALF_PERIOD_MS = 175; // 350ms full up-down period

// Reproduces SoldierRenderer.js's private soldierTransform() format exactly
// (translate to center-corrected position, then rotate about the soldier's
// own center) so a transform written by this loop parses cleanly if the
// next keyframe's attrTween reads it back via parseSoldierTransform(), and
// so mid-oscillation transforms are indistinguishable in shape from
// "normal" ones. SoldierRenderer.js doesn't export its helper, and it is
// out of scope for this fix, so the format is duplicated here deliberately.
function markTimeTransform(x, y, facing) {
  const { SOLDIER_W: w, SOLDIER_H: h } = SCALE;
  return `translate(${x - w / 2}, ${y - h / 2}) rotate(${facing}, ${w / 2}, ${h / 2})`;
}

/**
 * Start a looping ±1px bob, along each soldier's facing axis, on every
 * <g class="soldier"> element. Deliberately uses the SAME (default,
 * unnamed) transition channel that SoldierRenderer.js's updateSoldiers()
 * uses — d3 transitions sharing a name on the same element are mutually
 * exclusive, so the very next keyframe change (which calls updateSoldiers,
 * which calls sel.interrupt() for duration 0 or starts its own
 * sel.transition() otherwise) cleanly cancels this loop instead of racing
 * it. A cancelled transition fires 'interrupt', not 'end', so the
 * .on('end', ...) requeue below simply stops — no explicit teardown needed.
 */
function startMarkTimeOscillation(soldiersContainer, positions) {
  if (!soldiersContainer) return;
  const posMap = new Map(positions.map((p) => [p.id, p]));

  d3.select(soldiersContainer)
    .selectAll('.soldier')
    .each(function (d) {
      const pos = posMap.get(d.id);
      if (!pos) return;

      const rad = (pos.facing * Math.PI) / 180;
      const alongX = Math.sin(rad);
      const alongY = -Math.cos(rad);
      const sel = d3.select(this);

      const bob = (sign) => {
        sel
          .transition()
          .duration(MARK_TIME_HALF_PERIOD_MS)
          .ease(d3.easeSinInOut)
          .attr(
            'transform',
            markTimeTransform(
              pos.x + sign * MARK_TIME_AMPLITUDE_PX * alongX,
              pos.y + sign * MARK_TIME_AMPLITUDE_PX * alongY,
              pos.facing
            )
          )
          .on('end', () => bob(-sign));
      };
      bob(1);
    });
}
