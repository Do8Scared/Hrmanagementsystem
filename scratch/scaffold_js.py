import os

with open('js/employee-profile.js', 'r', encoding='utf-8') as f:
    js = f.read()

admin_js = js.replace("const EMP_ID = 'EMP002';", "const EMP_ID = 'EMP001';")
with open('js/admin-profile.js', 'w', encoding='utf-8') as f:
    f.write(admin_js)

manager_js = js.replace("const EMP_ID = 'EMP002';", "const EMP_ID = 'EMP001';")
with open('js/manager-profile.js', 'w', encoding='utf-8') as f:
    f.write(manager_js)

print("JS files created successfully!")
