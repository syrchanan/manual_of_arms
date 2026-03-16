/**
 * AnnotationRenderer
 *
 * D3-based renderer for canvas overlays:
 * grid, guide lines, direction arrows, wheeling arcs, distance markers, etc.
 */
import * as d3 from 'd3';
import { COLORS, SCALE, CANVAS } from '../data/constants.js';

/**
 * Render the pace grid overlay.
 */
export function renderGrid(container, show) {
  const g = d3.select(container);
  g.selectAll('*').remove();
  if (!show) return;

  const spacing = SCALE.PACE_PX * 2; // grid every pace
  const { VIEW_W, VIEW_H } = CANVAS;

  for (let x = 0; x < VIEW_W; x += spacing) {
    g.append('line')
      .attr('x1', x).attr('y1', 0)
      .attr('x2', x).attr('y2', VIEW_H)
      .attr('stroke', COLORS.GRID)
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,4');
  }
  for (let y = 0; y < VIEW_H; y += spacing) {
    g.append('line')
      .attr('x1', 0).attr('y1', y)
      .attr('x2', VIEW_W).attr('y2', y)
      .attr('stroke', COLORS.GRID)
      .attr('stroke-width', 0.5)
      .attr('stroke-dasharray', '2,4');
  }

  // Scale bar at bottom-left
  const barX = 20;
  const barY = VIEW_H - 20;
  const paceLen = SCALE.PACE_PX * 2;
  g.append('line')
    .attr('x1', barX).attr('y1', barY)
    .attr('x2', barX + paceLen * 5).attr('y2', barY)
    .attr('stroke', COLORS.GRID).attr('stroke-width', 1.5);
  [0, 1, 2, 3, 4, 5].forEach((i) => {
    g.append('line')
      .attr('x1', barX + i * paceLen).attr('y1', barY - 3)
      .attr('x2', barX + i * paceLen).attr('y2', barY + 3)
      .attr('stroke', COLORS.GRID).attr('stroke-width', 1);
  });
  g.append('text')
    .attr('x', barX + paceLen * 2.5)
    .attr('y', barY + 10)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'JetBrains Mono, monospace')
    .attr('font-size', 7)
    .attr('fill', '#9CA3AF')
    .text('5 paces');
}

/**
 * Render annotation overlays for a specific keyframe.
 * @param {SVGGElement} container
 * @param {Array} annotationKeys - e.g. ['marchArrow', 'guideLineRight']
 * @param {Array} positions - current soldier positions
 * @param {boolean} show
 */
export function renderAnnotations(container, annotationKeys, positions, show) {
  const g = d3.select(container);
  g.selectAll('*').remove();
  if (!show || !annotationKeys?.length) return;

  const posMap = new Map(positions.map((p) => [p.id, p]));

  annotationKeys.forEach((entry) => {
    const type = typeof entry === 'string' ? entry : entry.type;
    const data = typeof entry === 'object' ? entry : {};
    switch (type) {
      case 'marchArrow':
        renderMarchArrow(g, positions);
        break;
      case 'guideLineRight':
      case 'guideRight':
        renderGuideLine(g, positions, 'right');
        break;
      case 'guideLeft':
        renderGuideLine(g, positions, 'left');
        break;
      case 'alignmentLine':
        renderAlignmentLine(g, positions);
        break;
      case 'obliqueAngle':
        renderObliqueAngle(g, positions);
        break;
      case 'wheelingPoint':
        renderWheelingPoint(g, positions, data);
        break;
      case 'wheelingArc':
        renderWheelingArc(g, positions, data);
        break;
      case 'fileNumbers':
        renderFileNumbers(g, positions);
        break;
      case 'guideShiftLabel':
        renderGuideShiftLabel(g, positions);
        break;
      case 'doublingHighlight':
        // Handled in SoldierRenderer via class; no-op here
        break;
      default:
        break;
    }
  });
}

function renderMarchArrow(g, positions) {
  if (!positions.length) return;
  const facing = positions[0]?.facing ?? 0;
  const rad = (facing * Math.PI) / 180;
  const sinR = Math.sin(rad);
  const cosR = Math.cos(rad);

  // Lateral centroid (perpendicular to march direction) for centering the arrow.
  const cx = d3.mean(positions, (d) => d.x);
  const cy = d3.mean(positions, (d) => d.y);

  // Find the lead edge: furthest position projected onto the march axis.
  // Project each point as (x·sinR - y·cosR); largest value = frontmost soldier.
  const leadProj = d3.max(positions, (d) => d.x * sinR - d.y * cosR);
  const centProj = cx * sinR - cy * cosR;

  // Arrow tail starts 10px past the lead edge, tip is 50px past.
  // This keeps the arrow clear of the formation and any file-number labels.
  const tail = leadProj + 10;
  const tip  = leadProj + 50;
  const x1 = cx + (tail - centProj) * sinR;
  const y1 = cy - (tail - centProj) * cosR;
  const x2 = cx + (tip  - centProj) * sinR;
  const y2 = cy - (tip  - centProj) * cosR;

  g.append('line')
    .attr('x1', x1).attr('y1', y1)
    .attr('x2', x2).attr('y2', y2)
    .attr('stroke', COLORS.ACCENT)
    .attr('stroke-width', 1.5)
    .attr('stroke-opacity', 0.4)
    .attr('marker-end', 'url(#arrowhead)');

  // Define arrowhead marker if not present
  const svg = g.node().closest('svg');
  if (svg && !svg.querySelector('#arrowhead')) {
    const defs = d3.select(svg).select('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('refX', 3)
      .attr('refY', 3)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,0 L0,6 L6,3 z')
      .attr('fill', COLORS.ACCENT)
      .attr('opacity', 0.4);
  }
}

function renderGuideLine(g, positions, side) {
  const guideId = side === 'right' ? 'nc-cov' : 'fc-2sg';
  const guide = positions.find((p) => p.id === guideId) ?? positions[0];
  if (!guide) return;

  const len = 120;
  const rad = (guide.facing * Math.PI) / 180;
  g.append('line')
    .attr('x1', guide.x)
    .attr('y1', guide.y)
    .attr('x2', guide.x + len * Math.sin(rad))
    .attr('y2', guide.y - len * Math.cos(rad))
    .attr('stroke', COLORS.ACCENT)
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '4,3')
    .attr('opacity', 0.5);

  g.append('text')
    .attr('x', guide.x + len * 0.5 * Math.sin(rad) + (side === 'right' ? 6 : -6))
    .attr('y', guide.y - len * 0.5 * Math.cos(rad))
    .attr('font-family', 'JetBrains Mono, monospace')
    .attr('font-size', 7)
    .attr('fill', COLORS.ACCENT)
    .attr('opacity', 0.7)
    .text(`Guide ${side}`);
}

