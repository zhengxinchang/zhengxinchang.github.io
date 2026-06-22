# zhengxinchang.github.io

This repository hosts multiple static web apps and pages.

## Update publications on the homepage

The publication section is rendered from:
- source BibTeX: home/paper.bib
- generated JSON: home/paper.json
- converter script: home/process_publication.py

### Steps

1. Edit BibTeX source

Update entries in home/paper.bib.

2. Regenerate JSON

From repo root:

```bash
cd home
../.venv/bin/python process_publication.py paper.bib paper.json
```

If your shell already uses the project virtual environment, this also works:

```bash
cd home
python process_publication.py paper.bib paper.json
```

3. Verify output

Confirm home/paper.json was updated and sorted by year (newest first).

4. Preview locally

The homepage fetches data files over HTTP. Use a local server (not file://):

```bash
cd ..
python -m http.server 8000
```

Then open:
- http://localhost:8000/home/

5. Optional content sync

If total publication count changed, also update the Publications stat in home/data.yml.

6. Commit related files

At minimum, include:
- home/paper.bib
- home/paper.json

If you changed rendering logic or styles, also include relevant files in home/.

## Notes

- Publication UI behavior: papers are grouped by year; latest two years are expanded by default.
- Older years are collapsed and can be expanded in the page.
