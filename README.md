# 🔱 Parakram AI

**AI-Assisted Embedded Systems Development Platform**

Design embedded systems visually using blocks on a canvas. Parakram interprets your block graph, generates modular firmware, compiles it, flashes your device, and learns from the results.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Block    │  │  React Flow  │  │  Config       │  │
│  │  Library  │  │  Canvas      │  │  Panel        │  │
│  └──────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │ REST API
┌──────────────────────┴──────────────────────────────┐
│                 FastAPI Backend                       │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  AI      │  │  Firmware    │  │  Build &      │  │
│  │  Agents  │  │  Generator   │  │  Flash        │  │
│  └──────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │   PlatformIO / ESP32    │
          └─────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + React Flow |
| Backend | Python FastAPI |
| AI | Claude API (Anthropic) |
| Build | PlatformIO CLI |
| Target | ESP32 (Arduino Framework) |

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
parakram/
├── frontend/          # React + TypeScript UI
├── backend/           # FastAPI server
├── firmware_templates/# Code templates for ESP32
├── projects/          # User project storage
├── docker-compose.yml
└── README.md
```

## V1 Capabilities

1. 🎨 Canvas block editor with drag-and-drop
2. 🧩 Hardware block library (sensors, comms, actuators)
3. 💾 Block graph storage as JSON
4. 🤖 AI system engineer agent (Claude)
5. ⚡ Modular firmware generation
6. 🔨 PlatformIO compile pipeline
7. 📡 Flash ESP32 device
8. ✅ User verification prompts
9. 📸 Automatic version snapshots

## License

MIT
