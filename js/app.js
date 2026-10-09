/**
 * app.js - Application Orchestrator for Real-Time ASL to Text & Voice
 */

import { GestureEngine } from './gesture_engine.js';
import { SentenceBuilder } from './sentence_builder.js';
import { SpeechEngine } from './speech_engine.js';
import { UIController } from './ui_controller.js';
import { ASL_SIGNS } from './asl_dictionary.js';

class SignApp {
  constructor() {
    this.videoElement = document.getElementById('webcam');
    this.canvasElement = document.getElementById('hudCanvas');

    // UI Elements
    this.captionText = document.getElementById('captionText');
    this.lastDetectedBadge = document.getElementById('lastDetectedBadge');
    this.historyList = document.getElementById('historyList');
    this.statusBadge = document.getElementById('systemStatusBadge');

    // Controls
    this.btnSpeak = document.getElementById('btnSpeak');
    this.btnClear = document.getElementById('btnClear');
    this.btnBackspace = document.getElementById('btnBackspace');
    this.btnMute = document.getElementById('btnMute');
    this.toggleAutoSpeak = document.getElementById('toggleAutoSpeak');
    this.voiceSelect = document.getElementById('voiceSelect');

    // Modals
    this.dictionaryModal = document.getElementById('dictionaryModal');
    this.btnDictionary = document.getElementById('btnDictionary');
    this.btnCloseDictionary = document.getElementById('btnCloseDictionary');
    this.dictionaryGrid = document.getElementById('dictionaryGrid');

    // State
    this.autoSpeak = true;
    this.cameraInstance = null;
    this.handsInstance = null;

    // Initialize Subsystems
    this.initEngines();
    this.bindEvents();
    this.renderDictionary();
  }

  initEngines() {
    // 1. Text to Speech
    this.speech = new SpeechEngine();
    setTimeout(() => this.populateVoiceList(), 500);

    // 2. Gesture Recognizer
    this.gestureEngine = new GestureEngine();

    // 3. Sentence Builder
    this.sentenceBuilder = new SentenceBuilder({
      holdThresholdMs: 400,
      onHoldProgress: (progress, gesture) => {
        this.ui.setHoldProgress(progress, gesture);
        if (gesture) {
          this.lastDetectedBadge.textContent = `${gesture.text} (${Math.round(gesture.confidence * 100)}%)`;
          this.lastDetectedBadge.classList.add('visible');
        } else {
          this.lastDetectedBadge.classList.remove('visible');
        }
      },
      onTokenCommitted: (token, formattedSentence, gesture) => {
        this.speech.playLockTone();
        this.updateCaptionUI(formattedSentence);

        if (this.autoSpeak && gesture.category === 'conversational') {
          const phrase = this.sentenceBuilder.formatNaturalGrammar(token);
          this.speech.speak(phrase);
        }
      }
    });

    // 4. UI & Canvas HUD Controller
    this.ui = new UIController({
      canvasElement: this.canvasElement,
      videoElement: this.videoElement
    });
  }

