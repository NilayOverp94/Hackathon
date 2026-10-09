/**
 * ui_controller.js - Clean Canvas HUD Rendering and Video Overlays
 */

export class UIController {
  constructor({ canvasElement, videoElement }) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.video = videoElement;

    // HUD Display states
    this.currentGesture = null;
    this.holdProgress = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();
    this.inferenceTimeMs = 0;

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
   * Render clean HUD elements over camera feed
   */
  renderFrame(results) {
    const { width, height } = this.canvas;
    const ctx = this.ctx;

    // Clear overlay canvas
    ctx.clearRect(0, 0, width, height);

    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      this.drawScanningOverlay(width, height);
      return;
    }

    // Process each detected hand
    for (let h = 0; h < results.multiHandLandmarks.length; h++) {
      const landmarks = results.multiHandLandmarks[h];
      const handedness = results.multiHandedness && results.multiHandedness[h]
        ? results.multiHandedness[h].label
        : 'Right';

      // Draw clean skeleton lines
      if (this.showSkeleton) {
        this.drawHandSkeleton(landmarks, width, height);
      }

      // Draw clean landmark dots
      if (this.showLandmarkDots) {
        this.drawLandmarkDots(landmarks, width, height);
      }

      // Draw bounding box and sign badge
      if (this.showBoundingBox) {
        this.drawHandHUD(landmarks, handedness, width, height);
      }
    }

    // Draw Performance Metrics in top-left
    this.drawMetricsHUD(width, height);
  }

  /**
   * Clean solid line hand skeleton connections
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
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#38bdf8';

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
   * Clean landmark joint dots
   */
  drawLandmarkDots(landmarks, w, h) {
    const ctx = this.ctx;
    ctx.save();

    for (let i = 0; i < landmarks.length; i++) {
      const p = landmarks[i];
      const x = p.x * w;
      const y = p.y * h;

      ctx.beginPath();
      const isTip = [4, 8, 12, 16, 20].includes(i);
      ctx.fillStyle = isTip ? '#22c55e' : '#60a5fa';

      ctx.arc(x, y, isTip ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /**
   * Clean bounding box and sign badge
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

    const pad = 0.04;
    const bx = Math.max(0, (minX - pad) * w);
    const by = Math.max(0, (minY - pad) * h);
    const bw = Math.min(w - bx, (maxX - minX + pad * 2) * w);
    const bh = Math.min(h - by, (maxY - minY + pad * 2) * h);

    ctx.save();

    // Corner brackets
    ctx.strokeStyle = this.holdProgress >= 0.95 ? '#22c55e' : '#38bdf8';
    ctx.lineWidth = 2;

    const cornerLen = Math.min(20, bw * 0.25);

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
      const badgeY = Math.max(35, by - 14);
      const badgeX = bx + bw / 2;

      const labelText = this.currentGesture.text;
      const confText = `${Math.round(this.currentGesture.confidence * 100)}%`;

      ctx.font = '600 14px Inter, sans-serif';
      const textWidth = ctx.measureText(`${labelText} · ${confText}`).width;
      const badgeW = textWidth + 34;
      const badgeH = 28;

      const rx = badgeX - badgeW / 2;
      const ry = badgeY - badgeH / 2;

      // Solid background
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = this.holdProgress >= 0.95 ? '#22c55e' : '#334155';
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.rect(rx, ry, badgeW, badgeH);
      ctx.fill();
      ctx.stroke();

      // Circular hold indicator
      const circleX = rx + 14;
      const circleY = ry + badgeH / 2;
      ctx.beginPath();
      ctx.arc(circleX, circleY, 5, 0, Math.PI * 2);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (this.holdProgress > 0) {
        ctx.beginPath();
        ctx.arc(circleX, circleY, 5, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * this.holdProgress);
        ctx.strokeStyle = this.holdProgress >= 0.95 ? '#22c55e' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Badge text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, rx + 26, ry + 19);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText(confText, rx + 26 + ctx.measureText(labelText).width + 6, ry + 19);
    }

    ctx.restore();
  }

  /**
   * Top-left real-time performance indicator
   */
  drawMetricsHUD(w, h) {
    const ctx = this.ctx;
    ctx.save();

    const pillX = 14;
    const pillY = 14;
    const pillW = 160;
    const pillH = 28;

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.rect(pillX, pillY, pillW, pillH);
    ctx.fill();
    ctx.stroke();

    // Status Dot
    ctx.beginPath();
    ctx.arc(pillX + 12, pillY + pillH / 2, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e';
    ctx.fill();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 11px JetBrains Mono, monospace';
    ctx.fillText(`${this.fps} FPS`, pillX + 26, pillY + 18);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`${this.inferenceTimeMs}ms`, pillX + 90, pillY + 18);

    ctx.restore();
  }

  /**
   * Idle prompt when no hand is present
   */
  drawScanningOverlay(w, h) {
    const ctx = this.ctx;
    ctx.save();

    this.drawMetricsHUD(w, h);

    ctx.fillStyle = '#64748b';
    ctx.font = '500 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Raise hand to camera to begin signing', w / 2, h / 2);

    ctx.restore();
  }
}
