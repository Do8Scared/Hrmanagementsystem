import os
import shutil
import subprocess

# 1. Move index.html and jobboard.html to root
if os.path.exists('html/index.html'):
    subprocess.run(["git", "mv", "html/index.html", "index.html"])

if os.path.exists('html/jobboard.html'):
    subprocess.run(["git", "mv", "html/jobboard.html", "jobboard.html"])

# 2. Fix links in index.html and jobboard.html
for file in ['index.html', 'jobboard.html']:
    if os.path.exists(file):
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Revert root paths
        content = content.replace('href="../css/', 'href="css/')
        content = content.replace('src="../js/', 'src="js/')
        content = content.replace('src="../assets/', 'src="assets/')
        
        # Fix 404 in jobboard (if it still has href="login.html")
        content = content.replace('href="login.html"', 'href="index.html"')
        content = content.replace('href="html/login.html"', 'href="index.html"')
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)

# 3. Fix js/login.js
login_js_path = 'js/login.js'
if os.path.exists(login_js_path):
    with open(login_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Since index.html is at root, the path to adminportal is html/adminportal/...
    content = content.replace("'adminportal/admin-dashboard.html'", "'html/adminportal/admin-dashboard.html'")
    content = content.replace("'managerportal/manager-dashboard.html'", "'html/managerportal/manager-dashboard.html'")
    content = content.replace("'employeeportal/employee-dashboard.html'", "'html/employeeportal/employee-dashboard.html'")
    
    with open(login_js_path, 'w', encoding='utf-8') as f:
        f.write(content)

# 4. Fix js/shared.js
shared_js_path = 'js/shared.js'
if os.path.exists(shared_js_path):
    with open(shared_js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix currentRole so adminportal -> admin
    # We find: const currentRole = pathParts[pathParts.length - 2];
    # We replace with: const currentDir = pathParts[pathParts.length - 2]; const currentRole = currentDir.replace('portal', '');
    
    content = content.replace("const currentRole = pathParts[pathParts.length - 2];", 
                              "const currentDir = pathParts[pathParts.length - 2];\\n          const currentRole = currentDir ? currentDir.replace('portal', '') : '';")
    
    # Fix logout path: from ../index.html to ../../index.html
    # Wait, my previous code did: content.replace("window.location.href = '../../index.html';", "window.location.href = '../index.html';")
    # I should revert it: if it has '../index.html' but not '../../index.html'
    
    # Let's replace ONLY inside the isPortal block.
    # The code looks like:
    #           if (isPortal) {
    #             window.location.href = '../index.html';
    #           }
    content = content.replace("window.location.href = '../index.html';", "window.location.href = '../../index.html';")
    
    with open(shared_js_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updates applied.")
