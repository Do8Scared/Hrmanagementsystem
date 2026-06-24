import re
with open('portals/employee/employee-profile.html', 'r', encoding='utf-8') as f: content = f.read()
urls = re.findall(r'(?:src|href)="([^"]+)"', content)
print('\n'.join(urls))
