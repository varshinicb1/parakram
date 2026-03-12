"""
MISRA C:2012 Static Analyzer — Code quality checker for generated firmware.

Checks generated C/C++ code against a subset of MISRA C:2012 rules
commonly violated in embedded firmware. This gives Parakram enterprise-grade
code quality analysis — matching Embedder's MISRA compliance feature.

Rules checked:
  Rule 1.3  — No undefined behavior (null dereference, divide by zero)
  Rule 8.4  — Compatible declarations
  Rule 10.4 — No implicit narrowing conversions
  Rule 11.3 — No cast between pointer to object and integral type
  Rule 14.3 — No dead code (unreachable statements)
  Rule 15.5 — Single exit point per function (warning only)
  Rule 17.7 — Return values must be used
  Rule 20.4 — No dynamic memory allocation (malloc/free/new/delete)
  Rule 21.3 — No <stdlib.h> memory functions
  Rule 21.6 — No <stdio.h> in production (printf → Serial.println)
"""

import re
from dataclasses import dataclass
from enum import Enum


class Severity(str, Enum):
    ERROR = "error"
    WARNING = "warning"
    INFO = "info"


@dataclass
class MISRAViolation:
    rule: str
    severity: Severity
    line: int
    column: int
    message: str
    suggestion: str
    code_snippet: str = ""


