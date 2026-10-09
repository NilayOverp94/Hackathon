/**
 * app.js - Main Application Orchestrator for Real-Time ASL to Text & Voice
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
    this.rawTokensBadge = document.getElementById('rawTokensBadge');
    this.lastDetectedBadge = document.getElementById('lastDetectedBadge');
    this.waveformEl = document.getElementById('audioWaveform');
    this.historyList = document.getElementById('historyList');
    this.statusBadge = document.getElementById('systemStatusBadge');

    // Controls
    this.btnSpeak = document.getElementById('btnSpeak');
    this.btnClear = document.getElementById('btnClear');
    this.btnBackspace = document.getElementById('btnBackspace');
    this.btnMute = document.getElementById('btnMute');
    this.btnPolish = document.getElementById('btnPolish');
    this.toggleAutoSpeak = document.getElementById('toggleAutoSpeak');

    // Modals & Panels
    this.dictionaryModal = document.getElementById('dictionaryModal');
    this.btnDictionary = document.getElementById('btnDictionary');
    this.btnCloseDictionary = document.getElementById('btnCloseDictionary');
    this.dictionaryGrid = document.getElementById('dictionaryGrid');

    this.practiceBanner = document.getElementById('practiceBanner');
    this.btnTogglePractice = document.getElementById('btnTogglePractice');
    this.practiceTargetEl = document.getElementById('practiceTarget');
    this.practiceScoreEl = document.getElementById('practiceScore');

    this.voiceSelect = document.getElementById('voiceSelect');

    // Settings
    this.autoSpeak = true;
    this.cameraInstance = null;
    this.handsInstance = null;
    this.isCameraActive = false;

    // Initialize Subsystems
    this.initEngines();
    this.bindEvents();
    this.renderDictionary();
  }

  initEngines() {
    // 1. Text to Speech
    this.speech = new SpeechEngine();
    this.speech.onStartSpeaking = () => {
      if (this.waveformEl) this.waveformEl.classList.add('active');
    };
    this.speech.onEndSpeaking = () => {
      if (this.waveformEl) this.waveformEl.classList.remove('active');
    };

    // Populate voices when loaded
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

        // Auto speak on conversational milestones
        if (this.autoSpeak && gesture.category === 'conversational') {
          const phrase = this.sentenceBuilder.formatNaturalGrammar(token);
          this.speech.speak(phrase);
        }
      }
    });

    // 4. UI & Canvas HUD Controller
    this.ui = new UIController({
      canvasElement: this.canvasElement,
      videoElement: this.videoElement,
      onSignPracticed: (sign) => this.handlePracticeSuccess(sign)
    });
  }

  bindEvents() {
    // Control Buttons
    this.btnSpeak?.addEventListener('click', () => {
      const sentence = this.sentenceBuilder.getFormattedSentence();
      if (sentence) {
        this.speech.speak(sentence, { force: true });
        this.sentenceBuilder.finishSentence();
        this.updateCaptionUI('');
        this.updateHistoryUI();
      }
    });

    this.btnClear?.addEventListener('click', () => {
      this.sentenceBuilder.clear();
      this.updateCaptionUI('');
    });

    this.btnBackspace?.addEventListener('click', () => {
      this.sentenceBuilder.backspace();
      this.updateCaptionUI(this.sentenceBuilder.getFormattedSentence());
    });

    this.btnMute?.addEventListener('click', () => {
      const isMuted = this.speech.toggleMute();
      this.btnMute.classList.toggle('muted', isMuted);
      this.btnMute.innerHTML = isMuted
        ? '<span class="icon">🔇</span> Unmute Voice'
        : '<span class="icon">🔊</span> Voice Active';
    });

    this.btnPolish?.addEventListener('click', () => {
      const raw = this.sentenceBuilder.getFormattedSentence();
      if (raw) {
        const polished = this.sentenceBuilder.formatNaturalGrammar(raw);
        this.captionText.textContent = polished;
        this.speech.speak(polished, { force: true });
        this.sentenceBuilder.finishSentence();
        this.updateHistoryUI();
      }
    });

    this.toggleAutoSpeak?.addEventListener('change', (e) => {
      this.autoSpeak = e.target.checked;
    });

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

    // Practice Mode
    this.btnTogglePractice?.addEventListener('click', () => {
      this.togglePracticeMode();
    });

    // Keyboard shortcuts for convenience
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
      this.captionText.innerHTML = '<span class="placeholder-caption">Waiting for signs... Make a gesture in front of camera</span>';
    } else {
      this.captionText.textContent = text;
    }
  }

  updateHistoryUI() {
    if (!this.historyList) return;
    const history = this.sentenceBuilder.getHistory();
    this.historyList.innerHTML = '';

    if (history.length === 0) {
      this.historyList.innerHTML = '<div class="empty-state">No spoken phrases yet. Completed sentences will appear here.</div>';
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
        <button class="btn-replay" title="Replay Audio">🔊</button>
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
        <div class="dict-tips">💡 ${sign.tips}</div>
      `;
      this.dictionaryGrid.appendChild(card);
    });
  }

  togglePracticeMode() {
    this.ui.practiceMode = !this.ui.practiceMode;
    this.practiceBanner.classList.toggle('active', this.ui.practiceMode);
    this.btnTogglePractice.classList.toggle('active', this.ui.practiceMode);

    if (this.ui.practiceMode) {
      this.btnTogglePractice.innerHTML = '🎯 Exit Practice Mode';
      this.nextPracticeChallenge();
    } else {
      this.btnTogglePractice.innerHTML = '🎯 Practice & Quiz Mode';
      this.ui.targetPracticeSign = null;
    }
  }

  nextPracticeChallenge() {
    const candidateSigns = ['HELLO', 'THANK YOU', 'I LOVE YOU', 'GOOD', 'OK', 'V', 'L', 'Y', 'B', 'W', 'HELP'];
    const randomSign = candidateSigns[Math.floor(Math.random() * candidateSigns.length)];
    this.ui.targetPracticeSign = randomSign;
    if (this.practiceTargetEl) {
      this.practiceTargetEl.textContent = randomSign;
    }
  }

  handlePracticeSuccess(sign) {
    this.ui.practiceStreak++;
    if (this.practiceScoreEl) {
      this.practiceScoreEl.textContent = `Score: ${this.ui.practiceStreak}`;
    }

    // Celebration visual feedback
    this.practiceBanner.classList.add('success-flash');
    this.speech.speak(`Awesome! That was ${sign}. Next sign!`);
    setTimeout(() => {
      this.practiceBanner.classList.remove('success-flash');
      this.nextPracticeChallenge();
    }, 1500);
  }

  /**
   * Start MediaPipe Hands and Camera
   */
  async start() {
    try {
      if (this.statusBadge) {
        this.statusBadge.textContent = 'Initializing Camera & AI Model...';
        this.statusBadge.className = 'status-badge status-loading';
      }

      // Check MediaPipe availability
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

        // 1. Classify gestures
        const gesture = this.gestureEngine.classify(results);

        // 2. Debounce and aggregate into sentences
        this.sentenceBuilder.processDetection(gesture);

        // 3. Render high-tech HUD overlay on canvas
        this.ui.renderFrame(results);

        const t1 = performance.now();
        this.ui.updateMetrics(t1 - t0);
      });

      // Synchronize canvas resolution with video
      const updateCanvasSize = () => {
        const vw = this.videoElement.videoWidth || 640;
        const vh = this.videoElement.videoHeight || 480;
        this.canvasElement.width = vw;
        this.canvasElement.height = vh;
      };

      this.videoElement.addEventListener('loadedmetadata', updateCanvasSize);

      // Start Camera Utils
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
        // Fallback standard getUserMedia
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

      this.isCameraActive = true;
      if (this.statusBadge) {
        this.statusBadge.textContent = 'System Operational · 60 FPS Real-Time';
        this.statusBadge.className = 'status-badge status-online';
      }
    } catch (err) {
      console.error('Failed to initialize webcam or MediaPipe:', err);
      if (this.statusBadge) {
        this.statusBadge.textContent = `Error: ${err.message || 'Camera access needed'}`;
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
