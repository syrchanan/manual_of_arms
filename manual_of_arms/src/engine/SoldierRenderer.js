/**
 * SoldierRenderer
 *
 * D3-based renderer for the soldier rectangles.
 * Manages enter/update/exit data joins and transitions.
 */
import * as d3 from 'd3';
import { COLORS, SCALE } from '../data/constants.js';

const { SOLDIER_W, SOLDIER_H } = SCALE;

function soldierColor(soldier) {
  if (soldier.role === 'captain' || soldier.role === 'lieutenant') return COLORS.OFFICER;
  if (soldier.role === 'sergeant') return COLORS.NCO;
  if (soldier.rank === 'rear') return COLORS.RANK_REAR;
  return COLORS.RANK_FRONT;
}

/**
 * Initialize the soldier group inside the SVG.
 * @param {SVGGElement} container - The <g class="soldiers"> element
 * @param {Array} company - Static company roster data
 */
export function initSoldiers(container, company) {
  const g = d3.select(container);

  g.selectAll('.soldier')
    .data(company, (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('class', 'soldier')
          .attr('data-id', (d) => d.id)
          .call((g) => {
            // Main rectangle
            g.append('rect')
              .attr('class', 'soldier-body')
              .attr('width', SOLDIER_W)
              .attr('height', SOLDIER_H)
              .attr('rx', 1)
              .attr('ry', 1)
              .attr('fill', soldierColor)
              .attr('stroke', 'rgba(0,0,0,0.15)')
              .attr('stroke-width', 0.5);

            // Direction indicator: small notch on the "front" edge
            g.append('rect')
              .attr('class', 'soldier-front')
              .attr('width', SOLDIER_W * 0.4)
              .attr('height', 1.5)
              .attr('x', SOLDIER_W * 0.3)
              .attr('y', 0)
              .attr('fill', 'rgba(255,255,255,0.5)');
          })
    );
}

function soldierTransform(x, y, facing) {
  return `translate(${x - SOLDIER_W / 2}, ${y - SOLDIER_H / 2}) rotate(${facing}, ${SOLDIER_W / 2}, ${SOLDIER_H / 2})`;
}

const TRANSFORM_RE = /^translate\((-?[\d.]+),\s*(-?[\d.]+)\)\s*rotate\((-?[\d.]+)/;

// Recover { x, y, facing } from a transform string previously written by
// soldierTransform(), so tweens can start from the live rendered state even
// when a prior transition was interrupted mid-flight.
function parseSoldierTransform(str) {
  const m = TRANSFORM_RE.exec(str || '');
  if (!m) return null;
  return {
    x: parseFloat(m[1]) + SOLDIER_W / 2,
    y: parseFloat(m[2]) + SOLDIER_H / 2,
    facing: ((parseFloat(m[3]) % 360) + 360) % 360,
  };
}

/**
 * Update soldier positions with D3 transitions.
 * @param {SVGGElement} container
 * @param {Array} company - Static roster (for color/role lookups)
 * @param {Array} positions - [{ id, x, y, facing }, ...]
 * @param {number} duration - Transition duration in ms
 * @param {Object} opts - { showFileClosers, reducedMotion }
 */
export function updateSoldiers(container, company, positions, duration, opts = {}) {
  const { showFileClosers = true, reducedMotion = false } = opts;
  const actualDuration = reducedMotion ? 0 : duration;

  const g = d3.select(container);
  const posMap = new Map(positions.map((p) => [p.id, p]));

  g.selectAll('.soldier')
    .each(function (d) {
      const pos = posMap.get(d.id);
      if (!pos) return;

      const soldier = company.find((c) => c.id === d.id);
      const hidden = !showFileClosers && soldier?.rank === 'fileCloser';

      const target = soldierTransform(pos.x, pos.y, pos.facing);
      const sel = d3.select(this);

      if (actualDuration === 0) {
        sel.interrupt().attr('transform', target).attr('opacity', hidden ? 0 : 1);
        return;
      }

      sel
        .transition()
        .duration(actualDuration)
        .ease(d3.easeCubicInOut)
        .attrTween('transform', function () {
          const from = parseSoldierTransform(this.getAttribute('transform'));
          if (!from) return () => target;
          const ix = d3.interpolateNumber(from.x, pos.x);
          const iy = d3.interpolateNumber(from.y, pos.y);
          // Rotate the short way round: 350° -> 10° is +20°, not -340°.
          const targetFacing = ((pos.facing % 360) + 360) % 360;
          const delta = ((targetFacing - from.facing + 540) % 360) - 180;
          return (t) => soldierTransform(ix(t), iy(t), from.facing + delta * t);
        })
        .attr('opacity', hidden ? 0 : 1);
    });
}

/**
 * Update label visibility on soldiers.
 * @param {SVGGElement} labelsContainer
 * @param {Array} company
 * @param {Array} positions
 * @param {boolean} show
 */
export function updateLabels(labelsContainer, company, positions, show) {
  const g = d3.select(labelsContainer);
  const posMap = new Map(positions.map((p) => [p.id, p]));

  g.selectAll('.soldier-label')
    .data(company.filter((s) => s.role !== 'private'), (d) => d.id)
    .join(
      (enter) =>
        enter
          .append('text')
          .attr('class', 'soldier-label')
          .attr('font-family', 'JetBrains Mono, monospace')
          .attr('font-size', 5)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'central')
          .attr('fill', '#fff')
          .attr('pointer-events', 'none')
    )
    .each(function (d) {
      const pos = posMap.get(d.id);
      if (!pos) return;
      d3.select(this)
        .attr('x', pos.x)
        .attr('y', pos.y)
        .attr('opacity', show ? 1 : 0)
        .text(d.label ?? '');
    });
}
