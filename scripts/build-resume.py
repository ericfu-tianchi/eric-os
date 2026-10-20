"""Publish a new resume: python3 scripts/build-resume.py <resume.pages|resume.pdf>

Exports .pages via Pages.app, then writes the downloadable PDF (public/resume.pdf),
a page image for the in-OS viewer (src/assets/resume-page.png), and the PDF's link
hotspots (src/data/resumeLinks.json). Needs pdftoppm (poppler), pypdf and Pillow.
"""
import json, os, subprocess, sys, tempfile
from PIL import Image
from pypdf import PdfReader

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.abspath(sys.argv[1])
pdf = os.path.join(ROOT, "public", "resume.pdf")

if src.endswith(".pages"):
    subprocess.run(["osascript", "-e", f'''tell application "Pages"
      set d to open (POSIX file "{src}")
      export d to (POSIX file "{pdf}") as PDF with properties {{image quality:Best}}
      close d saving no
    end tell'''], check=True)
elif src != pdf:
    subprocess.run(["cp", src, pdf], check=True)

page = PdfReader(pdf).pages[0]
_, _, w, h = [float(v) for v in page.mediabox]
links = []
for annot in page.get("/Annots") or []:
    a = annot.get_object()
    uri = (a.get("/A") or {}).get("/URI")
    if a.get("/Subtype") != "/Link" or not uri:
        continue
    x0, y0, x1, y1 = [float(v) for v in a["/Rect"]]
    links.append({"href": str(uri), "left": x0 / w * 100, "top": (h - y1) / h * 100,
                  "width": (x1 - x0) / w * 100, "height": (y1 - y0) / h * 100})
with open(os.path.join(ROOT, "src", "data", "resumeLinks.json"), "w") as f:
    json.dump({"aspect": w / h, "links": links}, f, indent=2)

with tempfile.TemporaryDirectory() as tmp:
    subprocess.run(["pdftoppm", "-png", "-r", "220", "-f", "1", "-l", "1", "-singlefile", pdf, os.path.join(tmp, "page")], check=True)
    # A text page needs few colors; quantizing keeps it sharp at ~1/4 the bytes.
    Image.open(os.path.join(tmp, "page.png")).convert("RGB").quantize(64).save(
        os.path.join(ROOT, "src", "assets", "resume-page.png"), optimize=True)
print(f"resume: {len(links)} links, page {w:.0f}x{h:.0f}pt")
