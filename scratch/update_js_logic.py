import os

files = ['js/employee-profile.js', 'js/admin-profile.js', 'js/manager-profile.js']

injection = '''
  if (window.location.search.includes('action=change-password')) {
    setTimeout(() => {
      const btn = document.getElementById('change-pw-btn');
      if (btn) btn.click();
    }, 100);
  }
'''

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'action=change-password' not in content:
        content = content.replace('});', injection + '\n});')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

print('JS logic updated!')
