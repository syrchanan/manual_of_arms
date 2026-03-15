import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { AnimationEngine } from '../engine/AnimationEngine.js';
import { initSoldiers, updateSoldiers, updateLabels } from '../engine/SoldierRenderer.js';
import { renderGrid, renderAnnotations } from '../engine/AnnotationRenderer.js';
import { DEFAULT_COMPANY } from '../data/company.js';

/**
 * useAnimationEngine
 *
 * Bridges React state with the D3/AnimationEngine.
 *
 * @param {React.RefObject} svgRef - Ref to the <svg> element
 * @param {Object|null} drillData - The drill module (from DRILL_REGISTRY)
 * @param {Object} opts - { speed, showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion, subMovement }
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
  } = opts;

  const engineRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [keyframes, setKeyframes] = useState([]);
  const initialized = useRef(false);

  // Initialize SVG structure once
  useEffect(() => {
    if (!svgRef.current || initialized.current) return;
    const svg = d3.select(svgRef.current);

    // Ensure defs for markers
    if (svg.select('defs').empty()) svg.append('defs');

    // Layers (back to front)
    if (svg.select('.grid').empty()) svg.append('g').attr('class', 'grid');
    if (svg.select('.annotations').empty()) svg.append('g').attr('class', 'annotations');
    if (svg.select('.soldiers').empty()) svg.append('g').attr('class', 'soldiers');
    if (svg.select('.labels').empty()) svg.append('g').attr('class', 'labels');

    // Initialize soldiers (static enter)
    initSoldiers(svg.select('.soldiers').node(), DEFAULT_COMPANY);
    initialized.current = true;
  }, [svgRef]);

  // When drillData or subMovement changes, rebuild keyframes and reset engine
  useEffect(() => {
    if (!drillData) return;

    let kfs;
    try {
      kfs = drillData.buildKeyframes(DEFAULT_COMPANY, subMovement);
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
        applyKeyframe(svgRef.current, kf, stepped ? 200 : kf.duration / speed, opts);
      },
    });
    engineRef.current = engine;

    // Render initial keyframe immediately
    if (kfs.length > 0) {
      applyKeyframe(svgRef.current, kfs[0], 0, opts);
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
      showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion, speed,
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
  const { showLabels, showGrid, showFileClosers, showAnnotations, reducedMotion } = opts;

  const svg = d3.select(svgEl);

  // Grid
  renderGrid(svg.select('.grid').node(), showGrid);

  // Soldiers
  const actualDuration = reducedMotion ? 0 : duration;
  updateSoldiers(
    svg.select('.soldiers').node(),
    DEFAULT_COMPANY,
    keyframe.positions ?? [],
    actualDuration,
    { showFileClosers, reducedMotion }
  );

  // Labels
  updateLabels(
    svg.select('.labels').node(),
    DEFAULT_COMPANY,
    keyframe.positions ?? [],
    showLabels
  );

  // Annotations
  renderAnnotations(
    svg.select('.annotations').node(),
    keyframe.annotations ?? [],
    keyframe.positions ?? [],
    showAnnotations
  );
}
