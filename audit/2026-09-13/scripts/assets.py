from pathlib import Path
from html.parser import HTMLParser
import json
from PIL import Image,ImageOps,ImageDraw
root=Path('C:/Users/ATDSOL/Working Directory/Personal Project/Bitas2026')
out=root/'audit/2026-09-13'
out.mkdir(parents=True,exist_ok=True)
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.img=[];self.placeholders=0
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='img':self.img.append(a)
  if 'capture-frame' in a.get('class',''):self.placeholders+=1
p=Parser();p.feed((root/'leanix-bitas-2026-demo.html').read_text(encoding='utf-8'))
rows=[]
for x in p.img:
 f=root/x['src']; im=Image.open(f)
 rows.append({'src':x['src'],'bytes':f.stat().st_size,'dimensions':im.size,'format':im.format})
contact=Image.new('RGB',(1500,((len(rows)+2)//3)*370),'#ddd');d=ImageDraw.Draw(contact)
for i,r in enumerate(rows):
 im=Image.open(root/r['src']).convert('RGB');im.thumbnail((480,330));x=(i%3)*500+10;y=(i//3)*370+30;contact.paste(im,(x,y));d.text((x,y-22),f"{i+1:02} {r['src']}",fill='black')
contact.save(out/'asset-contact-sheet.jpg',quality=88)
result={'images':rows,'totalImageBytes':sum(r['bytes'] for r in rows),'placeholders':p.placeholders,'unusedAssets':[f.name for f in (root/'assets').iterdir() if 'assets/'+f.name not in [r['src'] for r in rows]]}
(out/'assets.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result,indent=2))
