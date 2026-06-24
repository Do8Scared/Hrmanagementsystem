import re
with open('portals/admin/admin-profile.html', 'r', encoding='utf-8') as f: content = f.read()
urls = re.findall(r'(src|href)="([^"]+)"', content)
for u in urls:
    print(u[1])
