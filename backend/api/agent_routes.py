"""
Advanced Agent Routes — API endpoints for all Phase 1-7 capabilities.

Provides endpoints for:
- Board registry and selection
- Code review (static analysis)
- Serial output debugging
- Project import from existing Arduino/PlatformIO
- Schematic parsing (KiCad / EasyEDA)
- Compile gate (per-block compile test)
"""

import os
import json
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()


# ─── Board Registry ─────────────────────────────────────

@router.get("/boards")
async def list_boards():
    """List all supported boards with specs."""
    from agents.board_registry import list_boards
    return {"boards": list_boards()}


@router.get("/boards/{board_id}")
async def get_board(board_id: str):
    """Get full profile for a specific board."""
    from agents.board_registry import get_board, get_platformio_ini
    board = get_board(board_id)
    if not board:
        raise HTTPException(404, f"Board '{board_id}' not found")
    return {
        **board,
        "platformio_ini": get_platformio_ini(board_id),
    }


# ─── Code Review ────────────────────────────────────────

class ReviewRequest(BaseModel):
    source: str
    header: str = ""
    board: str = "esp32dev"


@router.post("/review")
async def review_code(request: ReviewRequest):
    """
    Static analysis of firmware code.
    Checks for memory safety, ISR bugs, blocking calls,
    FreeRTOS issues, and hardware conflicts.
    """
    from agents.code_reviewer import CodeReviewer
    reviewer = CodeReviewer()
    issues = reviewer.review(request.source, request.header, request.board)
    return {
        "total_issues": len(issues),
        "errors": sum(1 for i in issues if i.severity == "error"),
        "warnings": sum(1 for i in issues if i.severity == "warning"),
        "info": sum(1 for i in issues if i.severity == "info"),
        "issues": [
            {
                "severity": i.severity,
                "category": i.category,
                "line": i.line,
                "message": i.message,
                "suggestion": i.suggestion,
                "auto_fixable": i.auto_fixable,
            }
            for i in issues
        ],
        "report": reviewer.format_report(issues),
    }


# ─── Serial Debugger ────────────────────────────────────

class SerialDebugRequest(BaseModel):
    serial_output: str
    source_code: str = ""


@router.post("/debug/serial")
async def debug_serial(request: SerialDebugRequest):
    """
    Analyze serial output for crashes, sensor failures,
    connection issues, and resource exhaustion.
    """
    from agents.serial_debugger import SerialDebugger
    debugger = SerialDebugger()
    anomalies = debugger.analyze(request.serial_output)

    result = {
        "total_anomalies": len(anomalies),
        "crashes": sum(1 for a in anomalies if a.severity == "crash"),
        "errors": sum(1 for a in anomalies if a.severity == "error"),
        "warnings": sum(1 for a in anomalies if a.severity == "warning"),
        "anomalies": [
            {
                "severity": a.severity,
                "description": a.description,
                "likely_cause": a.likely_cause,
                "suggested_fix": a.suggested_fix,
                "line_number": a.line_number,
            }
            for a in anomalies
        ],
        "report": debugger.format_report(anomalies),
    }

    # If source code provided, generate fix prompt
    if request.source_code and anomalies:
        result["fix_prompt"] = debugger.build_fix_prompt(
            request.source_code, anomalies
        )

    return result


# ─── Project Import ──────────────────────────────────────

class ImportRequest(BaseModel):
    project_path: str


@router.post("/import")
async def import_project(request: ImportRequest):
    """
    Import an existing Arduino/PlatformIO project.
    Reverse-engineers blocks, libraries, and board from source code.
    """
    from services.project_importer import ProjectImporter

    if not os.path.isdir(request.project_path):
        raise HTTPException(404, f"Directory not found: {request.project_path}")

    importer = ProjectImporter()
    result = importer.import_project(request.project_path)

    if "error" in result:
        raise HTTPException(400, result["error"])

    return result


# ─── Schematic Parser ───────────────────────────────────

class SchematicRequest(BaseModel):
    file_path: str
    format: str = "kicad"  # "kicad" or "easyeda"