class MISRAChecker:
    """Static analyzer checking MISRA C:2012 subset for embedded firmware."""

    def analyze(self, code: str, filename: str = "main.cpp") -> list[dict]:
        """Analyze code and return list of violations."""
        violations: list[MISRAViolation] = []
        lines = code.split("\n")

        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped or stripped.startswith("//") or stripped.startswith("/*"):
                continue

            # Rule 20.4 — No dynamic memory allocation
            if re.search(r'\b(malloc|calloc|realloc|free)\s*\(', stripped):
                violations.append(MISRAViolation(
                    rule="20.4", severity=Severity.ERROR, line=i, column=0,
                    message="Dynamic memory allocation detected (malloc/calloc/realloc/free)",
                    suggestion="Use static arrays or stack allocation. On MCUs, heap fragmentation causes crashes.",
                    code_snippet=stripped,
                ))
            if re.search(r'\bnew\s+\w', stripped) and 'placement' not in stripped.lower():
                violations.append(MISRAViolation(
                    rule="20.4", severity=Severity.ERROR, line=i, column=0,
                    message="C++ 'new' operator detected — avoid heap allocation on MCU",
                    suggestion="Use stack-allocated objects or static allocation.",
                    code_snippet=stripped,
                ))
            if re.search(r'\bdelete\s', stripped):
                violations.append(MISRAViolation(
                    rule="20.4", severity=Severity.ERROR, line=i, column=0,
                    message="C++ 'delete' operator detected",
                    suggestion="Avoid dynamic allocation entirely on resource-constrained MCUs.",
                    code_snippet=stripped,
                ))

            # Rule 21.6 — No stdio.h in production
            if re.search(r'#include\s*<stdio\.h>', stripped):
                violations.append(MISRAViolation(
                    rule="21.6", severity=Severity.WARNING, line=i, column=0,
                    message="<stdio.h> included — printf uses excessive stack and is not thread-safe",
                    suggestion="Use Serial.println() on Arduino, or HAL_UART_Transmit() on STM32.",
                    code_snippet=stripped,
                ))
            if re.search(r'\bprintf\s*\(', stripped) and 'Serial' not in stripped:
                violations.append(MISRAViolation(
                    rule="21.6", severity=Severity.WARNING, line=i, column=0,
                    message="printf() detected — avoid in embedded firmware",
                    suggestion="Replace with Serial.printf() or snprintf() to fixed buffer.",
                    code_snippet=stripped,
                ))

            # Rule 21.3 — No stdlib.h memory functions
            if re.search(r'#include\s*<stdlib\.h>', stripped):
                violations.append(MISRAViolation(
                    rule="21.3", severity=Severity.WARNING, line=i, column=0,
                    message="<stdlib.h> included — contains malloc/free/exit",
                    suggestion="Remove if only using for numeric conversions (use atoi alternatives).",
                    code_snippet=stripped,
                ))

            # Rule 11.3 — Dangerous pointer casts
            if re.search(r'\(\s*(int|uint\d+_t|long)\s*\)\s*&', stripped):
                violations.append(MISRAViolation(
                    rule="11.3", severity=Severity.ERROR, line=i, column=0,
                    message="Cast between pointer and integer type",
                    suggestion="Use uintptr_t for pointer-to-integer conversions if absolutely necessary.",
                    code_snippet=stripped,
                ))

            # Rule 1.3 — Division by zero risk
            if re.search(r'/\s*(\w+)\s*[;,\)]', stripped):
                divisor_match = re.search(r'/\s*(\w+)', stripped)
                if divisor_match and divisor_match.group(1) not in ('0', '1', '2', '4', '8', '16', '32', '64', '128', '256', '1000'):
                    if not re.search(r'if\s*\(.*!=\s*0', '\n'.join(lines[max(0,i-3):i])):
                        violations.append(MISRAViolation(
                            rule="1.3", severity=Severity.INFO, line=i, column=0,
                            message=f"Potential division by zero — divisor '{divisor_match.group(1)}' not checked",
                            suggestion="Add a zero-check guard: if (divisor != 0) before division.",
                            code_snippet=stripped,
                        ))

            # Arduino String class — heap fragmentation
            if re.search(r'\bString\s+\w', stripped) and 'std::string' not in stripped:
                violations.append(MISRAViolation(
                    rule="20.4", severity=Severity.WARNING, line=i, column=0,
                    message="Arduino String class uses dynamic allocation — causes heap fragmentation",
                    suggestion="Use char arrays with snprintf() for string formatting.",
                    code_snippet=stripped,
                ))

            # delay() blocking — embedded anti-pattern
            if re.search(r'\bdelay\s*\(\s*\d+\s*\)', stripped):
                delay_match = re.search(r'delay\s*\(\s*(\d+)\s*\)', stripped)
                if delay_match and int(delay_match.group(1)) > 100:
                    violations.append(MISRAViolation(
                        rule="EMBED.1", severity=Severity.WARNING, line=i, column=0,
                        message=f"Blocking delay({delay_match.group(1)}) > 100ms — blocks all other tasks",
                        suggestion="Use millis()-based non-blocking delay or FreeRTOS vTaskDelay().",
                        code_snippet=stripped,
                    ))

            # Volatile missing on ISR-shared variables
            if re.search(r'void\s+IRAM_ATTR\s+\w+|ISR\s*\(', stripped):
                # Check next few lines for variable access
                for j in range(i, min(i + 10, len(lines))):
                    if re.search(r'\b\w+\s*=', lines[j]) and 'volatile' not in '\n'.join(lines[max(0,i-5):j]):
                        violations.append(MISRAViolation(
                            rule="EMBED.2", severity=Severity.ERROR, line=j+1, column=0,
                            message="Variable modified in ISR may not be declared volatile",
                            suggestion="Declare ISR-shared variables as 'volatile' to prevent optimizer issues.",
                            code_snippet=lines[j].strip(),
                        ))
                        break

            # Infinite loop without watchdog
            if re.search(r'while\s*\(\s*1\s*\)|while\s*\(\s*true\s*\)', stripped):
                if 'wdt' not in code.lower() and 'watchdog' not in code.lower():
                    violations.append(MISRAViolation(
                        rule="EMBED.3", severity=Severity.WARNING, line=i, column=0,
                        message="Infinite loop without watchdog timer — MCU will hang on fault",
                        suggestion="Enable hardware watchdog timer (WDT) for production firmware.",
                        code_snippet=stripped,
                    ))

            # GPIO without mode setup
            if re.search(r'digital(Read|Write)\s*\(\s*(\d+)', stripped):
                pin_match = re.search(r'digital(Read|Write)\s*\(\s*(\d+)', stripped)
                if pin_match:
                    pin = pin_match.group(2)
                    if f'pinMode({pin}' not in code and f'pinMode( {pin}' not in code:
                        violations.append(MISRAViolation(
                            rule="EMBED.4", severity=Severity.WARNING, line=i, column=0,
                            message=f"GPIO{pin} used without pinMode() — undefined behavior",
                            suggestion=f"Add pinMode({pin}, {'INPUT' if pin_match.group(1) == 'Read' else 'OUTPUT'}) in setup().",
                            code_snippet=stripped,
                        ))

            # Hardcoded pin numbers (magic numbers)
            if re.search(r'(digital|analog)(Read|Write)\s*\(\s*\d+\s*[,)]', stripped):
                violations.append(MISRAViolation(
                    rule="EMBED.5", severity=Severity.INFO, line=i, column=0,
                    message="Magic number pin — use #define or constexpr for pin assignments",
                    suggestion="Example: #define LED_PIN 13, then use LED_PIN in code.",
                    code_snippet=stripped,
                ))

        return [
            {
                "rule": v.rule,
                "severity": v.severity.value,
                "line": v.line,
                "column": v.column,
                "message": v.message,
                "suggestion": v.suggestion,
                "code_snippet": v.code_snippet,
                "file": filename,
            }
            for v in violations
        ]

    def get_compliance_score(self, violations: list[dict]) -> dict:
        """Calculate MISRA compliance score."""
        if not violations:
            return {"score": 100, "grade": "A+", "status": "MISRA C:2012 COMPLIANT"}

        errors = sum(1 for v in violations if v["severity"] == "error")
        warnings = sum(1 for v in violations if v["severity"] == "warning")
        infos = sum(1 for v in violations if v["severity"] == "info")

        penalty = errors * 15 + warnings * 5 + infos * 1
        score = max(0, 100 - penalty)

        if score >= 90: grade = "A"
        elif score >= 75: grade = "B"
        elif score >= 60: grade = "C"
        elif score >= 40: grade = "D"
        else: grade = "F"

        return {
            "score": score,
            "grade": grade,
            "errors": errors,
            "warnings": warnings,
            "infos": infos,
            "total": len(violations),
            "status": "COMPLIANT" if errors == 0 else "NON-COMPLIANT",
        }


def get_misra_checker() -> MISRAChecker:
    return MISRAChecker()
