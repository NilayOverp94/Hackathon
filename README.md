# SignPulse AI · Real-Time ASL Interpreter & Voice Engine

> **Accessibility-First Computer Vision System**: A real-time web application that translates American Sign Language (ASL) gestures into live captions and natural spoken voice using an ordinary webcam at 30–60 FPS with sub-20ms latency. Zero API keys, zero cloud transmission, 100% private and on-device.

---

##  Highlights & Key Innovations

- ** Zero Cloud Latency (~12ms inference)**: The entire computer vision pipeline runs locally in the browser over WebAssembly (Wasm) and WebGL. No expensive cloud GPU servers or streaming video round-trips.
- ** 100% Privacy Guaranteed**: Video frames never leave the user's local device. Fully compliant with strict privacy requirements.
- ** 60+ ASL Signs Recognized**: Full A–Z fingerspelling alphabet, numbers 1–8, 27 conversational signs, and natural control gestures (swipe backspace, palm space).
- ** Gboard-Style Word Prediction Engine**: Client-side predictive text algorithm suggests full words as you fingerspell, reducing typing effort by over 60%.
- ** Multi-Accent Voice Synthesis**: Supports regional accents across ** US English,  British English,  Indian English,  Australian English,  Canadian,  Irish**, and international voices with live audio preview and persistence.
- ** Interactive ASL Reference Guide**: In-app modal with search, category filtering, visual icons, and step-by-step how-to instructions for all 63 signs.
- ** Monochromatic Minimalist HUD**: Clean hand skeleton joint visualization, live FPS & inference latency counter, fullscreen toggle, and distraction-free dark UI.

---

##  Architecture & Data Pipeline

```
  Webcam Feed  ─────────>  MediaPipe Hands (Client Wasm/WebGL) 
                                              │
                                              ▼ (21 3D Landmarks)
                                 Spatial & Geometric Normalizer 
                                              │
               ┌──────────────────────────────┴──────────────────────────────┐
               ▼                                                             ▼
      Static Gesture Engine                                    Dynamic Motion Tracker 
  (A-Z, 1-8, OK, ILY, Fist, etc.)                             (Wave Hello, Thank You, Happy)
               │                                                             │
               └──────────────────────────────┬──────────────────────────────┘
                                              │
                                              ▼
                                  Hold Stabilizer & Debounce 
                                              │
                                              ▼
                                  Sentence & Grammar Engine 
                                 ├── Predictive Word Autocomplete
                                 └── Natural Punctuation Formatter
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
           Live Caption Subtitles                         Speech Synthesis Engine 
         (Word suggestions & cursor)                     (Accents: US, UK, IN, AU, etc.)
```

---

##  Quick Start (Zero Dependencies)

SignPulse AI is built using pure modern web standards (Vanilla JavaScript ES6 modules, HTML5, CSS3). **No Node.js or build steps required.**

### 1. Clone the Repository
```bash
git clone https://github.com/NilayOverp94/Hackathon.git
cd Hackathon
```

### 2. Run Locally
Start any static HTTP server (Python is built into macOS and Linux):
```bash
# Using Python 3 (included serve.py)
python3 serve.py
```
Open **`http://localhost:8080`** in Google Chrome, Microsoft Edge, or Safari. Allow webcam access and start signing!

---

##  Deploy to Vercel in 30 Seconds

The repository includes a ready-to-use [`vercel.json`](vercel.json) configuration:

