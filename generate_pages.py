import os

# Read the template from admin-dashboard.html
with open('admin-dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into header/sidebar and footer
header_split = content.split('<main class="flex-1 overflow-y-auto p-6 bg-background relative z-10">')
top_part = header_split[0] + '<main class="flex-1 overflow-y-auto p-6 bg-background relative z-10">\n'

footer_split = header_split[1].split('</main>')
bottom_part = '\n    </main>' + footer_split[1]

# We need a function to replace the active state in the sidebar
def set_active_sidebar(html, active_label):
    # This is a basic string manipulation.
    # The active item has style="background: rgba(232,168,0,0.18); color: #FFF5E9;" and nav-indicator
    # We will just replace it by making all items inactive first, then finding the one to make active.
    
    # Actually, simpler: Since I'll manually edit the main content anyway, I can just let the Python script generate the scaffolds.
    pass

pages = [
    {"filename": "admin-employees.html", "title": "Employee Management", "js": "admin-employees.js"},
    {"filename": "admin-payroll.html", "title": "Payroll & Attendance", "js": "admin-payroll.js"},
    {"filename": "admin-attendance.html", "title": "Attendance Management", "js": "admin-attendance.js"},
    {"filename": "admin-leave.html", "title": "Leave Management", "js": "admin-leave.js"},
    {"filename": "admin-recruitment.html", "title": "Recruitment", "js": "admin-recruitment.js"},
    {"filename": "admin-hr.html", "title": "HR Admin / ER", "js": "admin-hr.js"},
    {"filename": "admin-announcements.html", "title": "Announcements", "js": "admin-announcements.js"},
    {"filename": "admin-performance.html", "title": "Performance Evaluation", "js": "admin-performance.js"},
    
    {"filename": "manager-dashboard.html", "title": "Manager Dashboard", "js": "manager-dashboard.js"},
    {"filename": "manager-manpower.html", "title": "Manpower Requests", "js": "manager-manpower.js"},
    {"filename": "manager-interviews.html", "title": "Interview Feedback", "js": "manager-interviews.js"},
    
    {"filename": "employee-dashboard.html", "title": "Employee Dashboard", "js": "employee-dashboard.js"},
    {"filename": "employee-profile.html", "title": "My Profile", "js": "employee-profile.js"},
    {"filename": "employee-attendance.html", "title": "My Attendance", "js": "employee-attendance.js"},
    {"filename": "employee-leave.html", "title": "Leave Requests", "js": "employee-leave.js"},
    {"filename": "employee-payslips.html", "title": "My Payslips", "js": "employee-payslips.js"},
    {"filename": "employee-performance.html", "title": "My Performance", "js": "employee-performance.js"},
    {"filename": "employee-hrcases.html", "title": "My HR Cases", "js": "employee-hrcases.js"},
]

for page in pages:
    # Set the title
    html = top_part.replace('<title>Admin Dashboard - Corazon Travel and Tours</title>', f'<title>{page["title"]} - Corazon Travel and Tours</title>')
    
    # Set the header title
    html = html.replace('<h1 class="text-foreground font-semibold">Dashboard</h1>', f'<h1 class="text-foreground font-semibold">{page["title"]}</h1>')
    
    # Adjust JS include
    btm = bottom_part.replace('<script src="js/admin-dashboard.js"></script>', f'<script src="js/{page["js"]}"></script>')
    
    full_html = html + f'      <!-- Content for {page["title"]} goes here -->\n' + btm
    
    with open(page["filename"], 'w', encoding='utf-8') as f:
        f.write(full_html)
        
    # Create empty JS file
    js_path = os.path.join('js', page['js'])
    if not os.path.exists(js_path):
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(f"// {page['title']} Logic\ndocument.addEventListener('DOMContentLoaded', () => {{\n  \n}});\n")

print("Generated HTML and JS files successfully.")
