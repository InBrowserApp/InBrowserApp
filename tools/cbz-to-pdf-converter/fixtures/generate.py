"""Original geometric artwork, generated with Pillow. No external documents."""
from pathlib import Path
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
from PIL import Image, ImageDraw
ROOT = Path(__file__).parent

def artwork(size=(80, 120)):
    image = Image.new('RGB', size, '#edc46b')
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, size[0]//2-1, size[1]//2-1), fill='#e02020')
    draw.rectangle((size[0]//2, 0, size[0]-1, size[1]//2-1), fill='#2040e0')
    draw.rectangle((0, size[1]//2, size[0]//2-1, size[1]-1), fill='#208020')
    return image

def encode(image, fmt, **options):
    out = BytesIO(); image.save(out, format=fmt, **options); return out.getvalue()

portrait = artwork()
landscape = artwork((160, 80))
alpha = portrait.convert('RGBA')
ImageDraw.Draw(alpha).rectangle((0, 0, 39, 59), fill=(0, 0, 0, 0))
rotated = artwork((120, 80))
exif = Image.Exif(); exif[274] = 6
entries = {
    '章2/page10.png': encode(alpha, 'PNG'),
    '章2/page2.jpg': encode(landscape, 'JPEG', quality=95),
    '章2/page1.png': encode(portrait, 'PNG'),
    '章2/page3.webp': encode(portrait, 'WEBP', lossless=True),
    '章2/page4.gif': encode(portrait, 'GIF'),
    '章2/page5.bmp': encode(portrait, 'BMP'),
    '章2/page6.avif': encode(portrait, 'AVIF', quality=95),
    '章2/page7.jpg': encode(rotated, 'JPEG', quality=95, exif=exif),
    '章2/page8.gif': encode(Image.new('RGB',(80,120),'#e02020'), 'GIF', save_all=True, append_images=[Image.new('RGB',(80,120),'#2040e0')], duration=30, loop=0),
    '章2/page9.webp': encode(Image.new('RGB',(80,120),'#e02020'), 'WEBP', save_all=True, append_images=[Image.new('RGB',(80,120),'#2040e0')], duration=30, loop=0, lossless=True),
    '章10/page1.png': encode(portrait, 'PNG'),
    'ComicInfo.xml': b'<ComicInfo><Pages><Page Image="2"/></Pages></ComicInfo>',
    '.hidden.png': b'ignored',
    '__MACOSX/._page.png': b'ignored',
}
with ZipFile(ROOT/'complete.cbz','w',ZIP_DEFLATED) as archive:
    for name, data in entries.items(): archive.writestr(name,data)
with ZipFile(ROOT/'later-damaged.cbz','w',ZIP_DEFLATED) as archive:
    archive.writestr('page1.png',encode(portrait,'PNG'))
    archive.writestr('page2.png',b'broken image')
