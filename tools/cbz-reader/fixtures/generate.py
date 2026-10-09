"""Generate original test artwork and CBZ archives; requires Pillow."""
from io import BytesIO
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).parent
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def art(w=700, h=1000, label='THE LAST LIGHT'):
    image = Image.new('RGB', (w, h), '#f4ead6')
    d = ImageDraw.Draw(image)
    title = ImageFont.truetype(FONT, max(15, w//19))
    small = ImageFont.truetype(FONT, max(12, w//40))
    d.text((w*.06, h*.04), label, fill='#172c37', font=title)
    for i, (left, top, right, bottom) in enumerate([(0.06,.14,.94,.49),(.06,.52,.48,.91),(.52,.52,.94,.91)]):
        x1,y1,x2,y2=map(int,(left*w,top*h,right*w,bottom*h))
        d.rectangle((x1,y1,x2,y2),fill=['#284957','#b46b48','#778a79'][i],outline='#172c37',width=max(2,w//150))
        d.ellipse((x1+(x2-x1)*.6,y1+20,x2-20,y1+(y2-y1)*.55),fill='#edc46b')
        d.polygon([(x1,y2),(x1+(x2-x1)*.3,y1+(y2-y1)*.5),(x1+(x2-x1)*.7,y2)],fill='#172c37')
        d.rounded_rectangle((x1+12,y1+12,x1+(x2-x1)*.54,y1+55),radius=8,fill='#fbf8ef')
        d.text((x1+20,y1+20),['One more dawn.','Keep going.','We are here.'][i],fill='#172c37',font=small)
    d.text((w*.06,h*.94),'Original artwork • CBZ reader test fixture',fill='#172c37',font=small)
    return image

def encoded(image, fmt):
    out=BytesIO();image.save(out,format=fmt);return out.getvalue()
portrait=art();landscape=art(1400,700,'ACROSS THE QUIET VALLEY')
transparent=portrait.convert('RGBA');ImageDraw.Draw(transparent).rectangle((0,0,100,100),fill=(0,0,0,0))
pages={
 'chapter2/page0.png': b'broken image',
 'chapter2/page1.png': encoded(portrait,'PNG'),
 'chapter2/page2.jpg': encoded(landscape,'JPEG'),
 'chapter2/page3.webp': encoded(portrait,'WEBP'),
 'chapter2/page4.gif': encoded(portrait,'GIF'),
 'chapter2/page5.bmp': encoded(portrait.resize((280,400)),'BMP'),
 'chapter2/page6.avif': encoded(portrait,'AVIF'),
 'chapter2/page7.png': encoded(art(4200,6000,'HIGH RESOLUTION'),'PNG'),
 'chapter2/page10.tiff': b'unsupported',
 'chapter10/page1.svg': b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><image href="https://example.invalid/tracking"/></svg>',
 'chapter10/page2.png': encoded(transparent.resize((140,200)),'PNG'),
 'ComicInfo.xml': b'<ComicInfo><Pages><Page Image="99"/></Pages></ComicInfo>',
 '__MACOSX/._cover.png': b'ignored', '.hidden.png': b'ignored',
 'readme.txt': b'Original fixtures, no external assets',
}
def archive(name, entries):
    with ZipFile(ROOT/name,'w',ZIP_DEFLATED) as z:
        for path,data in entries.items():z.writestr(path,data)
avif=bytearray(pages['chapter2/page6.avif']);avif[8:12]=b'mif1'
archive('avif-compatible.cbz',{'page1.avif':bytes(avif)})
archive('representative.cbz',pages)
archive('empty.cbz',{'ComicInfo.xml':b'<ComicInfo/>'})
archive('unsupported.cbz',{'page1.svg':pages['chapter10/page1.svg'],'page2.tiff':b'unsupported'})
archive('long.cbz',{f'page{i}.png': encoded(Image.new('RGB',(7,10),'#284957'),'PNG') for i in range(1,1202)})
archive('disguised-svg.cbz',{'page1.png':pages['chapter10/page1.svg']})
(ROOT/'corrupt.cbz').write_bytes(b'PK\x03\x04truncated')
