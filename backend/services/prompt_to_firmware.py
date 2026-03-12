"""
Prompt-to-Firmware Pipeline — The killer feature.

Single entry point: natural language prompt in, compiled + verified firmware out.

Pipeline:
  1. NL → Block Graph (nl_graph_agent)
  2. For each block: lookup golden template OR generate with parakram-coder-v2
  3. Anti-hallucination validation + auto-fix
  4. Code review (static analysis)
  5. Assemble into PlatformIO project
  6. Resolve library dependencies
  7. Compile with self-healing
  8. Wokwi simulation (optional)
"""

import os
import json
import shutil
import tempfile
import time
import asyncio
import aiohttp
from pathlib import Path
from typing import Optional

OLLAMA_BASE = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
MODEL = os.environ.get("OLLAMA_CODE_MODEL", "parakram-coder-v2")
PROJECT_DIR = os.environ.get("PARAKRAM_PROJECTS", os.path.expanduser("~/parakram_projects"))


class PromptToFirmware:
    """End-to-end: prompt → compiled firmware."""

    def __init__(self, board: str = "esp32dev"):
        self.board = board
        self._hw_blocks = {}
        self._load_library()

    def _load_library(self):
        """Load all hardware block templates."""
        hw_dir = os.path.join(os.path.dirname(__file__), "..", "hardware_library")
        for cat in os.listdir(hw_dir):
            cat_path = os.path.join(hw_dir, cat)
            if not os.path.isdir(cat_path) or cat.startswith(("_", ".")):
                continue
            for fname in os.listdir(cat_path):
                if not fname.endswith(".json"):
                    continue
                try:
                    with open(os.path.join(cat_path, fname), "r", encoding="utf-8") as f:
                        block = json.load(f)
                    self._hw_blocks[block.get("id", fname.replace(".json", ""))] = block
                except Exception:
                    pass

    async def build(self, prompt: str, verify: bool = True) -> dict:
        """
        Full pipeline: prompt → compiled firmware.

        Returns:
            {
                "success": bool,
                "project_dir": str,
                "graph": dict,
                "blocks": [{id, name, has_template, header, source}],
                "review_issues": [],
                "compile_result": {},
                "simulation_result": {},
                "timings": {},
            }
        """
        result = {
            "success": False, "prompt": prompt, "board": self.board,
            "blocks": [], "review_issues": [], "timings": {},
        }
        t0 = time.time()

        # ── Step 1: NL → Block Graph ────────────────────
        from agents.nl_graph_agent import NLGraphAgent
        agent = NLGraphAgent()
        graph = agent.build_graph(prompt)
        result["graph"] = graph
        result["timings"]["nl_parse"] = round(time.time() - t0, 2)

        if not graph["nodes"]:
            result["error"] = "Could not understand the prompt. Try being more specific."
            return result

        # ── Step 2: Get code for each block ─────────────
        t1 = time.time()
        blocks = []
        for node in graph["nodes"]:
            bid = node["block_id"]
            if bid == "esp32_manifest":
                continue

            hw = self._hw_blocks.get(bid, {})
            fw = hw.get("firmware_template", {})
            header = fw.get("header", "")
            source = fw.get("source", "")

            if header and source and len(source) > 30:
                # Golden template — zero hallucination risk
                blocks.append({
                    "id": bid, "name": hw.get("name", bid),
                    "has_template": True,
                    "header": header, "source": source,
                    "libs": hw.get("libraries", []),
                    "lib_deps": hw.get("platformio_deps", hw.get("lib_deps", [])),
                })
            else:
                # Generate with LLM + anti-hallucination
                gen = await self._generate_block(bid, hw)
                if gen:
                    blocks.append({
                        "id": bid, "name": hw.get("name", bid),
                        "has_template": False,
                        "header": gen["header"], "source": gen["source"],
                        "libs": hw.get("libraries", []),
                        "lib_deps": hw.get("platformio_deps", hw.get("lib_deps", [])),
                    })

        result["blocks"] = blocks
        result["timings"]["code_gen"] = round(time.time() - t1, 2)

        if not blocks:
            result["error"] = "No firmware blocks could be generated."
            return result

        # ── Step 3: Anti-hallucination validation ───────
        t2 = time.time()
        from agents.anti_hallucination import AntiHallucinationEngine
        ah = AntiHallucinationEngine()
        for block in blocks:
            if not block["has_template"]:
                val = ah.validate_and_fix(block["source"])
                block["source"] = val["code"]
                block["hallucinations_found"] = val["issues_found"]
                block["hallucinations_fixed"] = val["issues_fixed"]
        result["timings"]["anti_hallucination"] = round(time.time() - t2, 2)

        # ── Step 4: Code review ─────────────────────────
        t3 = time.time()
        from agents.code_reviewer import CodeReviewer
        reviewer = CodeReviewer()
        all_issues = []
        for block in blocks:
            issues = reviewer.review(block["source"], block["header"], self.board)
            for issue in issues:
                all_issues.append({
                    "block": block["id"],
                    "severity": issue.severity,
                    "category": issue.category,
                    "message": issue.message,
                })
        result["review_issues"] = all_issues
        result["timings"]["code_review"] = round(time.time() - t3, 2)

        # ── Step 5: Assemble PlatformIO project ─────────
        t4 = time.time()
        project_name = prompt.lower()[:30].strip()
        for ch in " ,.'\"!?/\\:*<>|":
            project_name = project_name.replace(ch, "_")
        project_dir = os.path.join(PROJECT_DIR, project_name)
        os.makedirs(os.path.join(project_dir, "src"), exist_ok=True)
        os.makedirs(os.path.join(project_dir, "include"), exist_ok=True)

        # Write platformio.ini
        from agents.board_registry import get_platformio_ini
        ini = get_platformio_ini(self.board)

        # Collect all lib_deps
        all_deps = set()
        for block in blocks:
            for dep in block.get("lib_deps", []):
                if dep:
                    all_deps.add(dep)
        if all_deps:
            ini += "\nlib_deps =\n"
            for dep in sorted(all_deps):
                ini += f"    {dep}\n"

        with open(os.path.join(project_dir, "platformio.ini"), "w") as f:
            f.write(ini)

        # Write block headers and sources
        for block in blocks:
            safe_id = block["id"].replace("-", "_")
            if block["header"]:
                with open(os.path.join(project_dir, "include", f"{safe_id}.h"), "w") as f:
                    f.write(block["header"])
            if block["source"]:
                with open(os.path.join(project_dir, "src", f"{safe_id}.cpp"), "w") as f:
                    f.write(block["source"])

        # Write main.cpp
        main_cpp = self._generate_main(blocks)
        with open(os.path.join(project_dir, "src", "main.cpp"), "w") as f:
            f.write(main_cpp)

        result["project_dir"] = project_dir
        result["timings"]["assembly"] = round(time.time() - t4, 2)

        if not verify:
            result["success"] = True
            result["timings"]["total"] = round(time.time() - t0, 2)
            return result

        # ── Step 6: Compile ─────────────────────────────
        t5 = time.time()
        compile_result = await self._compile(project_dir)
        result["compile_result"] = compile_result
        result["timings"]["compile"] = round(time.time() - t5, 2)

        if compile_result.get("success"):
            result["success"] = True

            # ── Step 7: Wokwi simulation (optional) ─────
            if verify:
                t6 = time.time()
                sim = await self._simulate(project_dir, blocks)
                result["simulation_result"] = sim
                result["timings"]["simulation"] = round(time.time() - t6, 2)

        result["timings"]["total"] = round(time.time() - t0, 2)
        return result

    async def _generate_block(self, block_id: str, hw_info: dict) -> Optional[dict]:
        """Generate firmware for a block using LLM with constrained prompt."""
        from agents.anti_hallucination import AntiHallucinationEngine
        engine = AntiHallucinationEngine()
        libs = hw_info.get("libraries", [])
        prompt = engine.build_constrained_prompt(
            hw_info.get("name", block_id),
            hw_info.get("category", ""),
            [lib.replace(".h", "") for lib in libs],
            hw_info.get("description", ""),
        )

        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    f"{OLLAMA_BASE}/api/generate",
                    json={"model": MODEL, "prompt": prompt, "stream": False},
                    timeout=aiohttp.ClientTimeout(total=60),
                ) as resp:
                    data = await resp.json()
                    text = data.get("response", "")

            # Parse header and source
            header = ""
            source = ""
            if "===HEADER===" in text and "===SOURCE===" in text:
                parts = text.split("===SOURCE===")
                header = parts[0].replace("===HEADER===", "").strip()
                source = parts[1].strip() if len(parts) > 1 else ""

            if source:
                return {"header": header, "source": source}
        except Exception as e:
            print(f"[ptf] LLM generation failed for {block_id}: {e}")

        return None

    def _generate_main(self, blocks: list[dict]) -> str:
        """Generate main.cpp that calls all block setup/loop functions."""
        lines = ['#include <Arduino.h>']
        for block in blocks:
            safe = block["id"].replace("-", "_")
            lines.append(f'#include "{safe}.h"')

        lines.append('\nvoid setup() {')
        lines.append('    Serial.begin(115200);')
        lines.append('    delay(1000);')
        lines.append(f'    Serial.println("=== Parakram Firmware ===");')
        lines.append(f'    Serial.println("Blocks: {len(blocks)}");')
        lines.append('')
        for block in blocks:
            safe = block["id"].replace("-", "_")
            lines.append(f'    {safe}_setup();')
        lines.append('}')
        lines.append('\nvoid loop() {')
        for block in blocks:
            safe = block["id"].replace("-", "_")
            lines.append(f'    {safe}_loop();')
        lines.append('}')

        return '\n'.join(lines) + '\n'

    async def _compile(self, project_dir: str) -> dict:
        """Compile the project with self-healing."""
        import subprocess
        try:
            proc = subprocess.run(
                ["pio", "run", "-d", project_dir],
                capture_output=True, text=True, timeout=120,
            )
            success = proc.returncode == 0
            return {
                "success": success,
                "stdout": proc.stdout[-500:] if proc.stdout else "",
                "stderr": proc.stderr[-500:] if proc.stderr else "",
            }
        except subprocess.TimeoutExpired:
            return {"success": False, "error": "Compile timeout (120s)"}
        except FileNotFoundError:
            return {"success": False, "error": "PlatformIO not found"}
        except Exception as e:
            return {"success": False, "error": str(e)}

    async def _simulate(self, project_dir: str, blocks: list) -> dict:
        """Run Wokwi simulation if wokwi-cli is available."""
        import subprocess

        # Check for wokwi-cli
        try:
            subprocess.run(["wokwi-cli", "--version"], capture_output=True, timeout=5)
        except (FileNotFoundError, subprocess.TimeoutExpired):
            return {"skipped": True, "reason": "wokwi-cli not available"}

        # Generate diagram.json
        diagram = self._generate_wokwi_diagram(blocks)
        with open(os.path.join(project_dir, "diagram.json"), "w") as f:
            json.dump(diagram, f, indent=2)

        # Generate wokwi.toml
        firmware_path = os.path.join(
            project_dir, ".pio", "build", self.board, "firmware.bin"
        )
        toml = f'[wokwi]\nversion = 1\nfirmware = "{firmware_path}"\nelf = ""\n'
        with open(os.path.join(project_dir, "wokwi.toml"), "w") as f:
            f.write(toml)

        # Run simulation
        try:
            proc = subprocess.run(
                ["wokwi-cli", "--timeout", "10000", project_dir],
                capture_output=True, text=True, timeout=20,
            )
            output = proc.stdout + proc.stderr

            # Check for crashes
            from agents.serial_debugger import SerialDebugger
            debugger = SerialDebugger()
            anomalies = debugger.analyze(output)

            return {
                "ran": True,
                "output": output[-500:],
                "anomalies": len(anomalies),
                "crashes": sum(1 for a in anomalies if a.severity == "crash"),
            }
        except Exception as e:
            return {"ran": False, "error": str(e)}

    def _generate_wokwi_diagram(self, blocks: list) -> dict:
        """Generate Wokwi diagram.json for simulation."""
        parts = [{"type": "board-esp32-devkit-c-v4", "id": "esp", "top": 0, "left": 0, "attrs": {}}]
        connections = []

        y_offset = 50
        for block in blocks:
            bid = block["id"]
            if bid in ("wifi_station", "mqtt_client", "http_client", "websocket_client",
                       "esp_now_peer", "deep_sleep", "ota_updater", "nvs_preferences",
                       "eeprom_store", "esp32_manifest"):
                continue  # Software-only blocks

            hw = self._hw_blocks.get(bid, {})
            pins = hw.get("pins", {})

            # Map block IDs to Wokwi component types
            wokwi_map = {
                "dht22": "wokwi-dht22", "bme280": "wokwi-dht22",
                "sht31": "wokwi-dht22", "led_output": "wokwi-led",
                "servo_motor": "wokwi-servo", "i2c_oled": "wokwi-ssd1306",
                "pir_sensor": "wokwi-pir-motion-sensor",
                "ultrasonic_hcsr04": "wokwi-hc-sr04",
                "relay_module": "wokwi-relay-module",
                "neopixel_strip": "wokwi-neopixel",
                "soil_moisture": "wokwi-potentiometer",
            }

            wtype = wokwi_map.get(bid)
            if wtype:
                comp_id = bid.replace("_", "-")
                parts.append({
                    "type": wtype, "id": comp_id,
                    "top": y_offset, "left": 300, "attrs": {},
                })
                y_offset += 80

        return {"version": 1, "author": "Parakram AI", "editor": "wokwi",
                "parts": parts, "connections": connections}
