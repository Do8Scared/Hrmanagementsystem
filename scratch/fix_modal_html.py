import re

# Read the full modal from employee-profile.html
with open('portals/employee/employee-profile.html', 'r', encoding='utf-8') as f:
    emp = f.read()

# Extract modal perfectly
modal_match = re.search(r'<!-- Password Modal -->.*?</div>\s*</div>\s*(?=<script src="../../js/shared.js">)', emp, flags=re.DOTALL)
if modal_match:
    full_modal = modal_match.group(0).strip()
else:
    print('Modal not found in employee-profile.html')
    exit(1)

# Fix truncated modal in admin and manager profiles
files = ['portals/admin/admin-profile.html', 'portals/manager/manager-profile.html']
for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove the truncated modal
    truncated_match = re.search(r'<!-- Password Modal -->.*?(?=<script src="../../js/shared.js">)', content, flags=re.DOTALL)
    if truncated_match:
        content = content.replace(truncated_match.group(0), full_modal + '\n\n  ')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {file}')
    else:
        print(f'Truncated modal not found in {file}')
