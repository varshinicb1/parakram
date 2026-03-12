"""
Parakram AI — FastAPI Backend
AI-assisted embedded systems development platform.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.project_routes import router as project_router
from api.canvas_routes import router as canvas_router
from api.build_routes import router as build_router
from api.flash_routes import router as flash_router
from api.pipeline_routes import router as pipeline_router
from api.suggestion_routes import router as suggestion_router
from api.template_routes import router as template_router
from api.simulation_routes import router as simulation_router
from api.serial_monitor import router as serial_router
from api.wokwi_routes import router as wokwi_router
from api.agent_routes import router as agent_router
from api.llm_routes import router as llm_router
from api.voice_routes import router as voice_router
from api.auth_routes import router as auth_router
from api.admin_routes import router as admin_router
from api.git_routes import router as git_router
from api.installer_routes import router as installer_router

load_dotenv()

app = FastAPI(
    title="Parakram AI",
    description="AI-assisted embedded systems development platform",
    version="2.0.0",
)

# CORS — allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:1420"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount route modules
app.include_router(project_router, prefix="/api/projects", tags=["Projects"])
app.include_router(canvas_router, prefix="/api/canvas", tags=["Canvas"])
app.include_router(build_router, prefix="/api/build", tags=["Build"])
app.include_router(flash_router, prefix="/api/flash", tags=["Flash"])
app.include_router(pipeline_router, prefix="/api/pipeline", tags=["Pipeline"])
app.include_router(suggestion_router, prefix="/api/suggestions", tags=["Suggestions"])
app.include_router(template_router, prefix="/api/templates", tags=["Templates"])
app.include_router(simulation_router, prefix="/api/simulation", tags=["Simulation"])
app.include_router(serial_router, prefix="/api/serial", tags=["Serial Monitor"])
app.include_router(wokwi_router, prefix="/api/wokwi", tags=["Wokwi Simulator"])
app.include_router(agent_router, prefix="/api/agent", tags=["Agent Intelligence"])
app.include_router(llm_router, prefix="/api/llm", tags=["LLM Providers"])
app.include_router(voice_router, prefix="/api/voice", tags=["Voice Input"])
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin Console"])
app.include_router(git_router, prefix="/api/git", tags=["Git Version Control"])
app.include_router(installer_router, prefix="/api/installer", tags=["Installer"])


@app.get("/")
async def root():
    return {
        "name": "Parakram AI",
        "version": "2.0.0",
        "status": "running",
        "engines": [
            "Multi-Provider LLM (OpenRouter Free / Ollama / Custom)",
            "RAG (nomic-embed-text)",
            "Self-Healing Compiler",
            "Code Review Agent",
            "Serial Debugger",
            "Schematic Parser",
            "Voice Input (Sarvam AI)",
            "Web Browser Tool",
        ],
        "boards": ["esp32dev", "esp32-s3", "esp32-c3", "stm32f4", "rp2040", "mega2560"],
        "v2_features": [
            "Multi-provider LLM routing (9 free models)",
            "User-managed API keys & custom providers",
            "Voice input via Sarvam AI",
            "Hardware simulator (Wokwi)",
            "Feature verification lab",
            "Git version control & auto-releases",
            "JWT Authentication & Admin console",
            "Toolchain & library auto-installer",
            "3D WebGL UI (Three.js)",
        ],
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
