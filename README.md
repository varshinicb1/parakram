# Parakram by Vidyutlabs

> **The Open-Source Firmware Platform** — Generate firmware, debug protocols, analyze power, and deploy. By Vidyutlabs.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![API Endpoints](https://img.shields.io/badge/API_Endpoints-27-blue.svg)]()
[![Boards](https://img.shields.io/badge/Board_Variants-30+-orange.svg)]()

## What is Parakram?

Parakram is an open-source firmware development platform for embedded hardware. Describe your project in plain English — Parakram generates firmware, wires components, checks MISRA compliance, and deploys to your board.

**Supported MCUs:** ESP32 (6 variants), STM32 (12 variants), RP2040, nRF52, AVR, Teensy, SAMD

## Quick Start

```bash
# Clone
git clone https://github.com/varshinicb1/parakram.git
cd parakram

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend (new terminal)
cd desktop
npm install
npm run dev
```

## Features

| Feature | Description |
|---------|-------------|
| 🧠 **AI Firmware Gen** | 7-step pipeline with 3-attempt self-healing compilation |
| 📋 **MISRA C:2012** | 13+ rules with compliance scoring (A-F grading) |
| 🔌 **Protocol Decoder** | I2C, SPI, UART, CAN with auto device identification |
| 💡 **Wiring Generator** | 12 components with pin-to-pin tables and #define codegen |
| ⚡ **Power Profiler** | 5 MCU power databases, 8 battery types, optimization tips |
| 🧩 **Extensions** | VS Code-style with 18 built-in + community marketplace |
| 🔍 **Crash Decoder** | ESP32 Guru Meditation, STM32 HardFault, RP2040 panic |
| 📡 **OTA Updates** | SHA256 signing, version management, auto client codegen |
| 🎤 **Voice Input** | Sarvam AI speech-to-text for project descriptions |
| 📊 **Memory Analyzer** | Flash/RAM usage analysis with MCU-specific suggestions |
| 📌 **Pinout Visualizer** | Interactive pin maps with alternate functions |
| 🌐 **6 LLM Providers** | OpenRouter, Ollama, Gemini, Claude, OpenAI, Groq |

## Architecture

```
parakram/
├── backend/           # FastAPI (27 API routers)
│   ├── agents/        # AI engine (autonomous agent, chip KB, board DB)
│   ├── api/           # REST API routes
│   └── services/      # Business logic (18 services)
├── desktop/           # React + Vite frontend (13 spaces)
├── landing/           # Landing page
├── Dockerfile         # Multi-stage production build
└── .github/workflows/ # CI/CD pipeline
```

## API Documentation

Start the backend and visit `http://localhost:8000/docs` for interactive Swagger docs.

## Subscription Plans

| Plan | Price | Projects | Builds | LLM Models |
|------|-------|----------|--------|------------|
| Free | $0 | 3 | 10/day | Free models |
| Pro | $9/mo | 25 | 100/day | All models |
| Team | $29/mo | Unlimited | 500/day | All + priority |
| Enterprise | Custom | Unlimited | Unlimited | Custom + SLA |

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**A product by [Vidyutlabs](https://vidyutlabs.com)** · [Website](https://vidyutlabs.com/parakram) · [GitHub](https://github.com/varshinicb1/parakram)
