/**
 * BattalionRenderer
 *
 * D3-based renderer for battalion-scale "block" view: each company renders
 * as up to three bands (front rank, rear rank, file closers) rather than 47
 * individual soldier rects, so an 8-company battalion (376 soldiers) stays
 * legible. Consumes the exact same `{ id, x, y, facing }` position arrays
 * SoldierRenderer does — block geometry is an aggregation of the same
 * per-soldier data already proven correct at company scale, not a separate
 * approximation.
 *
 * Assumption: this mode is for formations where each company's soldiers
 * cluster into uniform-depth bands (line of battle, column of companies) —
 * i.e. all front-rank soldiers of a company sit at the same depth, etc. A
 * company mid-flank-march (files staggered by depth) should be rendered in
 * the existing per-soldier SoldierRenderer instead ("expand to files" mode);
 * this module does not attempt to represent staggered depths as one band.
 */
import * as d3 from 'd3';
import { COLORS, SCALE } from '../data/constants.js';

const { SOLDIER_W, SOLDIER_H, FILE_INTERVAL } = SCALE;
const BAND_THICKNESS = SOLDIER_H * 1.6; // a bit taller than one soldier, for visibility at block scale
const BAND_PAD = SOLDIER_W; // extra length beyond the outermost soldier's center, each side split in half below

const RANKS = ['front', 'rear', 'fileCloser'];

function bandColor(rank) {
  if (rank === 'front') return COLORS.RANK_FRONT;
  if (rank === 'rear') return COLORS.RANK_REAR;
  return COLORS.NCO; // file closers: distinguish from both rank bands
}

function bandOpacity(rank) {
  return rank === 'fileCloser' ? 0.55 : 1;
}

/** Unit vectors for a facing, matching formations.js's across/behind convention. */
function axes(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return {
    acrossX: Math.cos(rad),
    acrossY: Math.sin(rad),
    depthX: -Math.sin(rad),
    depthY: Math.cos(rad),
  };
}

function bandTransform(centerX, centerY, width, height, facingDeg) {
  return `translate(${centerX - width / 2}, ${centerY - height / 2}) rotate(${facingDeg}, ${width / 2}, ${height / 2})`;
}

/**
 * Initialize company-block group elements inside the SVG.
 * @param {SVGGElement} container - the <g class="companyBlocks"> element
 * @param {Array} companies - battalion roster (from data/battalion.js)
 */
export function initCompanyBlocks(container, companies) {
  const g = d3.select(container);

  g.selectAll('.company-block')
    .data(companies, (d) => d.index)
    .join((enter) =>
      enter
        .append('g')
        .attr('class', 'company-block')
        .attr('data-company', (d) => d.index)
        .call((sel) => {
          RANKS.forEach((rank) => {
            sel
              .append('rect')
              .attr('class', `band band-${rank}`)
              .attr('rx', 1)
              .attr('ry', 1)
              .attr('fill', bandColor(rank))
              .attr('fill-opacity', bandOpacity(rank))
              .attr('stroke', 'rgba(0,0,0,0.15)')
              .attr('stroke-width', 0.5);
          });
          sel
            .append('text')
            .attr('class', 'company-label')
            .attr('font-family', 'JetBrains Mono, monospace')
            .attr('font-size', 6)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('fill', '#fff')
            .attr('pointer-events', 'none');
        })
    );
}

/**
 * Group a company's positions into per-rank bands and compute each band's
 * absolute center, along-axis extent, and facing.
 */
function computeBands(companySoldiers, posMap, facing) {
  const { acrossX, acrossY, depthX, depthY } = axes(facing);
  const bands = {};

  RANKS.forEach((rank) => {
    const members = companySoldiers.filter((s) => s.rank === rank);
    const coords = members
      .map((s) => posMap.get(s.id))
      .filter(Boolean)
      .map((p) => ({
        across: p.x * acrossX + p.y * acrossY,
        depth: p.x * depthX + p.y * depthY,
      }));
    if (!coords.length) {
      bands[rank] = null;
      return;
    }
    const acrossVals = coords.map((c) => c.across);
    const minAcross = Math.min(...acrossVals);
    const maxAcross = Math.max(...acrossVals);
    const meanDepth = coords.reduce((sum, c) => sum + c.depth, 0) / coords.length;
    const meanAcross = (minAcross + maxAcross) / 2;
    const width = maxAcross - minAcross + BAND_PAD;

    bands[rank] = {
      centerX: meanDepth * depthX + meanAcross * acrossX,
      centerY: meanDepth * depthY + meanAcross * acrossY,
      width: Math.max(width, SOLDIER_W), // never narrower than one soldier (e.g. a single-file-closer band)
    };
  });

  return bands;
}

/**
 * Update company-block positions with D3 transitions.
 * @param {SVGGElement} container
 * @param {Array} companies - battalion roster
 * @param {Array} positions - [{ id, x, y, facing }, ...] for all soldiers
 * @param {number} duration - transition duration in ms
 * @param {Object} opts - { reducedMotion }
 */
export function updateCompanyBlocks(container, companies, positions, duration, opts = {}) {
  const { reducedMotion = false } = opts;
  const actualDuration = reducedMotion ? 0 : duration;

  const g = d3.select(container);
  const posMap = new Map(positions.map((p) => [p.id, p]));

  g.selectAll('.company-block').each(function (co) {
    const sel = d3.select(this);
    const companySoldiers = co.soldiers;
    // Facing is uniform across a company's soldiers in every formation this
    // renderer supports (see module doc); read it off any present member.
    const anyPos = companySoldiers.map((s) => posMap.get(s.id)).find(Boolean);
    if (!anyPos) return;
    const facing = anyPos.facing;

    const bands = computeBands(companySoldiers, posMap, facing);

    RANKS.forEach((rank) => {
      const band = bands[rank];
      const rect = sel.select(`.band-${rank}`);
      if (!band) {
        rect.attr('opacity', 0);
        return;
      }
      const transform = bandTransform(band.centerX, band.centerY, band.width, BAND_THICKNESS, facing);
      rect
        .attr('width', band.width)
        .attr('height', BAND_THICKNESS)
        .transition()
        .duration(actualDuration)
        .ease(d3.easeCubicInOut)
        .attr('transform', transform)
        .attr('opacity', 1);
    });

    // Label at the front-rank band's center, offset one file-interval toward
    // the depth axis so it doesn't sit on top of the front-rank band itself.
    const front = bands.front;
    if (front) {
      const { depthX, depthY } = axes(facing);
      const lx = front.centerX + depthX * FILE_INTERVAL;
      const ly = front.centerY + depthY * FILE_INTERVAL;
      sel
        .select('.company-label')
        .attr('x', lx)
        .attr('y', ly)
        .attr('fill', co.isColorCompany ? COLORS.COLORS_BEARER : '#fff')
        .text(co.index);
    }
  });
}
