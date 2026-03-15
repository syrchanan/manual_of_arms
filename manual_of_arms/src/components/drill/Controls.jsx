export default function Controls({
  isPlaying, play, pause, stepForward, stepBack,
  speed, setSpeed,
  currentIndex, keyframes, seekTo,
}) {
  const total = keyframes.length;
  const currentKf = keyframes[currentIndex];

  return (
    <div>
      {/* Keyframe label */}
      <div className="keyframe-label">
        {currentKf ? `${currentIndex + 1} / ${total} — ${currentKf.label}` : ''}
      </div>

      {/* Keyframe description */}
      {currentKf?.description && (
        <p className="keyframe-description">{currentKf.description}</p>
      )}

      {/* Control row */}
      <div className="controls" role="group" aria-label="Playback controls">
        {/* Step back */}
        <button
          className="ctrl-btn"
          onClick={stepBack}
          disabled={currentIndex === 0}
          aria-label="Previous keyframe"
          title="Previous (←)"
        >
          ◀◀
        </button>

        {/* Play / Pause */}
        <button
          className="ctrl-btn play-btn"
          onClick={isPlaying ? pause : play}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title="Play/Pause (Space)"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Step forward */}
        <button
          className="ctrl-btn"
          onClick={stepForward}
          disabled={currentIndex >= total - 1}
          aria-label="Next keyframe"
          title="Next (→)"
        >
          ▶▶
        </button>

        {/* Progress bar */}
        <ProgressBar
          currentIndex={currentIndex}
          total={total}
          keyframes={keyframes}
          seekTo={seekTo}
        />

        {/* Speed */}
        <div className="speed-controls" role="group" aria-label="Playback speed">
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              className={`speed-btn${speed === s ? ' active' : ''}`}
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              aria-label={`${s}× speed`}
            >
              {s}×
            </button>
          ))}
        </div>

        {/* Keyboard hint */}
        <span className="keyboard-hint" aria-hidden="true">
          <kbd>Space</kbd> play · <kbd>←→</kbd> step · <kbd>1–3</kbd> speed
        </span>
      </div>
    </div>
  );
}

function ProgressBar({ currentIndex, total, keyframes, seekTo }) {
  if (total <= 1) return null;
  const pct = total > 1 ? (currentIndex / (total - 1)) * 100 : 0;

  return (
    <div className="progress-bar" aria-label="Keyframe progress">
      <div
        className="progress-bar__track"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={total - 1}
        aria-valuenow={currentIndex}
        aria-valuetext={keyframes[currentIndex]?.label ?? ''}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const ratio = (e.clientX - rect.left) / rect.width;
          seekTo(Math.round(ratio * (total - 1)));
        }}
      >
        <div className="progress-bar__fill" style={{ width: `${pct}%` }} />
        <div className="progress-bar__steps">
          {keyframes.map((kf, i) => (
            <div key={i} className="progress-bar__step">
              <div
                className={`progress-bar__dot${i === currentIndex ? ' active' : i < currentIndex ? ' visited' : ''}`}
                onClick={(e) => { e.stopPropagation(); seekTo(i); }}
                title={kf.label}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && seekTo(i)}
                aria-label={`Go to keyframe: ${kf.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
