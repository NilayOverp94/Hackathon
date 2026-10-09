/**
 * gesture_engine.js - Real-time ASL (American Sign Language) Classifier
 * Supports:
 * - Dynamic Conversational Signs: HELLO/WAVE, THANK YOU, YES, NO, I LOVE YOU, HELP, PLEASE
 * - Practical Controls: SPACE, BACKSPACE, CLEAR, SPEAK
 * - Full ASL Alphabet: A, B, C, D, E, F, G, H, I, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y
 * - Static Symbols: THUMBS UP (GOOD), THUMBS DOWN (BAD), OK, PEACE
 */

import {
  distance3D,
  distance2D,
  getVector,
  angleBetweenVectors,
  getPalmScale,
  getHandCentroid,
  analyzeFingers
} from './landmarks.js';

export class GestureEngine {
  constructor() {
    // Temporal buffer for movement/dynamic recognition (last 30 frames)
    this.motionHistory = [];
    this.maxHistoryLength = 30;

    // Last registered gesture timestamp to debounce
    this.lastDetection = null;
  }

  /**
   * Push current frame to temporal buffer
   */
  updateHistory(landmarks, handedness = 'Right') {
    const now = performance.now();
    const centroid = getHandCentroid(landmarks);
    const wrist = landmarks[0];
    const indexTip = landmarks[8];

    this.motionHistory.push({
      timestamp: now,
      centroid,
      wrist: { x: wrist.x, y: wrist.y, z: wrist.z || 0 },
      indexTip: { x: indexTip.x, y: indexTip.y, z: indexTip.z || 0 },
      handedness
    });

    if (this.motionHistory.length > this.maxHistoryLength) {
      this.motionHistory.shift();
    }
  }

  /**
   * Analyze motion dynamics (velocity, oscillation, direction)
   */
  computeMotionDynamics() {
    if (this.motionHistory.length < 8) {
      return { vx: 0, vy: 0, vz: 0, oscillationsX: 0, oscillationsY: 0, totalDisplacement: 0 };
    }

    const n = this.motionHistory.length;
    const first = this.motionHistory[0];
    const last = this.motionHistory[n - 1];
    const dt = (last.timestamp - first.timestamp) / 1000; // seconds

    if (dt <= 0) return { vx: 0, vy: 0, vz: 0, oscillationsX: 0, oscillationsY: 0, totalDisplacement: 0 };

    const vx = (last.centroid.x - first.centroid.x) / dt;
    const vy = (last.centroid.y - first.centroid.y) / dt;
    const vz = (last.centroid.z - first.centroid.z) / dt;

    // Count direction reversals in X (waving)
    let reversalsX = 0;
    let reversalsY = 0;
    let prevDiffX = 0;
    let prevDiffY = 0;

    for (let i = 1; i < n; i++) {
      const dx = this.motionHistory[i].centroid.x - this.motionHistory[i - 1].centroid.x;
      const dy = this.motionHistory[i].centroid.y - this.motionHistory[i - 1].centroid.y;

      if (Math.abs(dx) > 0.008) {
        if (prevDiffX !== 0 && Math.sign(dx) !== Math.sign(prevDiffX)) {
          reversalsX++;
        }
        prevDiffX = dx;
      }

      if (Math.abs(dy) > 0.008) {
        if (prevDiffY !== 0 && Math.sign(dy) !== Math.sign(prevDiffY)) {
          reversalsY++;
        }
        prevDiffY = dy;
      }
    }

    const totalDisplacement = Math.hypot(
      last.centroid.x - first.centroid.x,
      last.centroid.y - first.centroid.y
    );

    return {
      vx, vy, vz,
      oscillationsX: reversalsX,
      oscillationsY: reversalsY,
      totalDisplacement
    };
  }

  /**
   * Main classifier for a single or double hand result
   */
  classify(results) {
    if (!results || !results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return null;
    }

    const numHands = results.multiHandLandmarks.length;
    const primaryLandmarks = results.multiHandLandmarks[0];
    const handedness = results.multiHandedness && results.multiHandedness[0]
      ? results.multiHandedness[0].label
      : 'Right';

    this.updateHistory(primaryLandmarks, handedness);
    const motion = this.computeMotionDynamics();

    // Check two-handed signs first (e.g., HELP)
    if (numHands >= 2) {
      const twoHandSign = this.classifyTwoHands(results.multiHandLandmarks);
      if (twoHandSign) return twoHandSign;
    }

    // Dynamic motion gestures
    const dynamicSign = this.classifyDynamicSigns(primaryLandmarks, motion);
    if (dynamicSign) return dynamicSign;

    // Only suppress static letters during rapid fast swipes (speed > 1.2)
    const speed = Math.hypot(motion.vx, motion.vy);
    if (speed > 1.2) {
      return null;
    }

    // Static ASL signs & letters
    return this.classifyStaticSigns(primaryLandmarks, handedness);
  }

