import os, glob, re

# 1. Read employee-profile.html main content
with open('portals/employee/employee-profile.html', 'r', encoding='utf-8') as f:
    emp_profile = f.read()

main_content_match = re.search(r'<main.*?</main>', emp_profile, flags=re.DOTALL)
if main_content_match:
    main_content = main_content_match.group(0)
else:
    print('Could not find main content')

# Create admin-profile.html
with open('portals/admin/admin-dashboard.html', 'r', encoding='utf-8') as f:
    admin_dash = f.read()
admin_dash = re.sub(r'<main.*?</main>', main_content.replace('\\', '\\\\'), admin_dash, flags=re.DOTALL)
admin_dash = admin_dash.replace('admin-dashboard.js', 'admin-profile.js')
admin_dash = admin_dash.replace('<title>Admin Dashboard', '<title>Admin Profile')
admin_dash = re.sub(r'(href="admin-dashboard\.html" class="[^">]*?) bg-secondary([^">]*?")', r'\1\2', admin_dash)

with open('portals/admin/admin-profile.html', 'w', encoding='utf-8') as f:
    f.write(admin_dash)

# Create manager-profile.html
with open('portals/manager/manager-dashboard.html', 'r', encoding='utf-8') as f:
    manager_dash = f.read()
manager_dash = re.sub(r'<main.*?</main>', main_content.replace('\\', '\\\\'), manager_dash, flags=re.DOTALL)
manager_dash = manager_dash.replace('manager-dashboard.js', 'manager-profile.js')
manager_dash = manager_dash.replace('<title>Manager Dashboard', '<title>Manager Profile')
manager_dash = re.sub(r'(href="manager-dashboard\.html" class="[^">]*?) bg-secondary([^">]*?")', r'\1\2', manager_dash)

with open('portals/manager/manager-profile.html', 'w', encoding='utf-8') as f:
    f.write(manager_dash)

print('Profiles scaffolded successfully!')
