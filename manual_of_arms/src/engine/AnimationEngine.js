/**
 * AnimationEngine
 *
 * Core state machine managing keyframe playback.
 * Pure JS class — no React dependency.
 * Consumed via the useAnimationEngine hook.
 */
export class AnimationEngine {
  constructor({ keyframes, onKeyframeChange, speed = 1 }) {
    this.keyframes = keyframes;
    this.currentIndex = 0;
    this.speed = speed;
    this.isPlaying = false;
    this._timer = null;
    this.onKeyframeChange = onKeyframeChange ?? (() => {});
  }

  get currentKeyframe() {
    return this.keyframes[this.currentIndex];
  }

  get totalKeyframes() {
    return this.keyframes.length;
  }

  setKeyframes(keyframes) {
    this.stop();
    this.keyframes = keyframes;
    this.currentIndex = 0;
    this.onKeyframeChange(this.currentKeyframe, this.currentIndex, false);
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentIndex >= this.keyframes.length - 1) {
      // At end: restart
      this.currentIndex = 0;
      this.onKeyframeChange(this.currentKeyframe, this.currentIndex, false);
    }
    this.isPlaying = true;
    this._scheduleNext();
  }

  pause() {
    this.isPlaying = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  stop() {
    this.pause();
    this.isPlaying = false;
  }

  stepForward() {
    this.pause();
    if (this.currentIndex < this.keyframes.length - 1) {
      this.currentIndex++;
      this.onKeyframeChange(this.currentKeyframe, this.currentIndex, true);
    }
  }

  stepBack() {
    this.pause();
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.onKeyframeChange(this.currentKeyframe, this.currentIndex, true);
    }
  }

  seekTo(index) {
    this.pause();
    const clampedIndex = Math.max(0, Math.min(index, this.keyframes.length - 1));
    this.currentIndex = clampedIndex;
    this.onKeyframeChange(this.currentKeyframe, this.currentIndex, true);
  }

  _scheduleNext() {
    if (!this.isPlaying) return;
    const kf = this.keyframes[this.currentIndex];
    const duration = Math.max(0, (kf.duration ?? 0) / this.speed);

    this._timer = setTimeout(() => {
      if (!this.isPlaying) return;
      if (this.currentIndex < this.keyframes.length - 1) {
        this.currentIndex++;
        this.onKeyframeChange(this.currentKeyframe, this.currentIndex, false);
        this._scheduleNext();
      } else {
        this.isPlaying = false;
      }
    }, duration);
  }

  destroy() {
    this.stop();
  }
}
