"""Original multilingual and hidden-slide fixture; python-pptx + LibreOffice."""
from pathlib import Path
from pptx import Presentation
from pptx.util import Inches, Pt
import subprocess
import tempfile

root = Path(__file__).resolve().parent
presentation = Presentation()
presentation.slide_width = Inches(10)
presentation.slide_height = Inches(7.5)
slide = presentation.slides.add_slide(presentation.slide_layouts[6])
rows = [
    ('LANGUAGE FIELD NOTES', 'Liberation Sans'),
    ('中文测试 · 日本語の資料 · 한국어 자료', 'Noto Sans CJK SC'),
    ('العربية — عرض محلي', 'DejaVu Sans'),
    ('עברית — מסמך מקומי', 'DejaVu Sans'),
    ('ภาษาไทย — เอกสารทดสอบ', 'Noto Sans Thai'),
    ('हिन्दी — स्थानीय प्रस्तुति', 'Noto Sans Devanagari'),
    ('Français · Ελληνικά · Русский · Tiếng Việt', 'DejaVu Sans'),
]
for index, (text, font) in enumerate(rows):
    box = slide.shapes.add_textbox(Inches(.5), Inches(.4 + index * .8), Inches(9), Inches(.7))
    box.text = text
    paragraph = box.text_frame.paragraphs[0]
    paragraph.font.name = font
    paragraph.font.size = Pt(25)
hidden = presentation.slides.add_slide(presentation.slide_layouts[6])
hidden._element.set('show', '0')
hidden.shapes.add_textbox(Inches(1), Inches(2), Inches(8), Inches(1)).text = 'HIDDEN SLIDE — INCLUDED IN THE PDF'
last = presentation.slides.add_slide(presentation.slide_layouts[6])
last.shapes.add_textbox(Inches(1), Inches(2), Inches(8), Inches(1)).text = 'FINAL SLIDE — ORDER PRESERVED'
with tempfile.TemporaryDirectory() as directory:
    directory = Path(directory)
    source = directory / 'languages.pptx'
    presentation.save(source)
    subprocess.run(['libreoffice', '-env:UserInstallation=' + (directory / 'profile').as_uri(), '--headless', '--convert-to', 'ppt', '--outdir', str(root), str(source)], check=True)
