import os, glob, re

for role in ['admin', 'manager', 'employee']:
    files = glob.glob(f'portals/{role}/*.html')
    for file in files:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # We want to replace the <div class="py-1"> that contains My Profile.
        pattern = r'<div class="py-1">\s*<button.*?My Profile\s*</button>.*?</div>'
        
        replacement = f'''<div class="py-1">
              <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left" onclick="window.location.href='{role}-profile.html'">
                <i data-lucide="user" style="width: 15px; height: 15px;" class="text-muted-foreground flex-shrink-0"></i>
                My Profile
              </button>
              <button class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left" onclick="window.location.href='{role}-profile.html?action=change-password'">
                <i data-lucide="lock" style="width: 15px; height: 15px;" class="text-muted-foreground flex-shrink-0"></i>
                Change Password
              </button>
            </div>'''
            
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
print('Dropdowns updated!')
