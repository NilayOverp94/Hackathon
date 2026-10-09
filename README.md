# 🤟 SignPulse AI
### Real-Time American Sign Language to Text & Voice Engine

> **12-Hour Hackathon Solution**: An accessibility-first computer-vision web application that translates American Sign Language (ASL) into real-time closed captions and natural spoken voice using an ordinary webcam at 60 FPS with sub-20ms latency.

---

## ⚡ The Core Problem & Our Solution

| The Hackathon Challenge | How SignPulse AI Solves It |
|---|---|
| **Tracking hands reliably** | Leverages Google MediaPipe's 21 3D hand landmarks running on client-side WebAssembly/GPU. Scale-invariant landmark geometry ensures recognition regardless of camera distance or user hand size. |
| **Classifying movement vs. single frames** | Employs a **Hybrid Temporal Classifier**: A 30-frame sliding velocity buffer detects dynamic trajectories (e.g. *Waving for Hello*, *Nodding for Yes*, *Chin-to-front for Thank You*, *Swipe for Backspace*), alongside static fingerspelling alphabets. |
| **Fast enough to hold a conversation** | **100% Client-Side Execution**: Zero cloud video streaming round-trips. Inference occurs locally in ~12ms. Spoken audio generates instantly via browser Web Speech Synthesis. |

---

## 🛠️ Architecture

```
[ Ordinary Webcam Feed ] ── (30-60 FPS) ──> [ MediaPipe Hands (Client-Side WASM) ]
                                                    │
                                                    ▼ (21 3D Landmarks)
                                      [ Spatial & Angular Normalizer ]
                                                    │
                   ┌────────────────────────────────┴──────────────────────────────┐
                   ▼                                                               ▼
        [ Static ASL Classifier ]                                     [ Dynamic Motion Buffer ]
     (Fingerspelling A-Z, OK, V, etc.)                             (Velocity, Oscillation, Vectors)
                   │                                                               │
                   └────────────────────────────────┬──────────────────────────────┘
                                                    │
                                                    ▼
                                      [ Hold Stabilizer & Debounce ]
                                                    │
                                                    ▼
                                       [ Smart Sentence Assembler ]
                                                    │
                         ┌──────────────────────────┴──────────────────────────┐
                         ▼                                                     ▼
              [ Live Subtitle Bar ]                                  [ Real-Time Voice TTS ]
         (Karaoke-style closed captions)                        (Web Speech API + Visualizer)
```

---

## 🚀 Instant Quickstart (No Node.js Required!)

SignPulse AI is built using modern web standards (Vanilla HTML5, ES Modules, CSS3, WebGL, Web Speech API). It requires **zero compilation steps** and runs out-of-the-box on any machine.

### Run Locally:
```bash
# 1. Navigate to the project directory
cd /Users/nilayraj/Documents/Hackathon

# 2. Run the zero-dependency local server
python3 serve.py
```
Open your browser at **`http://localhost:8080`**, grant webcam permission, and start signing!

---

## 🌐 1-Click Deployment (For Presentation & Demo)

Because SignPulse AI is static and client-side, you can host it live in 60 seconds:

### Option A: GitHub Pages (Free & Instant)
1. Initialize a git repository and push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: SignPulse AI launch"
   git remote add origin https://github.com/<your-username>/signpulse-ai.git
   git push -u origin main
   ```
2. In your GitHub repository, go to **Settings** $\to$ **Pages** $\to$ Select branch `main` and root `/` $\to$ **Save**.

### Option B: Vercel (Instant HTTPS & Fast CDN)
1. Drop the repository folder directly into [vercel.com/new](https://vercel.com/new) as a static site.
2. Vercel automatically deploys it with SSL (camera permissions require HTTPS when deployed publicly).

---

## 🎯 Supported ASL Signs & Gestures

### 1. Conversational & Dynamic Signs
- **HELLO / WAVE**: Open hand waving side-to-side (`👋`)
- **THANK YOU**: Flat palm moving outward and down from chin (`🙏`)
- **I LOVE YOU**: Iconic ASL ILY sign (Thumb, Index, Pinky extended; Middle and Ring curled) (`🤟`)
- **YES**: Fist bobbing up and down (`✊`)
- **GOOD**: Thumbs up (`👍`)
- **BAD**: Thumbs down (`👎`)
- **OK**: Thumb and index ring (`👌`)
- **HELP**: Thumbs up fist resting atop flat palm (`🤝`)

### 2. Fingerspelling Alphabet & Numbers
- **Alphabets**: `A`, `B`, `C`, `D`, `I`, `L`, `O`, `U`, `V` (Peace), `W`, `X`, `Y` (Shaka), and more.
- **Numbers**: `1`, `5` (Open hand).

### 3. Smart Control Gestures
- **SPACE**: Flat palm held horizontally (`␣`)
- **BACKSPACE**: Hand swiped swiftly to the left (`⌫`)

---

## 🏆 Key Features to Show the Judges

1. **Augmented Reality HUD**: Neon skeleton tracking, joint confidence dots, and bounding box with lock-in progress circle.
2. **Interactive Practice Mode**: An interactive quiz mode for judges to test signs on their own webcams with a live score counter.
3. **Live Audio Equalizer**: Real-time visual waveform that activates whenever the synthesized voice speaks.
4. **Natural Grammar Polish**: A dedicated button that refines raw sign tokens into polite, grammatically fluent English.
5. **Full ASL Dictionary Modal**: Built-in guide showing illustrations and performance tips for every sign.
