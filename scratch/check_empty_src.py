with open('portals/admin/admin-profile.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, line in enumerate(lines):
    if 'src=""' in line or "src=''" in line:
        print(f'Line {i+1}: {line.strip()}')