  bindEvents() {
    // Speak Button
    this.btnSpeak?.addEventListener('click', () => {
      const sentence = this.sentenceBuilder.getFormattedSentence();
      if (sentence) {
        this.speech.speak(sentence, { force: true });
        this.sentenceBuilder.finishSentence();
        this.updateCaptionUI('');
        this.updateHistoryUI();
      }
    });

    // Clear Button
    this.btnClear?.addEventListener('click', () => {
      this.sentenceBuilder.clear();
      this.updateCaptionUI('');
    });

    // Backspace Button
    this.btnBackspace?.addEventListener('click', () => {
      this.sentenceBuilder.backspace();
      this.updateCaptionUI(this.sentenceBuilder.getFormattedSentence());
    });

    // Mute/Unmute Toggle
    this.btnMute?.addEventListener('click', () => {
      const isMuted = this.speech.toggleMute();
      this.btnMute.classList.toggle('muted', isMuted);
      this.btnMute.textContent = isMuted ? '🔇 Voice Off' : '🔊 Voice On';
    });

    // Auto-Speak Toggle
    this.toggleAutoSpeak?.addEventListener('change', (e) => {
      this.autoSpeak = e.target.checked;
    });

    // Voice Selection
    this.voiceSelect?.addEventListener('change', (e) => {
      this.speech.setVoice(e.target.value);
    });

    // Dictionary Modal
    this.btnDictionary?.addEventListener('click', () => {
      this.dictionaryModal.classList.add('open');
    });

    this.btnCloseDictionary?.addEventListener('click', () => {
      this.dictionaryModal.classList.remove('open');
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.sentenceBuilder.addSpace();
        this.updateCaptionUI(this.sentenceBuilder.getFormattedSentence());
      } else if (e.code === 'Backspace') {
        this.sentenceBuilder.backspace();
        this.updateCaptionUI(this.sentenceBuilder.getFormattedSentence());
      } else if (e.code === 'Enter') {
        this.btnSpeak?.click();
      }
    });
  }

  populateVoiceList() {
    const voices = this.speech.getAvailableVoices();
    if (!this.voiceSelect || voices.length === 0) return;

    this.voiceSelect.innerHTML = '';
    voices.forEach((v) => {
      const option = document.createElement('option');
      option.value = v.voiceURI;
      option.textContent = `${v.name} (${v.lang})`;
      if (this.speech.selectedVoice && this.speech.selectedVoice.voiceURI === v.voiceURI) {
        option.selected = true;
      }
      this.voiceSelect.appendChild(option);
    });
  }

  updateCaptionUI(text) {
    if (!this.captionText) return;
    if (!text || text.trim() === '') {
      this.captionText.innerHTML = '<span class="placeholder-caption">Show a hand gesture to begin...</span>';
    } else {
      this.captionText.textContent = text;
    }
  }

  updateHistoryUI() {
    if (!this.historyList) return;
    const history = this.sentenceBuilder.getHistory();
    this.historyList.innerHTML = '';

    if (history.length === 0) {
      this.historyList.innerHTML = '<div class="empty-state">Spoken sentences will be saved here.</div>';
      return;
    }

    history.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'history-item';
      el.innerHTML = `
        <div class="history-content">
          <p class="history-text">"${item.text}"</p>
          <span class="history-time">${item.timestamp}</span>
        </div>
        <button class="btn-replay" title="Replay">🔊</button>
      `;
      el.querySelector('.btn-replay').addEventListener('click', () => {
        this.speech.speak(item.text, { force: true });
      });
      this.historyList.appendChild(el);
    });
  }

  renderDictionary() {
    if (!this.dictionaryGrid) return;
    this.dictionaryGrid.innerHTML = '';

    ASL_SIGNS.forEach((sign) => {
      const card = document.createElement('div');
      card.className = 'dict-card';
      card.innerHTML = `
        <div class="dict-card-header">
          <span class="dict-icon">${sign.icon}</span>
          <span class="dict-badge badge-${sign.category.toLowerCase()}">${sign.badge}</span>
        </div>
        <h4 class="dict-name">${sign.name}</h4>
        <p class="dict-desc">${sign.description}</p>
        <div class="dict-tips">${sign.tips}</div>
      `;
      this.dictionaryGrid.appendChild(card);
    });
  }

  /**
   * Start MediaPipe Hands and Camera
   */
  async start() {
    try {
      if (this.statusBadge) {
        this.statusBadge.textContent = 'Initializing Camera & Model...';
        this.statusBadge.className = 'status-badge status-loading';
      }

      if (typeof window.Hands === 'undefined') {
        throw new Error('MediaPipe Hands library not loaded from CDN.');
      }

      this.handsInstance = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
      });

      this.handsInstance.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.65
      });

      this.handsInstance.onResults((results) => {
        const t0 = performance.now();

        const gesture = this.gestureEngine.classify(results);
        this.sentenceBuilder.processDetection(gesture);
        this.ui.renderFrame(results);

        const t1 = performance.now();
        this.ui.updateMetrics(t1 - t0);
      });

      const updateCanvasSize = () => {
        const vw = this.videoElement.videoWidth || 640;
        const vh = this.videoElement.videoHeight || 480;
        this.canvasElement.width = vw;
        this.canvasElement.height = vh;
      };

      this.videoElement.addEventListener('loadedmetadata', updateCanvasSize);

      if (typeof window.Camera !== 'undefined') {
        this.cameraInstance = new window.Camera(this.videoElement, {
          onFrame: async () => {
            if (this.handsInstance) {
              await this.handsInstance.send({ image: this.videoElement });
            }
          },
          width: 1280,
          height: 720
        });

        await this.cameraInstance.start();
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
        });
        this.videoElement.srcObject = stream;
        await this.videoElement.play();

        const processVideoFrame = async () => {
          if (this.videoElement.readyState >= 2) {
            await this.handsInstance.send({ image: this.videoElement });
          }
          requestAnimationFrame(processVideoFrame);
        };
        requestAnimationFrame(processVideoFrame);
      }

      if (this.statusBadge) {
        this.statusBadge.textContent = 'Operational · 60 FPS';
        this.statusBadge.className = 'status-badge status-online';
      }
    } catch (err) {
      console.error('Failed to initialize webcam or MediaPipe:', err);
      if (this.statusBadge) {
        this.statusBadge.textContent = `Error: ${err.message || 'Camera permission required'}`;
        this.statusBadge.className = 'status-badge status-error';
      }
    }
  }
}

// Auto-launch when page DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const app = new SignApp();
  app.start();
  window.signApp = app;
});