@router.post("/schematic/parse")
async def parse_schematic(request: SchematicRequest):
    """
    Parse a schematic file and generate a Parakram block graph.
    Supports KiCad (.kicad_sch) and EasyEDA (JSON).
    """
    from agents.schematic_parser import SchematicParser

    if not os.path.exists(request.file_path):
        raise HTTPException(404, f"Schematic file not found: {request.file_path}")

    parser = SchematicParser()

    if request.format == "kicad":
        result = parser.parse_kicad(request.file_path)
    elif request.format == "easyeda":
        result = parser.parse_easyeda(request.file_path)
    else:
        raise HTTPException(400, f"Unsupported format: {request.format}")

    return result


@router.post("/schematic/validate")
async def validate_hardware(request: SchematicRequest):
    """
    Validate schematic against firmware for electrical correctness.
    Checks I2C pull-ups, voltage levels, pin mismatches.
    """
    from agents.schematic_parser import SchematicParser, HardwareValidator

    if not os.path.exists(request.file_path):
        raise HTTPException(404, f"File not found: {request.file_path}")

    parser = SchematicParser()
    if request.format == "kicad":
        schematic = parser.parse_kicad(request.file_path)
    else:
        schematic = parser.parse_easyeda(request.file_path)

    validator = HardwareValidator()
    issues = validator.validate(schematic, "")

    return {
        "schematic": schematic,
        "validation_issues": issues,
    }


# ─── Compile Gate ────────────────────────────────────────

@router.get("/compile/scoreboard")
async def get_scoreboard():
    """Get the per-block compile success scoreboard."""
    from services.compile_gate import CompileGate
    gate = CompileGate()
    return gate.get_scoreboard()


class CompileTestRequest(BaseModel):
    block_id: str
    header: str
    source: str
    board: str = "esp32dev"


@router.post("/compile/test")
async def test_block_compile(request: CompileTestRequest):
    """
    Isolated compile test for a single block.
    Creates temp PlatformIO project, compiles, auto-heals if needed.
    """
    from services.compile_gate import CompileGate
    gate = CompileGate(board=request.board)
    result = await gate.test_block(
        request.block_id, request.header, request.source
    )
    return result


# ─── Header Parser ──────────────────────────────────────

@router.get("/libraries/scan")
async def scan_libraries():
    """Scan installed ESP32 framework libraries and extract APIs."""
    from agents.header_parser import scan_esp32_framework
    libs = scan_esp32_framework()
    summary = {}
    for name, info in libs.items():
        classes = info.get("classes", [])
        summary[name] = {
            "include": info.get("include", ""),
            "classes": [c["name"] for c in classes],
            "method_count": sum(len(c["methods"]) for c in classes),
            "function_count": len(info.get("functions", [])),
        }
    return {"library_count": len(libs), "libraries": summary}


# ─── NL → Block Graph ───────────────────────────────────

class NLGraphRequest(BaseModel):
    prompt: str
    use_llm: bool = False


@router.post("/nl/graph")
async def nl_to_graph(request: NLGraphRequest):
    """
    Convert natural language to a Parakram block graph.
    Example: "build me a weather station with MQTT"
    """
    from agents.nl_graph_agent import NLGraphAgent
    agent = NLGraphAgent()

    if request.use_llm:
        result = await agent.generate_with_llm(request.prompt)
    else:
        result = agent.build_graph(request.prompt)

    return result


# ─── Prompt → Firmware (end-to-end) ─────────────────────

class BuildRequest(BaseModel):
    prompt: str
    board: str = "esp32dev"
    verify: bool = True


@router.post("/build")
async def build_from_prompt(request: BuildRequest):
    """
    THE KILLER FEATURE.
    Natural language prompt → compiled, verified firmware project.
    """
    from services.prompt_to_firmware import PromptToFirmware
    pipeline = PromptToFirmware(board=request.board)
    result = await pipeline.build(request.prompt, verify=request.verify)
    return result


# ─── Runtime Library Search ─────────────────────────────

class LibrarySearchRequest(BaseModel):
    query: str


@router.post("/library/search")
async def search_library(request: LibrarySearchRequest):
    """Search PlatformIO registry for a library and get its API."""
    from services.library_fetcher import search_pio_registry
    results = await search_pio_registry(request.query)
    return {"results": results}