  /**
   * Two-handed conversational gestures
   */
  classifyTwoHands(handsList) {
    const hand1 = handsList[0];
    const hand2 = handsList[1];

    const f1 = analyzeFingers(hand1);
    const f2 = analyzeFingers(hand2);

    // HELP gesture: One hand is a flat base palm, other hand is a thumbs-up on top moving up
    const isHand1FlatBase = f1.index.isExtended && f1.middle.isExtended && f1.ring.isExtended && f1.pinky.isExtended;
    const isHand2ThumbUp = f2.thumb.isUp && f2.index.isCurled && f2.middle.isCurled && f2.ring.isCurled && f2.pinky.isCurled;

    const isHand2FlatBase = f2.index.isExtended && f2.middle.isExtended && f2.ring.isExtended && f2.pinky.isExtended;
    const isHand1ThumbUp = f1.thumb.isUp && f1.index.isCurled && f1.middle.isCurled && f1.ring.isCurled && f1.pinky.isCurled;

    if ((isHand1FlatBase && isHand2ThumbUp) || (isHand2FlatBase && isHand1ThumbUp)) {
      return {
        text: 'HELP',
        category: 'conversational',
        confidence: 0.94,
        description: 'Both hands: Thumbs-up resting on flat palm (Help)'
      };
    }

    // Double Thumbs Up = GREAT / EXCELLENT
    if (f1.thumb.isUp && f2.thumb.isUp && f1.index.isCurled && f2.index.isCurled) {
      return {
        text: 'EXCELLENT',
        category: 'conversational',
        confidence: 0.95,
        description: 'Two thumbs up (Excellent / Great)'
      };
    }

    return null;
  }

  /**
   * Dynamic Movement Classifications (Wave, Nod, Swipe, Chin-to-Chest)
   */
  classifyDynamicSigns(landmarks, motion) {
    const f = analyzeFingers(landmarks);
    const allExtended = f.index.isExtended && f.middle.isExtended && f.ring.isExtended && f.pinky.isExtended;
    const allCurled = f.index.isCurled && f.middle.isCurled && f.ring.isCurled && f.pinky.isCurled;

    // HELLO / WAVE: All fingers extended + lateral side-to-side oscillations
    if (allExtended && motion.oscillationsX >= 2) {
      return {
        text: 'HELLO',
        category: 'conversational',
        confidence: 0.96,
        description: 'Waving hand back and forth (Hello / Greetings)'
      };
    }

    // YES: Fist with up-down bobbing / nodding oscillations
    if (allCurled && motion.oscillationsY >= 2) {
      return {
        text: 'YES',
        category: 'conversational',
        confidence: 0.94,
        description: 'Fist nodding up and down (Yes / Agreement)'
      };
    }

    // BACKSPACE: Quick horizontal swipe left
    if (motion.vx < -0.45 && motion.totalDisplacement > 0.18) {
      return {
        text: 'BACKSPACE',
        category: 'control',
        confidence: 0.90,
        description: 'Swipe hand left (Delete character)'
      };
    }

    // THANK YOU: Flat hand starting near chin/face moving outward toward camera
    // Flat hand moving in -z or moving down-forward
    if (allExtended && motion.vy > 0.15 && motion.totalDisplacement > 0.12 && landmarks[8].y > 0.25) {
      // In ASL: hand touches chin then moves toward receiver
      return {
        text: 'THANK YOU',
        category: 'conversational',
        confidence: 0.92,
        description: 'Flat hand moving forward and down (Thank You)'
      };
    }

    return null;
  }

