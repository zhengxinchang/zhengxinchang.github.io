# Xinchang Zheng homepage

This is a lightweight static personal homepage designed to be deployed under:

```text
https://zhengxinchang.github.io/home/
```

## Files

- `index.html`: Vue template for the page
- `styles.css`: responsive layout and visual design
- `script.js`: loads `data.yml`, mounts Vue, and manages page state
- `data.yml`: editable homepage content
- `paper.bib`: source BibTeX file for publications
- `paper.json`: generated publication data consumed by `script.js`
- `process_publication.py`: converts `paper.bib` to `paper.json`
- `assets/`: copied visual assets from existing local repositories

## Build publication JSON

Run this command inside `home/` whenever `paper.bib` changes:

```bash
python process_publication.py paper.bib paper.json
```