function renderAlignmentLine(g, positions) {
  const front = positions.filter((p) => p.id.startsWith('fr-') || p.id === 'of-cpt');
  if (!front.length) return;
  const minX = d3.min(front, (d) => d.x) - 15;
  const maxX = d3.max(front, (d) => d.x) + 15;
  const y = d3.mean(front, (d) => d.y);

  g.append('line')
    .attr('x1', minX).attr('y1', y)
    .attr('x2', maxX).attr('y2', y)
    .attr('stroke', COLORS.ACCENT)
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '6,3')
    .attr('opacity', 0.5);
}

function renderObliqueAngle(g, positions) {
  const front = positions.filter((p) => p.id === 'of-cpt');
  if (!front.length) return;
  const { x, y } = front[0];
  const len = 50;

  // Show 45° angle lines
  g.append('line')
    .attr('x1', x).attr('y1', y)
    .attr('x2', x + len * Math.sin(Math.PI / 4))
    .attr('y2', y - len * Math.cos(Math.PI / 4))
    .attr('stroke', '#F59E0B')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3,2')
    .attr('opacity', 0.6);

  g.append('text')
    .attr('x', x + len * Math.sin(Math.PI / 4) + 4)
    .attr('y', y - len * Math.cos(Math.PI / 4))
    .attr('font-family', 'JetBrains Mono, monospace')
    .attr('font-size', 7)
    .attr('fill', '#F59E0B')
    .text('45°');
}

function renderWheelingPoint(g, positions, data = {}) {
  const pivot = data.pivotX != null
    ? { x: data.pivotX, y: data.pivotY }
    : positions.find((p) => p.id === 'nc-cov');
  if (!pivot) return;
  g.append('circle')
    .attr('cx', pivot.x)
    .attr('cy', pivot.y)
    .attr('r', 5)
    .attr('fill', 'none')
    .attr('stroke', '#EF4444')
    .attr('stroke-width', 1.5)
    .attr('opacity', 0.8);
  g.append('text')
    .attr('x', pivot.x + 8)
    .attr('y', pivot.y - 3)
    .attr('font-family', 'JetBrains Mono, monospace')
    .attr('font-size', 7)
    .attr('fill', '#EF4444')
    .text('Wheel pt.');
}

function renderWheelingArc(g, positions, data = {}) {
  // Use fixed pivot coords if supplied (preferred), otherwise fall back to nc-cov's
  // current position (which moves as the cascade progresses).
  const pivot = data.pivotX != null
    ? { x: data.pivotX, y: data.pivotY }
    : positions.find((p) => p.id === 'nc-cov');
  if (!pivot) return;

  // Radius: caller supplies radiusPx for the outermost soldier's sweep distance.
  // Default falls back to 3 FILE_INTERVALs (legacy column-of-files wheel).
  const r = data.radiusPx ?? 3 * SCALE.FILE_INTERVAL;

  // startAngle / endAngle: measured clockwise from top (12-o'clock = 0).
  // Caller must supply the correct quadrant for the wheel direction:
  //   Right wheel from facing=0 (north): marching flank sweeps west→north
  //     startAngle = -π/2 (west/9-o'clock), endAngle = 0 (north/12-o'clock)
  //   Left wheel from facing=90 (east): marching flank sweeps south→east
  //     startAngle = π/2 (east/3-o'clock), endAngle = π (south/6-o'clock)  ← legacy default
  const startAngle = data.startAngle ?? Math.PI / 2;
  const endAngle   = data.endAngle   ?? Math.PI;

  const arcGen = d3.arc()
    .innerRadius(r - 2)
    .outerRadius(r + 2)
    .startAngle(startAngle)
    .endAngle(endAngle);

  g.append('path')
    .attr('d', arcGen())
    .attr('transform', `translate(${pivot.x},${pivot.y})`)
    .attr('fill', '#F59E0B')
    .attr('opacity', 0.35);
}

function renderFileNumbers(g, positions) {
  const front = positions.filter((p) => p.id.startsWith('fr-'));
  front.forEach((p, i) => {
    g.append('text')
      .attr('x', p.x)
      .attr('y', p.y - 9)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', 6)
      .attr('fill', '#6B7280')
      .text(i + 1);
  });
}

function renderGuideShiftLabel(g) {
  g.append('text')
    .attr('x', 20)
    .attr('y', 40)
    .attr('font-family', 'Inter, sans-serif')
    .attr('font-size', 10)
    .attr('font-weight', 600)
    .attr('fill', '#EF4444')
    .text('⚠ Guide shifts to LEFT when faced about');
}
