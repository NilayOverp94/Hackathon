/**
 * ui_controller.js - HUD Canvas Rendering, Video Overlays & Interactive UI
 */

export class UIController {
  constructor({ canvasElement, videoElement, onSignPracticed = null }) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.video = videoElement;
    this.onSignPracticed = onSignPracticed;

    // HUD Display states
    this.currentGesture = null;
    this.holdProgress = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.inferenceTimeMs = 0;

    // Practice Mode State
    this.practiceMode = false;
    this.targetPracticeSign = null;
    this.practiceStreak = 0;

    // Drawing options
    this.showSkeleton = true;
    this.showBoundingBox = true;
    this.showLandmarkDots = true;
  }

  setHoldProgress(progress, gesture) {
    this.holdProgress = progress;
    this.currentGesture = gesture;
  }

  updateMetrics(inferenceTimeMs) {
    this.inferenceTimeMs = Math.round(inferenceTimeMs);
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;
    }
  }

  /**
   * Render HUD elements over camera feed
   */
  renderFrame(results) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear overlay canvas
    ctx.clearRect(0, 0, width, height);

    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      // Draw idle scanning reticle
      this.drawScanningOverlay(width, height);
      return;
    }

    // Process each detected hand
    for (let h = 0; h < results.multiHandLandmarks.length; h++) {
      const landmarks = results.multiHandLandmarks[h];
      const handedness = results.multiHandedness && results.multiHandedness[h]
        ? results.multiHandedness[h].label
        : 'Right';

      // Draw skeleton connections
      if (this.showSkeleton) {
        this.drawHandSkeleton(landmarks, width, height);
      }

      // Draw landmark dots
      if (this.showLandmarkDots) {
        this.drawLandmarkDots(landmarks, width, height);
      }

      // Draw bounding box and floating sign badge
      if (this.showBoundingBox) {
        this.drawHandHUD(landmarks, handedness, width, height);
      }
    }

    // Draw Performance Metrics in top-left
    this.drawMetricsHUD(width, height);
  }

  /**
   * Futuristic cyber hand skeleton connections
   */
  drawHandSkeleton(landmarks, w, h) {
    const ctx = this.ctx;

    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8],       // Index
      [5, 9], [9, 10], [10, 11], [11, 12],  // Middle
      [9, 13], [13, 14], [14, 15], [15, 16],// Ring
      [13, 17], [17, 18], [18, 19], [19, 20],// Pinky
      [0, 17]                               // Palm base
    ];

    ctx.save();
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Glowing cyan line
    ctx.strokeStyle = '#00f2fe';
    ctx.shadowColor = '#00f2fe';
    ctx.shadowBlur = 10;

    for (const [i, j] of connections) {
      const p1 = landmarks[i];
      const p2 = landmarks[j];

      ctx.beginPath();
      ctx.moveTo(p1.x * w, p1.y * h);
      ctx.lineTo(p2.x * w, p2.y * h);
      ctx.stroke();
    }

    ctx.restore();
  }

  /**
   * Landmark joint dots with neon glow
   */
  drawLandmarkDots(landmarks, w, h) {
    const ctx = this.ctx;
    ctx.save();

    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const x = p.x * w;
      const y = p.y * h;

      ctx.beginPath();
      // Fingertips have distinctive emerald pulse, other joints are violet/cyan
      const isTip = [4, 8, 12, 16, 20].includes(i);
      ctx.fillStyle = isTip ? '#10b981' : '#a855f7';
      ctx.shadowColor = isTip ? '#10b981' : '#a855f7';
      ctx.shadowBlur = isTip ? 12 : 6;

      ctx.arc(x, y, isTip ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Bounding box, targeting brackets, and floating HUD label
   */
  drawHandHUD(landmarks, handedness, w, h) {
    const ctx = this.ctx;

    let minX = 1, minY = 1, maxX = 0, maxY = 0;
    for (const p of landmarks) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }

    // Add padding
    const pad = 0.04;
    const bx = Math.max(0, (minX - pad) * w);
    const by = Math.max(0, (minY - pad) * h);
    const bw = Math.min(w - bx, (maxX - minX + pad * 2) * w);
    const bh = Math.min(h - by, (maxY - minY + pad * 2) * h);

    ctx.save();

    // Corner brackets styling
    ctx.strokeStyle = this.holdProgress >= 0.95 ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;

    const cornerLen = Math.min(24, bw * 0.25);

    // Top-left
    ctx.beginPath();
    ctx.moveTo(bx, by + cornerLen);
    ctx.lineTo(bx, by);
    ctx.lineTo(bx + cornerLen, by);
    ctx.stroke();

    // Top-right
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by);
    ctx.lineTo(bx + bw, by);
    ctx.lineTo(bx + bw, by + cornerLen);
    ctx.stroke();

    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(bx, by + bh - cornerLen);
    ctx.lineTo(bx, by + bh);
    ctx.lineTo(bx + cornerLen, by + bh);
    ctx.stroke();

    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(bx + bw - cornerLen, by + bh);
    ctx.lineTo(bx + bw, by + bh);
    ctx.lineTo(bx + bw, by + bh - cornerLen);
    ctx.stroke();

    // Floating Badge above hand
    if (this.currentGesture) {
      const badgeY = Math.max(40, by - 16);
      const badgeX = bx + bw / 2;

      const labelText = this.currentGesture.text;
      const confText = `${Math.round(this.currentGesture.confidence * 100)}%`;

      ctx.font = 'bold 15px Outfit, Inter, sans-serif';
      const textWidth = ctx.measureText(`${labelText} · ${confText}`).width;
      const badgeW = textWidth + 36;
      const badgeH = 32;

      // Badge Background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = this.holdProgress >= 0.95 ? '#10b981' : 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 1.5;

      const rx = badgeX - badgeW / 2;
      const ry = badgeY - badgeH / 2;
      ctx.beginPath();
      ctx.roundRect(rx, ry, badgeW, badgeH, 16);
      ctx.fill();
      ctx.stroke();

      // Circular hold-lock progress indicator
      const circleX = rx + 16;
      const circleY = ry + badgeH / 2;
      ctx.beginPath();
      ctx.arc(circleX, circleY, 7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      if (this.holdProgress > 0) {
        ctx.beginPath();
        ctx.arc(circleX, circleY, 7, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * this.holdProgress);
        ctx.strokeStyle = this.holdProgress >= 0.95 ? '#10b981' : '#00f2fe';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, rx + 30, ry + 21);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(confText, rx + 30 + ctx.measureText(labelText).width + 6, ry + 21);

      // Check practice mode match
      if (this.practiceMode && this.targetPracticeSign && labelText === this.targetPracticeSign && this.holdProgress >= 0.95) {
        if (this.onSignPracticed) {
          this.onSignPracticed(labelText);
        }
      }
    }

    ctx.restore();
  }

  /**
   * Top-left real-time performance HUD
   */
  drawMetricsHUD(w, h) {
    const ctx = this.ctx;
    ctx.save();

    const pillX = 18;
    const pillY = 18;
    const pillW = 200;
    const pillH = 34;

    ctx.fillStyle = 'rgba(10, 15, 30, 0.75)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 8);
    ctx.fill();
    ctx.stroke();

    // Live Indicator Dot
    ctx.beginPath();
    ctx.arc(pillX + 16, pillY + pillH / 2, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px JetBrains Mono, monospace';
    ctx.fillText('LIVE', pillX + 27, pillY + 21);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(`${this.fps} FPS`, pillX + 70, pillY + 21);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`${this.inferenceTimeMs}ms`, pillX + 135, pillY + 21);

    ctx.restore();
  }

  /**
   * Idle scanning animation when no hand is present
   */
  drawScanningOverlay(w, h) {
    const ctx = this.ctx;
    ctx.save();

    this.drawMetricsHUD(w, h);

    // Subtle center prompt
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '500 14px Outfit, Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Raise hand to camera to begin signing', w / 2, h / 2);

    ctx.restore();
  }
}
