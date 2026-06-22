import json
import re
import sys
from pathlib import Path


ENTRY_START = re.compile(r"^\s*@(?P<entry_type>\w+)\s*\{\s*(?P<key>[^,]+)\s*,\s*$")
FIELD_LINE = re.compile(r"^\s*(?P<field>[A-Za-z_][A-Za-z0-9_]*)\s*=\s*(?P<value>.+?)\s*,?\s*$")


def _strip_outer_braces(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == "{" and value[-1] == "}":
        return value[1:-1].strip()
    if len(value) >= 2 and value[0] == '"' and value[-1] == '"':
        return value[1:-1].strip()
    return value


def _clean_value(value: str) -> str:
    value = _strip_outer_braces(value)
    # Flatten BibTeX formatting braces while preserving text.
    value = value.replace("{", "").replace("}", "")
    # Handle common escaped characters and simple LaTeX accent commands.
    value = value.replace(r"\&", "&")
    value = re.sub(r"\\[a-zA-Z]+\s*([A-Za-z])", r"\1", value)
    value = re.sub(r"\\([`'\"^~=.])", r"\1", value)
    return value.strip()


def _parse_entries(bib_text: str):
    entries = []
    lines = bib_text.splitlines()
    i = 0

    while i < len(lines):
        start_match = ENTRY_START.match(lines[i])
        if not start_match:
            i += 1
            continue

        entry = {
            "type": start_match.group("entry_type").lower(),
            "key": start_match.group("key").strip(),
        }

        i += 1
        field_buffer = ""
        brace_depth = 0

        while i < len(lines):
            raw = lines[i].rstrip()
            stripped = raw.strip()

            if not stripped:
                i += 1
                continue

            if stripped == "}":
                if field_buffer:
                    field_match = FIELD_LINE.match(field_buffer)
                    if field_match:
                        entry[field_match.group("field").lower()] = _clean_value(
                            field_match.group("value")
                        )
                    field_buffer = ""
                break

            if field_buffer:
                field_buffer += " " + stripped
            else:
                field_buffer = stripped

            brace_depth += stripped.count("{") - stripped.count("}")

            if brace_depth <= 0:
                field_match = FIELD_LINE.match(field_buffer)
                if field_match:
                    entry[field_match.group("field").lower()] = _clean_value(
                        field_match.group("value")
                    )
                field_buffer = ""
                brace_depth = 0

            i += 1

        entries.append(entry)
        i += 1

    return entries


def _to_year(value: str) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def bib_to_json(input_path: Path, output_path: Path):
    text = input_path.read_text(encoding="utf-8")
    entries = _parse_entries(text)
    entries = [entry for entry in entries if entry.get("year")]
    entries.sort(key=lambda x: (_to_year(x.get("year")), x.get("title", "")), reverse=True)

    output_path.write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(entries)} records to {output_path}")


def main():
    if len(sys.argv) not in {2, 3}:
        print("Usage: python process_publication.py <paper.bib> [paper.json]", file=sys.stderr)
        sys.exit(1)

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2]) if len(sys.argv) == 3 else input_path.with_suffix(".json")

    if not input_path.exists():
        print(f"Input file not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    bib_to_json(input_path, output_path)


if __name__ == "__main__":
    main()
