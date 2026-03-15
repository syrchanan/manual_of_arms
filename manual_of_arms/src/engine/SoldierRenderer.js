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

      const transform = `translate(${pos.x - SOLDIER_W / 2}, ${pos.y - SOLDIER_H / 2}) rotate(${pos.facing}, ${SOLDIER_W / 2}, ${SOLDIER_H / 2})`;

      d3.select(this)
        .transition()
        .duration(actualDuration)
        .ease(d3.easeCubicInOut)
        .attr('transform', transform)
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
