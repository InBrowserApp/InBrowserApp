"""Generate synthetic OpenDocument test workbooks; all content is original."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED, ZIP_STORED

ROOT = Path(__file__).parent
MIME = 'application/vnd.oasis.opendocument.spreadsheet'
NS = '''xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:calcext="urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.3"'''
MANIFEST = f'''<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3"><manifest:file-entry manifest:full-path="/" manifest:media-type="{MIME}"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>'''

def archive(name, tables, styles='', manifest=MANIFEST):
    content = f'<?xml version="1.0" encoding="UTF-8"?><office:document-content {NS}><office:body><office:spreadsheet>{tables}</office:spreadsheet></office:body></office:document-content>'
    with ZipFile(ROOT / name, 'w') as z:
        for path, text in [('mimetype', MIME), ('content.xml', content), ('META-INF/manifest.xml', manifest), ('styles.xml', f'<office:document-styles {NS}><office:styles>{styles}</office:styles></office:document-styles>')]:
            z.writestr(path, text, compress_type=ZIP_STORED if path == 'mimetype' else ZIP_DEFLATED)

if __name__ == '__main__':
    archive('typed.ods', '''
<table:table table:name="数据 العربية">
<table:table-header-rows><table:table-row>
<table:table-cell office:value-type="string"><text:p>00123</text:p></table:table-cell>
<table:table-cell office:value-type="float" office:value="123.75"/>
<table:table-cell office:value-type="boolean" office:boolean-value="true"/>
<table:table-cell office:value-type="date" office:date-value="2026-10-10T12:30:00"/>
<table:table-cell office:value-type="percentage" office:value="0.125"/>
<table:table-cell office:value-type="currency" office:value="42.5" office:currency="EUR"/>
<table:table-cell office:value-type="time" office:time-value="PT26H30M"/>
</table:table-row></table:table-header-rows>
<table:table-row><table:table-cell office:value-type="string"><text:p>中文<text:s text:c="2"/>العربية<text:tab/>😀<text:line-break/>next</text:p><text:p>Second paragraph <text:span>bold</text:span><text:a xlink:href="https://example.invalid/link">link</text:a></text:p><office:annotation><text:p>Excluded note</text:p></office:annotation><draw:frame><draw:text-box><text:p>Excluded drawing</text:p><table:table table:name="Not a worksheet"/></draw:text-box></draw:frame></table:table-cell><table:table-cell office:value-type="string" office:string-value="=SUM(A1:A2)"/></table:table-row>
<table:table-row><table:table-cell table:number-columns-spanned="2" office:value-type="string"><text:p>Merged</text:p></table:table-cell><table:covered-table-cell/></table:table-row>
<table:table-row table:number-rows-repeated="2"><table:table-cell/><table:table-cell table:number-columns-repeated="3" office:value-type="float" office:value="5"/></table:table-row>
<table:table-row><table:table-cell table:formula="of:=SUM([.B4:.D5])" office:value-type="float" office:value="30"/><table:table-cell table:formula="of:=1+1" office:value-type="float"/><table:table-cell table:formula="of:=TRUE()" office:value-type="boolean" office:boolean-value="true"/><table:table-cell table:formula="of:=CHAR(65)" office:value-type="string"><text:p>A</text:p></table:table-cell><table:table-cell table:formula="of:=1/0" office:value-type="string" calcext:value-type="error"><text:p>#DIV/0!</text:p></table:table-cell><table:table-cell table:formula="of:=EXTERNAL()" office:value-type="float" office:value="77"/></table:table-row>
<table:table-row><table:table-cell office:value-type="string" office:string-value=""/><table:table-cell office:value-type="date" office:date-value="2026-10-10T14:30:00+02:00"/><table:table-cell office:value-type="time" office:time-value="-PT2H"/></table:table-row>
</table:table><table:table table:name="Empty"/><table:table table:name="Hidden" table:style-name="hidden-child"><table:table-row><table:table-cell office:value-type="string"><text:p>Hidden value</text:p></table:table-cell></table:table-row></table:table>
''', '<style:style style:name="hidden-base" style:family="table"><style:table-properties table:display="false"/></style:style><style:style style:name="hidden-child" style:family="table" style:parent-style-name="hidden-base"/>')
    archive('sparse.ods', '''<table:table table:name="Sparse"><table:table-row><table:table-cell office:value-type="string"><text:p>Start</text:p></table:table-cell></table:table-row><table:table-row table:number-rows-repeated="1048574"><table:table-cell table:number-columns-repeated="16384"/></table:table-row><table:table-row><table:table-cell table:number-columns-repeated="16383"/><table:table-cell office:value-type="string"><text:p>Last cell</text:p></table:table-cell></table:table-row></table:table>''')
    archive('protected.ods', '<table:table table:name="Data"/>', manifest=MANIFEST.replace('manifest:full-path="content.xml" manifest:media-type="text/xml"/>', 'manifest:full-path="content.xml" manifest:media-type="text/xml"><manifest:encryption-data/></manifest:file-entry>'))