  /**
   * Comprehensive Static ASL Classifier
   */
  classifyStaticSigns(landmarks, handedness) {
    const f = analyzeFingers(landmarks);
    const wrist = landmarks[0];
    const scale = f.scale;

    const { thumb, index, middle, ring, pinky, pinches } = f;

    // ----------------------------------------------------
    // CONVERSATIONAL / COMMON GESTURES
    // ----------------------------------------------------

    // "I LOVE YOU" (ASL): Thumb, Index, Pinky extended; Middle & Ring curled
    if (thumb.isExtended && index.isExtended && !middle.isExtended && !ring.isExtended && pinky.isExtended) {
      return {
        text: 'I LOVE YOU',
        category: 'conversational',
        confidence: 0.97,
        description: 'ASL "I Love You" sign (Thumb, Index, Pinky extended)'
      };
    }

    // "THUMBS UP" / GOOD: Fist with thumb pointed straight up
    if (thumb.isUp && index.isCurled && middle.isCurled && ring.isCurled && pinky.isCurled) {
      return {
        text: 'GOOD',
        category: 'conversational',
        confidence: 0.95,
        description: 'Thumbs Up (Good / Agree)'
      };
    }

    // "THUMBS DOWN" / BAD: Fist with thumb pointed straight down
    if (landmarks[4].y > landmarks[2].y + scale * 0.4 && index.isCurled && middle.isCurled && ring.isCurled && pinky.isCurled) {
      return {
        text: 'BAD',
        category: 'conversational',
        confidence: 0.92,
        description: 'Thumbs Down (Bad / Disagree)'
      };
    }

    // "PEACE" / "VICTORY" / "V": Index and Middle spread in V, Ring and Pinky curled
    if (index.isExtended && middle.isExtended && !ring.isExtended && !pinky.isExtended) {
      const distIndexMiddleTips = distance3D(landmarks[8], landmarks[12]) / scale;
      if (distIndexMiddleTips > 0.35) {
        return {
          text: 'V',
          category: 'alphabet',
          confidence: 0.95,
          description: 'Peace sign / ASL letter V'
        };
      } else {
        // "U": Index and Middle held tight together
        return {
          text: 'U',
          category: 'alphabet',
          confidence: 0.93,
          description: 'Index & Middle held tightly together (ASL letter U)'
        };
      }
    }

    // "OK" / "F": Thumb & Index pinch in circle, Middle, Ring, Pinky extended
    if (pinches.thumbIndex < 0.28 && middle.isExtended && ring.isExtended && pinky.isExtended) {
      return {
        text: 'OK',
        category: 'conversational',
        confidence: 0.95,
        description: 'OK sign / ASL letter F'
      };
    }

    // "W": Index, Middle, Ring extended upright in W; Thumb holds Pinky
    if (index.isExtended && middle.isExtended && ring.isExtended && !pinky.isExtended) {
      return {
        text: 'W',
        category: 'alphabet',
        confidence: 0.94,
        description: 'Three fingers extended in W shape (Letter W)'
      };
    }

    // "L": Thumb and Index form an L shape at ~90 degrees, other 3 curled
    if (thumb.isExtended && index.isExtended && middle.isCurled && ring.isCurled && pinky.isCurled) {
      const vThumb = getVector(landmarks[2], landmarks[4]);
      const vIndex = getVector(landmarks[5], landmarks[8]);
      const angle = angleBetweenVectors(vThumb, vIndex);
      if (angle > 50 && angle < 130) {
        return {
          text: 'L',
          category: 'alphabet',
          confidence: 0.96,
          description: 'Thumb & Index forming L shape (Letter L)'
        };
      }
    }

    // "Y": Thumb and Pinky extended out ("hang loose"), middle 3 curled
    if (thumb.isExtended && !index.isExtended && !middle.isExtended && !ring.isExtended && pinky.isExtended) {
      return {
        text: 'Y',
        category: 'alphabet',
        confidence: 0.95,
        description: 'Thumb & Pinky extended (Letter Y / Shaka)'
      };
    }

    // "I": Pinky extended straight up, others curled in tight fist
    if (!thumb.isUp && index.isCurled && middle.isCurled && ring.isCurled && pinky.isExtended) {
      return {
        text: 'I',
        category: 'alphabet',
        confidence: 0.95,
        description: 'Pinky finger extended (Letter I)'
      };
    }

    // "D": Index straight up, thumb touching curled middle/ring tips (forming circle)
    if (index.isExtended && !middle.isExtended && !ring.isExtended && !pinky.isExtended) {
      if (pinches.thumbMiddle < 0.35 || pinches.thumbRing < 0.35) {
        return {
          text: 'D',
          category: 'alphabet',
          confidence: 0.93,
          description: 'Index pointing straight up, fingers touching thumb (Letter D)'
        };
      }
      return {
        text: '1',
        category: 'numbers',
        confidence: 0.92,
        description: 'Single index finger pointing up (Number 1)'
      };
    }

    // "B": 4 fingers straight up tightly together, thumb folded across palm
    if (index.isExtended && middle.isExtended && ring.isExtended && pinky.isExtended && thumb.isFolded) {
      // Fingers must be pressed tightly together (not open/spread palm)
      const fingerGap1 = distance3D(landmarks[8], landmarks[12]) / scale;
      const fingerGap2 = distance3D(landmarks[12], landmarks[16]) / scale;
      const fingerGap3 = distance3D(landmarks[16], landmarks[20]) / scale;
      if (fingerGap1 < 0.22 && fingerGap2 < 0.22 && fingerGap3 < 0.22) {
        return {
          text: 'B',
          category: 'alphabet',
          confidence: 0.94,
          description: 'Four fingers upright held tightly together with thumb tucked across palm (Letter B)'
        };
      }
    }

    // "OPEN PALM" / "5" / SPACE: All 5 fingers extended and spread
    if (index.isExtended && middle.isExtended && ring.isExtended && pinky.isExtended && thumb.isExtended) {
      // Check tilt: if horizontal or tilted down -> SPACE control
      const vPalm = getVector(wrist, landmarks[9]);
      if (Math.abs(vPalm.x) > Math.abs(vPalm.y) * 1.1) {
        return {
          text: 'SPACE',
          category: 'control',
          confidence: 0.91,
          description: 'Horizontal open palm (Add Space between words)'
        };
      }
      return {
        text: '5',
        category: 'numbers',
        confidence: 0.92,
        description: 'Open hand with all 5 fingers spread (Number 5 / Stop)'
      };
    }

    // "C": Hand curved in a cup / C shape
    const cCurve = this.checkCShape(landmarks, scale);
    if (cCurve) {
      return {
        text: 'C',
        category: 'alphabet',
        confidence: 0.91,
        description: 'Curved hand resembling the letter C'
      };
    }

    // "O": All fingertips touching thumb tip forming a closed circle
    if (pinches.thumbIndex < 0.24 && pinches.thumbMiddle < 0.28 && !index.isExtended && !middle.isExtended) {
      return {
        text: 'O',
        category: 'alphabet',
        confidence: 0.92,
        description: 'Fingers touching thumb tip in a circle (Letter O)'
      };
    }

    // "A": Tight fist, thumb resting straight along side of index finger
    if (index.isCurled && middle.isCurled && ring.isCurled && pinky.isCurled) {
      if (thumb.distFromIndexMcp < 0.55 && landmarks[4].y < landmarks[3].y) {
        return {
          text: 'A',
          category: 'alphabet',
          confidence: 0.93,
          description: 'Fist with thumb upright along index side (Letter A)'
        };
      }

      // "S": Fist with thumb crossed over the front of the curled fingers
      if (thumb.distFromIndexMcp < 0.50 && landmarks[4].x > landmarks[5].x - 0.05) {
        return {
          text: 'S',
          category: 'alphabet',
          confidence: 0.91,
          description: 'Fist with thumb tucked across front of fingers (Letter S)'
        };
      }
    }

    // "X": Index finger hooked / bent, other fingers closed
    if (index.isBent && middle.isCurled && ring.isCurled && pinky.isCurled) {
      return {
        text: 'X',
        category: 'alphabet',
        confidence: 0.90,
        description: 'Index bent into a hook (Letter X)'
      };
    }

    // "R": Index and Middle crossed
    if (index.isExtended && middle.isExtended && !ring.isExtended && !pinky.isExtended) {
      // Distance between tips is very small or x coordinates flipped
      const isCrossed = Math.abs(landmarks[8].x - landmarks[12].x) < 0.03 * scale;
      if (isCrossed) {
        return {
          text: 'R',
          category: 'alphabet',
          confidence: 0.91,
          description: 'Index and Middle crossed (Letter R)'
        };
      }
    }

    // Fallback if no specific high-confidence sign matched
    return null;
  }

  /**
   * Helper to detect ASL 'C' hand shape
   */
  checkCShape(landmarks, scale) {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const wrist = landmarks[0];

    // Tips are apart by 0.35 to 0.7 scale, curved outward
    const gap = distance3D(thumbTip, indexTip) / scale;
    if (gap > 0.35 && gap < 0.75) {
      const isIndexCurved = landmarks[8].y > landmarks[6].y - 0.05;
      const isMiddleCurved = landmarks[12].y > landmarks[10].y - 0.05;
      if (isIndexCurved && isMiddleCurved) {
        return true;
      }
    }
    return false;
  }
}
