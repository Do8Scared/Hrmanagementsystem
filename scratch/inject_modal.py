import re
import sys

with open('portals/employee/employee-profile.html', 'r', encoding='utf-8') as f:
    emp = f.read()

# Extract modal using regex
modal_match = re.search(r'<!-- Password Modal -->.*?</div>\s*</div>', emp, flags=re.DOTALL)
if not modal_match:
    print('Could not find modal')
    sys.exit(1)

modal_html = modal_match.group(0)

files = ['portals/admin/admin-profile.html', 'portals/manager/manager-profile.html']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<!-- Password Modal -->' not in content:
        content = content.replace('<script src="../../js/shared.js"></script>', modal_html + '\n\n  <script src="../../js/shared.js"></script>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print('Modal injected successfully!')
