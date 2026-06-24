with open('portals/admin/admin-profile.html', 'r', encoding='utf-8') as f:
    content = f.read()
if 'id="pw-form"' in content:
    print('pw-form exists in admin-profile.html')
else:
    print('pw-form NOT FOUND in admin-profile.html')