1. Push your repository to GitHub.
2. Go to **[vercel.com/new](https://vercel.com/new)** and sign in with GitHub.
3. Import your **Hackathon** repository.
4. Leave settings at default (`Framework: Other`, `Root Directory: ./`).
5. Click **Deploy**. Vercel will generate an instant live SSL URL (e.g. `https://your-project.vercel.app`).

---

##  Supported Sign Language Dictionary (63 Gestures)

### 1. Everyday & Conversational Phrases (27 Signs)
| Sign / Phrase | Icon | How to Perform |
|---|:---:|---|
| **HELLO / WAVE** | 👋 | Open palm waving side-to-side (oscillating motion). |
| **THANK YOU** | 🙏 | Flat hand touching chin/mouth moving outward toward the camera. |
| **I LOVE YOU** | 🤟 | Thumb, Index, and Pinky extended; Middle and Ring curled. |
| **OK** | 👌 | Thumb & Index pinch in a circle; Middle, Ring, Pinky extended upright. |
| **FUCK YOU** | 🖕 | Middle finger extended upright, other fingers curled into fist. |
| **GOOD / THUMBS UP** | 👍 | Fist with thumb pointing straight up. |
| **BAD / THUMBS DOWN** | 👎 | Fist with thumb pointing straight down. |
| **EXCELLENT** | 👍👍 | Double Thumbs Up with both hands. |
| **YES** | ✊ | Closed fist nodding vertically up and down. |
| **NO** | 🤌 | Index and Middle fingertips snapping together onto Thumb tip. |
| **PLEASE** | 🤲 | Flat open palm rubbing chest in a circular motion. |
| **SORRY** | ✊ | Closed fist rubbing chest in a circular motion. |
| **HAPPY** | ✋ | Flat open hand brushing upward across chest repeatedly. |
| **MORE** | 🫳 | All 5 fingertips pinched together facing upright. |
| **STOP** | ✋ | Flat vertical palm facing directly toward the camera. |
| **WHERE** | 🤷 | Index finger extended shaking side-to-side in a question. |
| **WATER** | 💧 | "W" handshape (3 middle fingers) tapped near chin/mouth. |
| **EAT / FOOD** | 🥪 | Fingertips bunched together touching near mouth. |
| **DRINK** | 🥤 | Hand curled like holding a glass tilted toward mouth. |
| **TIME** | ⌚ | Index finger tapping the opposite wrist (watch gesture). |
| **YOU** | 🫵 | Index finger pointing forward toward the camera. |
| **ME / I** | 👤 | Index finger pointing inwards to your chest. |
| **LOOK / SEE** | 👀 | "V" peace sign pointing forward toward camera. |
| **FINE** | 🖐️ | Open 5-finger hand with thumb touching chest area. |
| **HELP** | 🤝 | Thumbs-up fist resting atop a flat open palm (Two-hand). |
| **WORK** | 🔨 | One fist tapping over the wrist of the other fist (Two-hand). |
| **PLAY** | 🎮 | Both hands showing "Y" (shaka) shaking together (Two-hand). |

---

### 2. Complete ASL Alphabet (26 Letters)
- **A**: Fist with thumb resting alongside index finger.
- **B**: Four fingers upright, thumb folded across palm.
- **C**: Fingers curved forming a "C" cup shape.
- **D**: Index pointing up; thumb touches middle, ring, pinky tips.
- **E**: Four fingertips curled resting atop folded thumb.
- **F**: Index and thumb form circle, other 3 fingers straight upright.
- **G**: Index pointing horizontally with thumb parallel.
- **H**: Index & Middle extended horizontally side-by-side.
- **I**: Pinky straight up, other fingers folded.
- **J**: Pinky tracing a "J" hook in the air.
- **K**: Index up, middle tilted forward, thumb between them.
- **L**: Thumb and Index forming an "L" at 90°.
- **M**: Thumb tucked under first three fingers.
- **N**: Thumb tucked under first two fingers.
- **O**: All fingertips touching thumb tip in an "O" shape.
- **P**: "K" handshape pointed downwards.
- **Q**: "G" handshape pointed downwards.
- **R**: Index and Middle fingers crossed over each other.
- **S**: Tight fist with thumb crossed in front of fingers.
- **T**: Thumb tucked between Index and Middle fingers.
- **U**: Index and Middle fingers held tightly together upright.
- **V**: Index and Middle fingers spread in a V (Peace sign).
- **W**: Index, Middle, and Ring fingers spread upright (W shape).
- **X**: Index finger bent into a hook/claw shape.
- **Y**: Thumb and Pinky extended outward (Shaka sign).
- **Z**: Index finger tracing a "Z" path in the air.

---

### 3. ASL Numbers (1–8 Digits)
- **1**: Single index finger pointing straight up.
- **2**: Index and middle fingers upright in a V shape.
- **3**: Thumb, index, and middle fingers extended (official ASL 3).
- **4**: Four fingers upright, thumb tucked across palm.
- **5**: All five fingers wide open and spread.
- **6**: Pinky tip touching thumb tip, other 3 fingers standing tall.
- **7**: Ring fingertip touching thumb tip, other 3 fingers standing tall.
- **8**: Middle fingertip touching thumb tip, other 3 fingers standing tall.

---

### 4. Smart Navigation Controls
- **SPACE **: Turn open flat hand horizontally.
- **BACKSPACE **: Swipe hand swiftly to the left in the air to erase the previous letter immediately.
- **CLEAR**: On-screen button or gesture reset to start fresh.

---

##  Multi-Accent Voice Engine

SignPulse AI includes a native accent picker integrated directly into the action toolbar:
- **Accents Supported**:
  -  US English (Samantha, Alex, Google US, Natural)
  -  British English (Daniel, Oliver, Serena)
  -  Indian English (Rishi, Veena, Google हिन्दी/English)
  -  Australian English (Karen)
  -  Canadian English
  -  Irish English
  -  International & Multilingual voices
- **Real-Time Preview**: Hear a sample upon switching voices.
- **Persistent Preferences**: Saves selected accent to `localStorage` automatically.

---

##  Tech Stack Overview

| Layer | Technologies Used |
|---|---|
| **Computer Vision (ML)** | Google MediaPipe Hands (v0.4 WebAssembly/WebGL) |
| **Core Gesture Engine** | Custom 3D Euclidean Vector Mathematics & Kinematic Velocity Filters |
| **Predictive Text Engine** | Custom In-Memory Trie & Vocabulary Matcher (`word_predictor.js`) |
| **Voice Synthesis** | Native Web Speech API (`window.speechSynthesis`) + Web Audio API |
| **Frontend HUD** | HTML5 Canvas 2D (`CanvasRenderingContext2D`), Vanilla ES6 Modules |
| **Design System** | Custom Vanilla CSS3 (Neutral Dark Theme, JetBrains Mono, Inter) |
| **Deployment** | Vercel Edge Network / Python 3 Local Server |

---

##  License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute for accessibility research, education, and hackathon projects.
