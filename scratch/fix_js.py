with open('js/employee-profile.js', 'r', encoding='utf-8') as f: content = f.read()
content = content.replace('  renderView();\n});', '''  renderView();

  if (window.location.search.includes('action=change-password')) {
    setTimeout(() => {
      const btn = document.getElementById('change-pw-btn');
      if (btn) btn.click();
    }, 100);
  }
});''')
with open('js/employee-profile.js', 'w', encoding='utf-8') as f: f.write(content)

admin = content.replace("const EMP_ID = 'EMP002';", "const EMP_ID = 'EMP001';")
with open('js/admin-profile.js', 'w', encoding='utf-8') as f: f.write(admin)

manager = content.replace("const EMP_ID = 'EMP002';", "const EMP_ID = 'EMP001';")
with open('js/manager-profile.js', 'w', encoding='utf-8') as f: f.write(manager)
