/**
 * sentence_builder.js - Stabilizer, Debounce Buffer & NLP Sentence Assembler
 */

export class SentenceBuilder {
  constructor({ holdThresholdMs = 450, onTokenCommitted = null, onHoldProgress = null }) {
    this.holdThresholdMs = holdThresholdMs;
    this.onTokenCommitted = onTokenCommitted;
    this.onHoldProgress = onHoldProgress;

    // Holding state for current gesture
    this.currentCandidate = null;
    this.candidateStartTime = 0;
    this.lastCommittedToken = null;
    this.lastCommitTime = 0;

    // Sentence state
    this.currentWord = '';
    this.fullSentence = '';
    this.history = []; // Array of { text, timestamp }
  }

  /**
   * Process incoming frame classification
   */
  processDetection(gesture) {
    const now = performance.now();

    if (!gesture) {
      if (this.currentCandidate) {
        this.currentCandidate = null;
        if (this.onHoldProgress) this.onHoldProgress(0, null);
      }
      return;
    }

    // If same gesture continues
    if (this.currentCandidate && this.currentCandidate.text === gesture.text) {
      const elapsed = now - this.candidateStartTime;
      const progress = Math.min(1.0, elapsed / this.holdThresholdMs);

      if (this.onHoldProgress) {
        this.onHoldProgress(progress, gesture);
      }

      if (elapsed >= this.holdThresholdMs) {
        // Prevent immediate duplicate re-commit unless user released or 1.2s passed for repeating letters
        const timeSinceLastCommit = now - this.lastCommitTime;
        if (this.lastCommittedToken !== gesture.text || timeSinceLastCommit > 1300) {
          this.commitToken(gesture);
          this.lastCommittedToken = gesture.text;
          this.lastCommitTime = now;
          this.candidateStartTime = now; // reset timer for repeated hold
        }
      }
    } else {
      // New gesture started
      this.currentCandidate = gesture;
      this.candidateStartTime = now;
      if (this.onHoldProgress) {
        this.onHoldProgress(0.05, gesture);
      }
    }
  }

  /**
   * Commit verified gesture into word / sentence
   */
  commitToken(gesture) {
    const token = gesture.text;

    if (token === 'BACKSPACE') {
      this.backspace();
    } else if (token === 'SPACE') {
      this.addSpace();
    } else if (token === 'CLEAR') {
      this.clear();
    } else if (gesture.category === 'conversational') {
      // Conversational phrases are added directly as whole words or sentences
      if (this.fullSentence.length > 0 && !this.fullSentence.endsWith(' ')) {
        this.fullSentence += ' ';
      }
      this.fullSentence += token;
      this.currentWord = '';
    } else {
      // Alphabet letters or numbers
      this.currentWord += token;
      this.fullSentence += token;
    }

    if (this.onTokenCommitted) {
      this.onTokenCommitted(token, this.getFormattedSentence(), gesture);
    }
  }

  addSpace() {
    if (this.fullSentence.length > 0 && !this.fullSentence.endsWith(' ')) {
      this.fullSentence += ' ';
    }
    this.currentWord = '';
  }

  backspace() {
    if (this.fullSentence.length > 0) {
      this.fullSentence = this.fullSentence.slice(0, -1);
      if (this.currentWord.length > 0) {
        this.currentWord = this.currentWord.slice(0, -1);
      }
    }
  }

  clear() {
    this.fullSentence = '';
    this.currentWord = '';
  }

  getRawSentence() {
    return this.fullSentence;
  }

  getFormattedSentence() {
    if (!this.fullSentence || this.fullSentence.trim().length === 0) {
      return '';
    }

    // Capitalize first letter of sentences
    let text = this.fullSentence.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return text;
  }

  /**
   * Finish and archive current sentence into conversation history
   */
  finishSentence() {
    const sentence = this.getFormattedSentence();
    if (sentence) {
      this.history.unshift({
        text: sentence,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      });
      this.clear();
      return sentence;
    }
    return '';
  }

  getHistory() {
    return this.history;
  }

  /**
   * Smart Grammar / ASL Gloss to Natural English Formatter
   * Rules for conversational fluency
   */
  formatNaturalGrammar(rawText) {
    if (!rawText) return '';
    let text = rawText.trim();

    // Map common ASL phrases to polite natural English
    const phraseMap = {
      'HELLO': 'Hello!',
      'THANK YOU': 'Thank you very much!',
      'I LOVE YOU': 'I love you!',
      'HELP': 'I need help, please.',
      'PLEASE': 'Please.',
      'YES': 'Yes, absolutely.',
      'NO': 'No, thank you.',
      'GOOD': 'That sounds good.',
      'BAD': 'That is not good.'
    };

    if (phraseMap[text.toUpperCase()]) {
      return phraseMap[text.toUpperCase()];
    }

    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
