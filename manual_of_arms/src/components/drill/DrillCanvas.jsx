import { CANVAS } from '../../data/constants.js';

/**
 * DrillCanvas
 *
 * Renders the SVG container. D3 binds to the <svg> via svgRef.
 * All SVG content is managed by D3 (SoldierRenderer, AnnotationRenderer).
 */
export default function DrillCanvas({ svgRef }) {
  return (
    <div className="canvas-container" role="img" aria-label="Drill animation canvas">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CANVAS.VIEW_W} ${CANVAS.VIEW_H}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Animated drill diagram"
      >
        <title>Casey&apos;s Drill Animation</title>
        <desc>Top-down animated diagram showing company drill movements per Casey&apos;s Infantry Tactics.</desc>
        {/* D3 will append layers: grid, annotations, soldiers, labels */}
      </svg>
    </div>
  );
}
