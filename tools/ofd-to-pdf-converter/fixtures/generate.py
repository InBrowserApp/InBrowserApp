"""Generate small, owned OFD packages. No external sample content is used."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).parent
NS = 'xmlns:ofd="http://www.ofdspec.org/2016"'


def package(path, documents, signed=False, missing=False, unsupported=False):
    files = {}
    bodies = []
    for document, pages in enumerate(documents, 1):
        prefix = f'Doc{document}'
        bodies.append(f'<ofd:DocBody><ofd:DocInfo><ofd:Title>Owned document {document}</ofd:Title></ofd:DocInfo><ofd:DocRoot>{prefix}/Document.xml</ofd:DocRoot>' + ('<ofd:Signatures>Signatures.xml</ofd:Signatures>' if signed and document == len(documents) else '') + '</ofd:DocBody>')
        entries = []
        for page, (width, height, color) in enumerate(pages, 1):
            entries.append(f'<ofd:Page ID="{page}" BaseLoc="Page{page}.xml"/>')
            shape = f'<ofd:PathObject ID="{1000+page}" Boundary="2 2 {width-4} {height-4}" Fill="true" Stroke="false"><ofd:FillColor Value="{color}"/><ofd:AbbreviatedData>M 0 0 L {width-4} 0 L {width-4} {height-4} L 0 {height-4} C</ofd:AbbreviatedData></ofd:PathObject>'
            if unsupported:
                shape += '<ofd:CompositeObject ID="9999" Boundary="1 1 2 2" ResourceID="42"/>'
            files[f'{prefix}/Page{page}.xml'] = f'<ofd:Page {NS}><ofd:Area><ofd:PhysicalBox>0 0 {width} {height}</ofd:PhysicalBox></ofd:Area><ofd:Content><ofd:Layer ID="{2000+page}">{shape}</ofd:Layer></ofd:Content></ofd:Page>'
        # Deliberately omit the default box: each page supplies its own dimensions.
        files[f'{prefix}/Document.xml'] = f'<ofd:Document {NS}><ofd:CommonData/><ofd:Pages>{"".join(entries)}</ofd:Pages></ofd:Document>'
    files['OFD.xml'] = f'<ofd:OFD {NS} DocType="OFD" Version="1.0">{"".join(bodies)}</ofd:OFD>'
    if missing:
        del files['Doc1/Page1.xml']
    with ZipFile(path, 'w', ZIP_DEFLATED) as archive:
        for name, data in files.items():
            archive.writestr(name, data.encode())


if __name__ == '__main__':
    docs = [[(210, 297, '220 30 30'), (297, 210, '30 180 60')], [(100, 150, '30 60 220')]]
    package(ROOT / 'multiple.ofd', docs)
    package(ROOT / 'signed.ofd', docs, signed=True)
    package(ROOT / 'missing.ofd', docs, missing=True)
    package(ROOT / 'unsupported.ofd', docs, unsupported=True)
