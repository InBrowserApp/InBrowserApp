"""Original DOC compatibility source; requires python-docx and LibreOffice."""
from pathlib import Path
from docx import Document
from docx.shared import Inches
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
import struct, zlib

root = Path(__file__).parent
image = root / 'marker.png'
def chunk(kind, data):
    return struct.pack('>I', len(data)) + kind + data + struct.pack('>I', zlib.crc32(kind + data))
rows = b''.join(b'\0' + bytes([30, 90, 140] if y < 8 else [80, 150, 60] if y < 16 else [230, 160, 40]) * 80 for y in range(24))
image.write_bytes(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', 80, 24, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(rows)) + chunk(b'IEND', b''))

doc = Document()
doc.sections[0].header.paragraphs[0].text = 'Original running header'
doc.sections[0].footer.paragraphs[0].text = 'Original running footer'
doc.add_heading('A day beside the river', 1)
p = doc.add_paragraph('Original compatibility material. ')
p.add_run('Strong emphasis. ').bold = True
p.add_run('Italic emphasis.').italic = True
doc.add_paragraph('中文测试：山水与城市。 Русский текст. العربية. עברית.')
doc.add_heading('Observations', 2)
for text in ['Measure the water', 'Record the light', 'Return to the bank']:
    doc.add_paragraph(text, 'List Number')
for text in ['Pebbles', 'Reeds']:
    doc.add_paragraph(text, 'List Bullet')
table = doc.add_table(rows=3, cols=3)
for row, values in zip(table.rows, [('Station', 'Depth', 'Note'), ('A', '1.25 m', 'Clear'), ('B', '2.50 m', 'Shade')]):
    for cell, value in zip(row.cells, values): cell.text = value
doc.add_picture(str(image), width=Inches(2.5), height=Inches(.7))
doc.add_page_break()
doc.add_heading('Later observations', 2)
p = doc.add_paragraph('Changes: ')
for tag, text, identifier in [('del', 'REMOVED TEXT', '1'), ('ins', 'ADDED TEXT', '2')]:
    revision = OxmlElement('w:'+tag)
    revision.set(qn('w:id'), identifier)
    revision.set(qn('w:author'), 'InBrowser.App')
    revision.set(qn('w:date'), '2026-01-01T00:00:00Z')
    run = OxmlElement('w:r')
    content = OxmlElement('w:delText' if tag == 'del' else 'w:t')
    content.text = text
    run.append(content)
    revision.append(run)
    p._p.append(revision)
for i in range(1, 16):
    doc.add_heading(f'Field note {i}', 2)
    doc.add_paragraph(('We compare the bank, the water and the path. ' * 12))
doc.save(root / 'reading.docx')
image.unlink()
