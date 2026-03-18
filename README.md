# Parakram — AI-Powered Firmware Generation Platform

> Generate production-ready embedded firmware from natural language prompts.
> 202 MISRA-compliant golden blocks · 8 board profiles · Visual block editors · Tauri desktop app

---

## Quick Start

```bash
# 1. Start the backend
cd backend
pip install -r requirements.txt
python main.py

# 2. Start the frontend (dev mode)
cd desktop
npm install
npm run dev

# 3. Build distributable desktop app
python build_sidecar.py          # Package Python backend
cd desktop && cargo tauri build  # Build installer
```

---

## Architecture

```
parakram/
├── desktop/                    # Tauri v2 + React 19 + TypeScript
│   ├── src/
│   │   ├── spaces/             # 16 full-screen views
│   │   ├── canvas/             # XY Flow visual block editor
│   │   ├── panels/             # CalibrationPanel wizard
│   │   ├── components/         # Sidebar, CommandPalette, VoiceMic
│   │   ├── stores/             # Zustand state management
│   │   └── three/              # Three.js background scene
│   └── src-tauri/              # Rust sidecar + shell plugin
│
├── backend/                    # Python FastAPI (50+ endpoints)
│   ├── agents/                 # 202 golden blocks (8 batch files)
│   ├── services/               # 12 service modules
│   └── api/                    # REST API routes
│
└── build_sidecar.py            # PyInstaller → Tauri sidecar binary
```

## 16 Desktop Spaces

| Space | Description |
|---|---|
| **Home** | AI prompt → firmware architecture plan → save to DB |
| **Workspace** | VS Code-style editor with file tree + MISRA analysis |
| **Blocks** | Browse 202 golden blocks by category |
| **Visual Designer** | XY Flow canvas + block palette + code preview |
| **Blockly Editor** | Google Blockly with 13 custom firmware blocks + C++ codegen |
| **Simulator** | Wokwi ESP32 iframe + serial monitor + AI interpret |
| **Devices** | USB device scan, firmware flash, VID/PID detection |
| **Telemetry** | Live Recharts (3 channels) + CSV export |
| **Debug** | Serial monitor + protocol analyzer + crash decoder + I2C scan |
| **Calibration** | Multi-point sensor wizard with R² quality + firmware codegen |
| **Verification** | Hardware checklist with AI suggestions + progress bar |
| **Settings** | 6 LLM providers, API keys, billing, themes |
| **Auth** | JWT login/signup/reset with animated transitions |
| **Installer** | 6 toolchains + 10 libraries with progress bars |
| **Extensions** | VS Code-style extension marketplace |
| **Admin** | User management, roles, analytics dashboard |

## 12 Backend Services

| Service | Capabilities |
|---|---|
| `golden_blocks` | 202 MISRA-compliant blocks across 10 categories |
| `calibration_engine` | Polynomial calibration, 10 recipes, R², C codegen |
| `data_interpreter` | Rule-based (15 sensors) + LLM hybrid |
| `blockly_converter` | 27 BlocklyDuino type mappings |
| `board_profiles` | ESP32×3, STM32×3, RP2040×2 |
| `serial_service` | VID:PID for 12 boards, esptool flash |
| `ota_service` | HTTP OTA push, ArduinoOTA codegen |
| `firmware_exporter` | PlatformIO project ZIP export |
| `wokwi_simulator` | 30+ part mappings, diagram.json generation |
| `ci_pipeline` | GitHub Actions, pre-commit hooks, unit tests |
| `template_gallery` | 12 curated project templates |
| `doc_generator` | README with BOM, pin diagram, setup |

## Supported Boards

| Board | MCU | Flash | Features |
|---|---|---|---|
| ESP32 DevKit V1 | ESP32 | 4MB | WiFi, BLE, Touch, DAC |
| ESP32-S3 DevKit | ESP32-S3 | 16MB | WiFi, BLE5, USB OTG, PSRAM |
| ESP32-C3 Mini | ESP32-C3 | 4MB | WiFi, BLE5, USB Serial |
| STM32F411 BlackPill | STM32F411 | 512KB | USB, DMA, PWM |
| STM32F103 BluePill | STM32F103 | 64KB | USB, CAN, SPI |
| Nucleo F446RE | STM32F446 | 512KB | USB, CAN, I2S, DMA |
| Raspberry Pi Pico | RP2040 | 2MB | PIO, USB, DMA |
| Raspberry Pi Pico W | RP2040 | 2MB | WiFi, BLE, PIO |

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, XY Flow, Recharts, Framer Motion, Three.js
- **Backend**: Python, FastAPI, NumPy, Pydantic
- **Desktop**: Tauri v2, Rust
- **Firmware**: Arduino framework, PlatformIO
- **Simulation**: Wokwi, Google Blockly
- **State**: Zustand, Dexie.js (IndexedDB)

## License

MIT — Built by Vidyutlabs
