"""Generate tiny original test fonts; no third-party font outlines are used."""
from pathlib import Path
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.feaLib.builder import addOpenTypeFeaturesFromString

root = Path(__file__).parent
order = ['.notdef', 'space', 'A', 'B', 'C', 'e', 'acute', 'eacute', 'f', 'i', 'fi', 'A.alt', 'smile']
cmap = {32: 'space', 65: 'A', 66: 'B', 67: 'C', 101: 'e', 0x301: 'acute', 0xe9: 'eacute', 102: 'f', 105: 'i', 0x1f600: 'smile'}

def build(cff=False):
    fb = FontBuilder(1000, isTTF=not cff)
    fb.setupGlyphOrder(order)
    fb.setupCharacterMap(cmap)
    glyphs = {}
    for name in order:
        pen = T2CharStringPen(600, None) if cff else TTGlyphPen(None)
        if name != 'space':
            pen.moveTo((50, 0)); pen.lineTo((300, 700)); pen.lineTo((550, 0)); pen.closePath()
        glyphs[name] = pen.getCharString() if cff else pen.glyph()
    if cff:
        fb.setupCFF('SubsetFixture', {'FullName': 'Subset Fixture', 'FamilyName': 'Subset Fixture', 'Weight': 'Regular'}, glyphs, {})
    else:
        fb.setupGlyf(glyphs)
    fb.setupHorizontalMetrics({name: (600, 50) for name in order})
    fb.setupHorizontalHeader(ascent=800, descent=-200)
    fb.setupNameTable({'familyName': 'Subset Fixture', 'styleName': 'Regular', 'uniqueFontIdentifier': 'SubsetFixture-Regular', 'fullName': 'Subset Fixture Regular', 'psName': 'SubsetFixture-Regular'})
    fb.setupOS2(sTypoAscender=800, sTypoDescender=-200, usWinAscent=800, usWinDescent=200)
    fb.setupPost()
    fb.setupMaxp()
    addOpenTypeFeaturesFromString(fb.font, 'feature liga { sub f i by fi; } liga; feature ss01 { sub A by A.alt; } ss01;')
    return fb

static = build()
static.save(root / 'static.ttf')
for flavor in ['woff', 'woff2']:
    static.font.flavor = flavor
    static.font.save(root / f'static.{flavor}')
variable = build()
variable.setupFvar([('wght', 100, 400, 900, 'Weight'), ('wdth', 75, 100, 125, 'Width')], [])
variable.setupGvar({name: [] for name in order})
variable.save(root / 'variable.ttf')
build(cff=True).save(root / 'cff.otf')
