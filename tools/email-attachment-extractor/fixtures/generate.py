from pathlib import Path
from email.message import EmailMessage
from email.policy import SMTP
import json,hashlib
root=Path(__file__).parent
m=EmailMessage(policy=SMTP)
m['Subject']='Attachment collection 世界'
m['From']='Mina <mina@example.test>'
m['To']='Team <team@example.test>'
m['Date']='Thu, 8 Oct 2026 14:35:00 -0700'
m.set_content('Saved message body. Attachments remain separate.')
m.add_alternative('<p>Saved message body.</p><img src="cid:field-chart" alt="Field chart">', subtype='html')
chart=Path('tools/email-viewer/fixtures/inline-chart.png').read_bytes()
m.get_payload()[1].add_related(chart,maintype='image',subtype='png',cid='<field-chart>',filename='chart.png',disposition='inline')
items=[('chart.png',chart,'inline')]
for name,data in [
 ('report.txt',b'FIRST\r\n'),('report.txt',b'SECOND\r\n'),('REPORT.TXT',b'THIRD\r\n'),
 ('report (2).txt',b'EXPLICIT SUFFIX\r\n'),('../folder\\unsafe:name?.bin',bytes(range(256))),
 ('CON.txt',b'RESERVED\n'),('empty.dat',b''),('notes 世界.txt','日本語 العربية\n'.encode()),
 ('display\u202etxt.exe',b'INERT ATTACHMENT BYTES'),('active.html',b'<script>window.__attachmentExecuted=true</script>'),
 ('trailing. ',b'TRAILING'),('',b'UNNAMED')]:
 m.add_attachment(data,maintype='application',subtype='octet-stream',filename=name)
 items.append((name,data,'attachment'))
nested=EmailMessage(policy=SMTP);nested['Subject']='Forwarded original';nested['From']='Sender <sender@example.test>';nested['To']='mina@example.test';nested.set_content('NESTED MESSAGE BODY\n')
m.add_attachment(nested,filename='forwarded.eml')
items.append(('forwarded.eml',nested.as_bytes(),'nested'))
raw=m.as_bytes();(root/'collection.eml').write_bytes(raw);(root/'collection.emlx').write_bytes(str(len(raw)).encode()+b'\n'+raw+b'\n<?xml version="1.0"?><plist/>')
manifest=[]
for i,(name,data,kind) in enumerate(items):
 path=root/f'expected-{i:02d}.bin';path.write_bytes(data)
 manifest.append(dict(index=i,name=name,kind=kind,size=len(data),sha256=hashlib.sha256(data).hexdigest(),expected=path.name))
(root/'expected.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
print(len(items),'attachments',len(raw),'EML bytes')
