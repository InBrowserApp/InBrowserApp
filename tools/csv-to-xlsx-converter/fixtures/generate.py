"""Generate owned fixtures; no third-party document content."""
import csv
import io
from pathlib import Path

root = Path(__file__).parent
rows = [
    ['id', 'id', '', 'notes', 'date', 'formula'],
    ['00123', '900719925474099312345', '', '你好 العربية 😀', '2026-10-10', '=1+1'],
    ['1.2300', 'TRUE', '', 'comma, quote " and tab\t', '1900-02-29', '+SUM(A1:A2)'],
    [' spaced ', '-12', '', 'line1\r\nline2\nline3\rline4', '1/2', '@SUM(A1)'],
    ['', '', '', '', '', ''],
    ['short'],
    ['_x0041_', '<script>alert(1)</script>', '_x000d_', 'trailing', '', ''],
]
text = io.StringIO(newline='')
csv.writer(text, lineterminator='\r\n').writerows(rows)
(root / 'typed.csv').write_bytes(text.getvalue().encode('utf-8-sig'))
(root / 'tabs.tsv').write_bytes('identifier\tvalue\r\n00042\t"two\tparts"\r\n'.encode('utf-16'))
(root / 'legacy.csv').write_bytes('name;amount\r\ncafé;001.50\r\n'.encode('cp1252'))
(root / 'directive.csv').write_bytes('sep=;\nname;value\n你好;0007\n'.encode('utf-8'))
