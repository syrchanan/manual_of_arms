import { COLORS } from '../../data/constants.js';

const ITEMS = [
  { label: 'Front rank',  color: COLORS.RANK_FRONT },
  { label: 'Rear rank',   color: COLORS.RANK_REAR  },
  { label: 'Officers',    color: COLORS.OFFICER    },
  { label: 'NCOs',        color: COLORS.NCO        },
];

export default function Legend() {
  return (
    <div className="legend" aria-label="Soldier color legend">
      {ITEMS.map(({ label, color }) => (
        <span key={label} className="legend__item">
          <span
            className="legend__swatch"
            style={{ background: color }}
            aria-hidden="true"
          />
          {label}
        </span>
      ))}
    </div>
  );
}
